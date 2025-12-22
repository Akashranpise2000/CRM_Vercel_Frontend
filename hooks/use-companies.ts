'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Company } from '@/types';

export function useCompanies(search?: string) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCompanies() {
      try {
        setLoading(true);
        // Fetch all companies with a high limit for dropdown
        const response = await apiClient.getCompanies({
          limit: 1000, // High limit for dropdown
          search: search || undefined
        });

        if (response.success && isMounted) {
          setCompanies((response.data as Company[]) || []);
          setError(null);
        } else {
          throw new Error(response.error || 'Failed to fetch companies');
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

    fetchCompanies();

    return () => {
      isMounted = false;
    };
  }, [search]);

  const addCompany = async (companyData: any) => {
    try {
      const response = await apiClient.createCompany(companyData);

      if (response.success) {
        // Refresh companies list
        const fetchResponse = await apiClient.getCompanies({ limit: 1000 });
        if (fetchResponse.success) {
          setCompanies((fetchResponse.data as Company[]) || []);
        }
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add company');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add company');
      throw err;
    }
  };

  const updateCompany = async (id: string, companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await apiClient.updateCompany(id, companyData);

      if (response.success) {
        // Refresh companies list
        const fetchResponse = await apiClient.getCompanies({ limit: 1000 });
        if (fetchResponse.success) {
          setCompanies((fetchResponse.data as Company[]) || []);
        }
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update company');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company');
      throw err;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const response = await apiClient.deleteCompany(id);

      if (response.success) {
        // Refresh companies list
        const fetchResponse = await apiClient.getCompanies({ limit: 1000 });
        if (fetchResponse.success) {
          setCompanies((fetchResponse.data as Company[]) || []);
        }
      } else {
        throw new Error(response.error || 'Failed to delete company');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete company');
      throw err;
    }
  };

  return {
    companies,
    loading,
    error,
    addCompany,
    updateCompany,
    deleteCompany
  };
}