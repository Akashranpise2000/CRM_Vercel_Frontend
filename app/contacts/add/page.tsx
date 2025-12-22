'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCRMStore } from '@/lib/store';
import { AddContactForm } from '@/components/contacts/add-contact-form';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ContactFormData {
  name: string;
  title: string;
  company_id: string;
  past_companies: string;
  reporting_manager: string;
  phone: string;
  email: string;
  address_block: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_country: string;
  address_postal_code: string;
}

export default function AddContactPage() {
  const router = useRouter();
  const addContact = useCRMStore((state) => state.addContact);
  const companies = useCRMStore((state) => state.companies);
  const fetchCompanies = useCRMStore((state) => state.fetchCompanies);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managerSearchQuery, setManagerSearchQuery] = useState('');
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateContact, setDuplicateContact] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);




  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Split name into first and last name
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      let companyId = undefined;

      // Handle company association
      if (data.company_id) {
        // Find existing company by ID
        let company = companies.find(c => c.id === data.company_id);

        if (!company) {
          // Company doesn't exist, this shouldn't happen with the dropdown
          console.warn('Company not found for ID:', data.company_id);
        } else {
          companyId = company.id;
        }
      }

      // Legacy handling for current_company if it exists (for backward compatibility)
      if ((data as any).current_company && !(data as any).company_id) {
        // Find existing company by name
        let company = companies.find(c => c.name.toLowerCase() === (data as any).current_company.toLowerCase());

        if (!company) {
          // Company doesn't exist, create it
          try {
            const companyResponse = await fetch('/api/companies', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: (data as any).current_company,
                // Add other company fields if available from address
                address: data.address_street || data.address_city || data.address_state || data.address_country ? {
                  street: data.address_street,
                  city: data.address_city,
                  state: data.address_state,
                  country: data.address_country,
                  zipCode: data.address_postal_code,
                } : undefined,
              }),
            });

            if (companyResponse.ok) {
              const newCompany = await companyResponse.json();
              companyId = newCompany.data.id;
              // Refresh companies list
              fetchCompanies();
            }
          } catch (error) {
            console.error('Error creating company:', error);
            // Continue without company association
          }
        } else {
          companyId = company.id;
        }
      }

      // Prepare notes with past companies if any
      const notes = data.past_companies ? `Past Companies: ${data.past_companies}` : undefined;

      // Prepare contact data for API
      const contactData = {
        first_name: firstName,
        last_name: lastName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        position: data.title || undefined,
        company_id: companyId,
        notes: notes,
        address: {
          street: [data.address_block, data.address_street].filter(Boolean).join(', ') || undefined,
          city: data.address_city || undefined,
          state: data.address_state || undefined,
          zipCode: data.address_postal_code || undefined,
          country: data.address_country || undefined,
        },
      };

      const newContact = await addContact(contactData);

      toast({
        title: 'Success',
        description: 'Contact has been created successfully.',
      });

      router.push('/contacts');
    } catch (error: any) {
      console.error('Error creating contact:', error);

      // Handle duplicate contact error
      if (error.name === 'DuplicateContactError') {
        setDuplicateContact((error as any).duplicate);
        setShowDuplicateDialog(true);
      } else {
        toast({
          title: 'Error',
          description: error?.message || 'Failed to create contact. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/contacts');
  };

  return (
    <>
      <AddContactForm
        onSubmit={onSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        managerSearchQuery={managerSearchQuery}
        showManagerDropdown={showManagerDropdown}
        onManagerSearchChange={setManagerSearchQuery}
        setShowManagerDropdown={setShowManagerDropdown}
      />

      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate Contact Found</AlertDialogTitle>
            <AlertDialogDescription>
              A contact with similar information already exists in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {duplicateContact && (
            <div className="space-y-2">
              <div className="text-sm">
                <strong>Name:</strong> {duplicateContact.name}
              </div>
              {duplicateContact.email && (
                <div className="text-sm">
                  <strong>Email:</strong> {duplicateContact.email}
                </div>
              )}
              {duplicateContact.phone && (
                <div className="text-sm">
                  <strong>Phone:</strong> {duplicateContact.phone}
                </div>
              )}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDuplicateDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
