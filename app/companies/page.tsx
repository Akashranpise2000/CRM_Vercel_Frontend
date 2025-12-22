"use client";

import { useState, useEffect } from "react";
import { useCRMStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Building2, Users, MapPin, Briefcase, Upload, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Company } from "@/types";

import AddCompanyModal from "./AddCompanyModel";
import EditCompanyModal from "./EditCompanyModal";
import CompanyDetailDrawer from "./CompanyDetailDrawer";
import CompaniesList from "./CompaniesList";
import { CompanyImportDialog } from "@/components/companies/company-import-dialog";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [detailCompany, setDetailCompany] = useState<Company | null>(null);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const companies = useCRMStore((state) => state.companies);
  const settings = useCRMStore((state) => state.settings);
  const fetchCompanies = useCRMStore((state) => state.fetchCompanies);
  const deleteCompany = useCRMStore((state) => state.deleteCompany);
  const selectedCompany = useCRMStore((state) => state.selectedCompany);
  const relatedContacts = useCRMStore((state) => state.relatedContacts);
  const setSelectedCompany = useCRMStore((state) => state.setSelectedCompany);
  const fetchContactsByCompany = useCRMStore((state) => state.fetchContactsByCompany);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // ---------- STATS CALCULATIONS ----------
  const totalCompanies = companies.length;
  const companiesWithContacts = companies.filter(c => c.contacts && c.contacts.length > 0).length;
  const companiesWithAddress = companies.filter(c =>
    (typeof c.address === 'string' && (c.address as string).trim()) ||
    (typeof c.address === 'object' && c.address && (c.address.city || c.address.street || c.address.country))
  ).length;
  const uniqueSectors = new Set(companies.map(c => c.sector || c.industry).filter(Boolean)).size;

  // Get unique emails and phones for filter dropdowns
  const availableEmails = Array.from(new Set(companies.map(c => c.email).filter((e): e is string => Boolean(e)))).sort();
  const availablePhones = Array.from(new Set(companies.map(c => c.phone).filter((p): p is string => Boolean(p)))).sort();

  // ---------- FILTER LOGIC ----------
  const filteredCompanies = companies.filter((company) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      company.name.toLowerCase().includes(searchLower) ||
      company.email?.toLowerCase().includes(searchLower) ||
      company.phone?.toLowerCase().includes(searchLower) ||
      company.sector?.toLowerCase().includes(searchLower) ||
      company.poc?.name?.toLowerCase().includes(searchLower) ||
      company.industry?.toLowerCase().includes(searchLower) ||
      (company.contacts && Array.isArray(company.contacts) && company.contacts.some(contact =>
        typeof contact === 'object' && contact.first_name &&
        `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchLower)
      ));

    const matchesEmail = !emailFilter || company.email === emailFilter;

    const matchesPhone = !phoneFilter || company.phone === phoneFilter;

    return matchesSearch && matchesEmail && matchesPhone;
  });

  // ---------- CLICK HANDLERS ----------
  const openCompanyDetails = (company: Company) => {
    setDetailCompany(company);
    setShowDetailDrawer(true);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    fetchContactsByCompany(company.id);
  };

  const openEditModal = (company: Company) => {
    setEditCompany(company);
  };

  const handleDelete = async (company: Company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      await deleteCompany(company.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Companies</h1>
                <p className="text-slate-600 mt-1">Manage your business relationships and partnerships</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setShowImportDialog(true)} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Companies
              </Button>
              <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Companies</p>
                    <p className="text-2xl font-bold text-slate-900">{totalCompanies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">With Contacts</p>
                    <p className="text-2xl font-bold text-slate-900">{companiesWithContacts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">With Address</p>
                    <p className="text-2xl font-bold text-slate-900">{companiesWithAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Sectors</p>
                    <p className="text-2xl font-bold text-slate-900">{uniqueSectors}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">Search & Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search companies by name, email, phone, sector, POC, or contact..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {(emailFilter || phoneFilter) && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {(emailFilter ? 1 : 0) + (phoneFilter ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="rounded-lg border bg-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Filters</h3>
                  {(emailFilter || phoneFilter) && (
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEmailFilter("");
                      setPhoneFilter("");
                    }}>
                      <X className="mr-1 h-3 w-3" />
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Select value={emailFilter || "all"} onValueChange={(value) => setEmailFilter(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All emails" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All emails</SelectItem>
                        {availableEmails.map((email) => (
                          <SelectItem key={email} value={email}>
                            {email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Select value={phoneFilter || "all"} onValueChange={(value) => setPhoneFilter(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All phones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All phones</SelectItem>
                        {availablePhones.map((phone) => (
                          <SelectItem key={phone} value={phone}>
                            {phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quick Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Filter by keyword..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Active Filter Tags */}
                {(emailFilter || phoneFilter) && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {emailFilter && (
                        <Badge variant="secondary" className="gap-1">
                          Email: {emailFilter}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setEmailFilter("")} />
                        </Badge>
                      )}
                      {phoneFilter && (
                        <Badge variant="secondary" className="gap-1">
                          Phone: {phoneFilter}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setPhoneFilter("")} />
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Companies List */}
            <div className="pt-4">
              <CompaniesList
                companies={filteredCompanies}
                onSelect={(company) => {
                  openCompanyDetails(company);
                  handleCompanySelect(company);
                }}
                onEdit={(company) => openEditModal(company)}
                onDelete={(company) => handleDelete(company)}
                selectedCompany={selectedCompany}
              />
              {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No companies found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Related Contacts Section */}
        {selectedCompany && relatedContacts.length > 0 && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Contacts at {selectedCompany.name}
              </CardTitle>
              <p className="text-sm text-slate-600">
                {relatedContacts.length} contact{relatedContacts.length !== 1 ? 's' : ''} associated with this company
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {relatedContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {contact.first_name?.[0]}{contact.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{contact.first_name} {contact.last_name}</p>
                        <p className="text-sm text-slate-600">{contact.position || 'No position'}</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                          {contact.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* MODALS + DRAWER */}
        <AddCompanyModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
        />

        <EditCompanyModal
          company={editCompany}
          onClose={() => setEditCompany(null)}
        />

        <CompanyDetailDrawer
          company={detailCompany}
          open={showDetailDrawer}
          onClose={() => setShowDetailDrawer(false)}
        />

        <CompanyImportDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
        />
      </div>
    </div>
  );
}
