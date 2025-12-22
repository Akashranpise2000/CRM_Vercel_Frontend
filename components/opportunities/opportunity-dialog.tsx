"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CompanyDropdown } from '@/components/ui/company-dropdown';
import { ContactDropdown } from '@/components/ui/contact-dropdown';
import { Opportunity, Company } from '@/types';
import type { ContactOption } from '@/hooks/use-contacts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Building, User } from 'lucide-react';

interface OpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  opportunity?: Opportunity | null;
  contacts?: any[];
}

const statusOptions = [
  { value: 'quality', label: 'Quality' },
  { value: 'meet_contact', label: 'Meet/Contact' },
  { value: 'meet_present', label: 'Meet & Present' },
  { value: 'purpose', label: 'Purpose' },
  { value: 'negotiate', label: 'Negotiate' },
  { value: 'closed_win', label: 'Closed by Win' },
  { value: 'lost', label: 'Lost' },
  { value: 'not_responding', label: 'Not Responding' },
  { value: 'remarks', label: 'Remarks' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const forecastOptions = [
  { value: 'omitted', label: 'Omitted' },
  { value: 'in-pipeline', label: 'In Pipeline' },
  { value: 'bestcase', label: 'Best Case' },
  { value: 'commit', label: 'Commit' },
  { value: 'closed', label: 'Closed' },
];

const stageOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'meet_contact', label: 'Meet/Contact' },
  { value: 'meet_present', label: 'Meet & Present' },
  { value: 'not_responding', label: 'Not Responding' },
];

const importanceOptions = [
  { value: '1', label: '1 (Low)' },
  { value: '2', label: '2 (Medium)' },
  { value: '3', label: '3 (High)' },
];

interface OpportunityFormData {
  title: string;
  key_person_name?: string;
  open_date?: string;
  close_date?: string;
  amount: number;
  description?: string;
  products_pitched?: string[];
  company_id: string;
  contact_id?: string;
  forecast_amount: number;
  status: string;
  sector: string;
  priority: string;
  probability: number;
  owner: string;
  status_remarks: string;
  forecast: string;
  stage: string;
  importance: number;
}

