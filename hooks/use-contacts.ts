'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export interface ContactOption {
  id: string;
  name: string;
  email: string;
  phone: string;
  position?: string;
  company?: {
    id: string;
    name: string;
    industry?: string;
  } | null;
}

export function useContacts(search?: string) {
  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchContacts() {
      try {
        setLoading(true);
        const response = await apiClient.getAllContacts();

        if (response.success && isMounted) {
          // Transform API response to ContactOption format
          let transformedContacts: ContactOption[] = ((response.data as any[]) || []).map(contact => ({
            id: contact._id || contact.id,
            name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
            email: contact.email || '',
            phone: contact.phone || '',
            position: contact.position,
            company: contact.company_id ? {
              id: contact.company_id._id || contact.company_id.id,
              name: contact.company_id.name || '',
              industry: contact.company_id.industry
            } : null
          }));

          // Filter contacts based on search if provided
          if (search && search.trim()) {
            const searchLower = search.toLowerCase();
            transformedContacts = transformedContacts.filter(contact =>
              contact.name.toLowerCase().includes(searchLower) ||
              contact.email.toLowerCase().includes(searchLower) ||
              (contact.position && contact.position.toLowerCase().includes(searchLower)) ||
              (contact.company?.name && contact.company.name.toLowerCase().includes(searchLower))
            );
          }

          setContacts(transformedContacts);
          setError(null);
        } else {
          throw new Error(response.error || 'Failed to fetch contacts');
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchContacts();

    return () => {
      isMounted = false;
    };
  }, [search]);

  const addContact = async (contactData: any) => {
    try {
      const response = await apiClient.createContact(contactData);

      if (response.success) {
        // Refresh contacts list
        const fetchResponse = await apiClient.getAllContacts();
        if (fetchResponse.success) {
          const transformedContacts: ContactOption[] = ((fetchResponse.data as any[]) || []).map(contact => ({
            id: contact._id || contact.id,
            name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
            email: contact.email || '',
            phone: contact.phone || '',
            position: contact.position,
            company: contact.company_id ? {
              id: contact.company_id._id || contact.company_id.id,
              name: contact.company_id.name || '',
              industry: contact.company_id.industry
            } : null
          }));
          setContacts(transformedContacts);
        }
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add contact');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add contact');
      throw err;
    }
  };

  const updateContact = async (id: string, contactData: Omit<ContactOption, 'id'>) => {
    try {
      const response = await apiClient.updateContact(id, contactData);

      if (response.success) {
        // Refresh contacts list
        const fetchResponse = await apiClient.getAllContacts();
        if (fetchResponse.success) {
          const transformedContacts: ContactOption[] = ((fetchResponse.data as any[]) || []).map(contact => ({
            id: contact._id || contact.id,
            name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
            email: contact.email || '',
            phone: contact.phone || '',
            position: contact.position,
            company: contact.company_id ? {
              id: contact.company_id._id || contact.company_id.id,
              name: contact.company_id.name || '',
              industry: contact.company_id.industry
            } : null
          }));
          setContacts(transformedContacts);
        }
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update contact');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contact');
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const response = await apiClient.deleteContact(id);

      if (response.success) {
        // Refresh contacts list
        const fetchResponse = await apiClient.getAllContacts();
        if (fetchResponse.success) {
          const transformedContacts: ContactOption[] = ((fetchResponse.data as any[]) || []).map(contact => ({
            id: contact._id || contact.id,
            name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
            email: contact.email || '',
            phone: contact.phone || '',
            position: contact.position,
            company: contact.company_id ? {
              id: contact.company_id._id || contact.company_id.id,
              name: contact.company_id.name || '',
              industry: contact.company_id.industry
            } : null
          }));
          setContacts(transformedContacts);
        }
      } else {
        throw new Error(response.error || 'Failed to delete contact');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
      throw err;
    }
  };

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact
  };
}