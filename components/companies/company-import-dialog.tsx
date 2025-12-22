'use client';

import { useState, useRef } from 'react';
import { useCRMStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import * as XLSX from 'xlsx';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Building2,
  X
} from 'lucide-react';
import { Company } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
  duplicates: number;
}

export function CompanyImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addCompany, fetchCompanies } = useCRMStore();
  const { toast } = useToast();

  // Sample Excel structure for download
  const sampleData = [
    {
      'Company Name': 'TechCorp Solutions',
      'Industry': 'Technology',
      'Website': 'https://techcorp.com',
      'Phone': '+1-555-0123',
      'Email': 'contact@techcorp.com',
      'Sector': 'IT Services',
      'Place of Office': 'New York',
      'Head Office': 'San Francisco'
    },
    {
      'Company Name': 'Global Manufacturing Inc',
      'Industry': 'Manufacturing',
      'Website': 'https://globalmfg.com',
      'Phone': '+1-555-0124',
      'Email': 'info@globalmfg.com',
      'Sector': 'Industrial',
      'Place of Office': 'Chicago',
      'Head Office': 'Chicago'
    }
  ];

  // Download sample template as Excel
  const downloadSampleTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Companies');
    XLSX.writeFile(wb, 'companies-template.xlsx');
  };

  // Download sample template as CSV fallback
  const downloadSampleCSV = () => {
    const csvContent = [
      'Company Name,Industry,Website,Phone,Email,Sector,Place of Office,Head Office',
      'TechCorp Solutions,Technology,https://techcorp.com,+1-555-0123,contact@techcorp.com,IT Services,New York,San Francisco',
      'Global Manufacturing Inc,Manufacturing,https://globalmfg.com,+1-555-0124,info@globalmfg.com,Industrial,Chicago,Chicago'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'companies-template.csv';
    link.click();
  };

  // Parse Excel/CSV data
  const parseFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error('Failed to read file'));
            return;
          }

          let workbook;
          if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            // Parse Excel file
            workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
          } else {
            // Parse CSV file
            const csvText = data as string;
            const lines = csvText.split('\n').filter(line => line.trim());
            if (lines.length < 2) {
              resolve([]);
              return;
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const parsedData = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              return row;
            });

            resolve(parsedData);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));

      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // Validate company data
  const validateCompany = (company: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!company['Company Name']?.trim() && !company['company_name']?.trim()) {
      errors.push('Company Name is required');
    }

    const website = company['Website'] || company['website'];
    if (website && !/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(website)) {
      errors.push('Invalid website URL format');
    }

    const email = company['Email'] || company['email'];
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }

    return { valid: errors.length === 0, errors };
  };

  // Process import
  const processImport = async () => {
    if (previewData.length === 0) return;

    setImporting(true);
    const results: ImportResult = {
      imported: 0,
      skipped: 0,
      errors: [],
      duplicates: 0
    };

    try {
      // Validate and prepare companies for bulk import
      const companiesToImport: any[] = [];

      for (const companyData of previewData) {
        const validation = validateCompany(companyData);
        if (!validation.valid) {
          results.errors.push(`${companyData['Company Name'] || companyData.company_name}: ${validation.errors.join(', ')}`);
          results.skipped++;
          continue;
        }

        // Normalize field names (handle both Excel and CSV formats)
        const name = companyData['Company Name'] || companyData.company_name;
        const industry = companyData['Industry'] || companyData.industry;
        const website = companyData['Website'] || companyData.website;
        const phone = companyData['Phone'] || companyData.phone;
        const email = companyData['Email'] || companyData.email;
        const sector = companyData['Sector'] || companyData.sector;
        const placeOfOffice = companyData['Place of Office'] || companyData.placeOfOffice;
        const headOffice = companyData['Head Office'] || companyData.headOffice;

        const companyToCreate = {
          name: name,
          industry: industry || undefined,
          website: website || undefined,
          phone: phone || undefined,
          email: email || undefined,
          sector: sector || undefined,
          placeOfOffice: placeOfOffice || undefined,
          headOffice: headOffice || undefined
        };

        companiesToImport.push(companyToCreate);
      }

      // Bulk import all valid companies
      if (companiesToImport.length > 0) {
        for (const companyData of companiesToImport) {
          await addCompany(companyData);
        }
        results.imported = companiesToImport.length;
      }

      // Refresh companies to ensure real-time updates are reflected
      await fetchCompanies();

      setImportResults(results);

      if (results.imported > 0) {
        toast({
          title: 'Import Complete',
          description: `Successfully imported ${results.imported} companies. They will appear in real-time across all connected users.`,
        });
      } else {
        toast({
          title: 'Import Failed',
          description: 'No companies were imported. Please check your data and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Error',
        description: 'An unexpected error occurred during import. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseFile(file);

      if (data.length === 0) {
        toast({
          title: 'Invalid File',
          description: 'The file appears to be empty or invalid.',
          variant: 'destructive',
        });
        return;
      }

      // Validate data structure
      const firstRow = data[0];
      const headers = Object.keys(firstRow);

      // Check for required columns (handle both Excel and CSV formats)
      const hasCompanyName = headers.some(h => h.toLowerCase().includes('company') || h === 'company_name');

      if (!hasCompanyName) {
        toast({
          title: 'Invalid File Structure',
          description: 'Missing required column: Company Name',
          variant: 'destructive',
        });
        return;
      }

      setPreviewData(data);
      setShowPreview(true);

      toast({
        title: 'File Loaded',
        description: `Successfully loaded ${data.length} companies. Please review before importing.`,
      });
    } catch (error) {
      console.error('File parsing error:', error);
      toast({
        title: 'File Error',
        description: 'Failed to parse file. Please ensure it\'s a valid Excel (.xlsx) or CSV file.',
        variant: 'destructive',
      });
    }
  };

  const resetDialog = () => {
    setImportResults(null);
    setPreviewData([]);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Companies from Excel/CSV
          </DialogTitle>
        </DialogHeader>

        {!showPreview && !importResults && (
          <div className="space-y-6">
            {/* Import Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Import Instructions</CardTitle>
                <CardDescription>
                  Import companies from Excel (.xlsx) or CSV files with the following columns:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Required Columns:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Company Name</strong> (required)</li>
                    <li>• <strong>Industry</strong> (optional)</li>
                    <li>• <strong>Website</strong> (optional)</li>
                    <li>• <strong>Phone</strong> (optional)</li>
                    <li>• <strong>Email</strong> (optional)</li>
                    <li>• <strong>Sector</strong> (optional)</li>
                    <li>• <strong>Place of Office</strong> (optional)</li>
                    <li>• <strong>Head Office</strong> (optional)</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button onClick={downloadSampleTemplate} variant="outline" className="flex-1">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download Excel Template
                  </Button>
                  <Button onClick={downloadSampleCSV} variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload File</CardTitle>
                <CardDescription>
                  Select an Excel (.xlsx) or CSV file to import companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Excel or CSV File</h3>
                  <p className="text-sm text-muted-foreground">
                    Click to select a file or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports .xlsx, .xls, and .csv files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showPreview && !importResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Preview Import Data</h3>
              <Badge variant="secondary">{previewData.length} companies</Badge>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3">Company Name</th>
                      <th className="text-left p-3">Industry</th>
                      <th className="text-left p-3">Website</th>
                      <th className="text-left p-3">Phone</th>
                      <th className="text-left p-3">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((company, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{company['Company Name'] || company.company_name}</td>
                        <td className="p-3">{company['Industry'] || company.industry}</td>
                        <td className="p-3">{company['Website'] || company.website}</td>
                        <td className="p-3">{company['Phone'] || company.phone}</td>
                        <td className="p-3">{company['Email'] || company.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {previewData.length > 10 && (
              <p className="text-sm text-muted-foreground">
                Showing first 10 of {previewData.length} companies
              </p>
            )}

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Back
              </Button>
              <Button onClick={processImport} disabled={importing}>
                {importing ? 'Importing...' : `Import ${previewData.length} Companies`}
              </Button>
            </div>
          </div>
        )}

        {importResults && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Import Results</h3>
              <Button variant="outline" size="sm" onClick={resetDialog}>
                <X className="h-4 w-4 mr-2" />
                Import More
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{importResults.imported}</div>
                  <div className="text-sm text-muted-foreground">Imported</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Building2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{importResults.skipped}</div>
                  <div className="text-sm text-muted-foreground">Skipped</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{importResults.errors.length}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileSpreadsheet className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{importResults.duplicates}</div>
                  <div className="text-sm text-muted-foreground">Duplicates</div>
                </CardContent>
              </Card>
            </div>

            {importResults.errors.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Errors:</div>
                  <ul className="text-sm space-y-1">
                    {importResults.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {importResults.errors.length > 5 && (
                      <li>... and {importResults.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <h4 className="font-medium">Real-time Updates Active</h4>
              </div>
              <p className="text-sm text-green-700 mt-1">
                All imported companies are now visible in real-time across all connected users and devices.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}