export function OpportunityDialog({ open, onOpenChange, onSubmit, opportunity, contacts = [] }: OpportunityDialogProps) {

  const form = useForm<OpportunityFormData>({
    defaultValues: {
      title: '',
      key_person_name: '',
      open_date: undefined,
      close_date: undefined,
      amount: 0,
      description: '',
      products_pitched: [],
      company_id: '',
      contact_id: undefined,
      forecast_amount: 0,
      status: 'quality',
      sector: '',
      priority: 'medium',
      probability: 0,
      owner: '',
      status_remarks: '',
      forecast: 'in-pipeline',
      stage: 'lead',
      importance: 1,
    },
  });

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactOption | null>(null);

  const status = form.watch('status');

  useEffect(() => {
    if (opportunity) {
      form.reset({
        title: opportunity.title || '',
        key_person_name: opportunity.key_person_name || '',
        open_date: opportunity.open_date ? new Date(opportunity.open_date).toISOString().split('T')[0] : undefined,
        close_date: opportunity.close_date ? new Date(opportunity.close_date).toISOString().split('T')[0] : undefined,
        amount: opportunity.amount,
        description: opportunity.description || '',
        products_pitched: opportunity.products_pitched || [],
        company_id: opportunity.company_id || '',
        contact_id: opportunity.contact_id || undefined,
        forecast_amount: opportunity.forecast_amount,
        status: opportunity.status,
        sector: opportunity.sector || '',
        priority: opportunity.priority,
        probability: opportunity.probability,
        owner: opportunity.owner || '',
        status_remarks: opportunity.status_remarks || '',
        forecast: opportunity.forecast || 'in-pipeline',
        stage: opportunity.stage || 'lead',
        importance: opportunity.importance || 1,
      });
      setSelectedCompany(opportunity.company || null);

      // Set selected contact if opportunity has a contact
      if (opportunity.contact) {
        setSelectedContact({
          id: opportunity.contact.id,
          name: `${opportunity.contact.first_name} ${opportunity.contact.last_name}`,
          email: opportunity.contact.email || '',
          phone: opportunity.contact.phone || '',
          position: opportunity.contact.position || '',
          company: opportunity.contact.company ? {
            id: opportunity.contact.company.id,
            name: opportunity.contact.company.name,
            industry: opportunity.contact.company.industry || ''
          } : null
        });
      } else if (opportunity.contact_id && contacts.length > 0) {
        const contact = contacts.find(c => c.id === opportunity.contact_id);
        if (contact) {
          setSelectedContact({
            id: contact.id,
            name: `${contact.first_name} ${contact.last_name}`,
            email: contact.email || '',
            phone: contact.phone || '',
            position: contact.position || '',
            company: contact.company ? {
              id: contact.company.id,
              name: contact.company.name,
              industry: contact.company.industry || ''
            } : null
          });
        }
      }
    } else {
      form.reset({
        title: '',
        key_person_name: '',
        open_date: undefined,
        close_date: undefined,
        amount: 0,
        description: '',
        products_pitched: [],
        company_id: '',
        contact_id: undefined,
        forecast_amount: 0,
        status: 'quality',
        sector: '',
        priority: 'medium',
        probability: 0,
        owner: '',
        status_remarks: '',
        forecast: 'in-pipeline',
        stage: 'lead',
        importance: 1,
      });
      setSelectedCompany(null);
      setSelectedContact(null);
    }
  }, [opportunity, form, contacts]);

  const handleSubmit = async (data: OpportunityFormData) => {
    // Validate required company
    if (!data.company_id.trim()) {
      form.setError('company_id', { message: 'Company is required' });
      return;
    }

    // Prepare opportunity data
    const opportunityData = {
      title: data.title,
      key_person_name: data.key_person_name,
      open_date: data.open_date ? new Date(data.open_date).toISOString() : undefined,
      close_date: data.close_date ? new Date(data.close_date).toISOString() : undefined,
      amount: data.amount,
      description: data.description,
      products_pitched: data.products_pitched,
      company_id: data.company_id,
      contact_id: data.contact_id || undefined,
      forecast_amount: data.forecast_amount,
      status: data.status,
      sector: data.sector,
      priority: data.priority,
      probability: data.probability,
      owner: data.owner,
      status_remarks: data.status_remarks,
      forecast: data.forecast,
      stage: data.stage,
      importance: data.importance,
    };

    onSubmit(opportunityData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{opportunity ? 'Edit Opportunity' : 'Add Opportunity'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Fields */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opportunity Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key_person_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Person Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="open_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="close_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Close Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="products_pitched"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Products Pitched</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                      placeholder="Enter products separated by commas"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Selection */}
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company *</FormLabel>
                  <FormControl>
                    <CompanyDropdown
                      value={field.value}
                      onChange={(value, company) => {
                        field.onChange(value);
                        setSelectedCompany(company || null);
                      }}
                      placeholder="Select a company"
                      allowCreate={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Selection */}
            <FormField
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <ContactDropdown
                      value={field.value || ''}
                      onChange={(value, contact) => {
                        field.onChange(value);
                        setSelectedContact(contact || null);
                      }}
                      placeholder="Select a contact (optional)"
                      allowCreate={true}
                      contacts={contacts?.map(contact => ({
                        id: contact.id,
                        name: `${contact.first_name} ${contact.last_name}`,
                        email: contact.email || '',
                        phone: contact.phone || '',
                        position: contact.position || '',
                        company: contact.company ? {
                          id: contact.company.id,
                          name: contact.company.name,
                          industry: contact.company.industry || ''
                        } : null
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected Contact Details */}
            {selectedContact && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Selected Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{selectedContact.name}</p>
                        {selectedContact.position && (
                          <p className="text-xs text-muted-foreground">{selectedContact.position}</p>
                        )}
                      </div>
                    </div>

                    {selectedContact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{selectedContact.email}</p>
                      </div>
                    )}

                    {selectedContact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{selectedContact.phone}</p>
                      </div>
                    )}

                    {selectedContact.company && (
                      <div className="flex items-center gap-3">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{selectedContact.company.name}</p>
                          {selectedContact.company.industry && (
                            <p className="text-xs text-muted-foreground">{selectedContact.company.industry}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amounts */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forecast_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forecast Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Other Fields */}
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="probability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Probability (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" max="100" onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="close_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Close Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Fields - Forecast, Stage, Importance, Status Remarks */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="forecast"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forecast</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select forecast" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {forecastOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="importance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Importance</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select importance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {importanceOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status_remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Remarks</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Add remarks about the status..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{opportunity ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
