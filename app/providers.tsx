'use client';

import { useEffect } from 'react';
import { useCRMStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const fetchContacts = useCRMStore((state) => state.fetchContacts);
  const fetchCompanies = useCRMStore((state) => state.fetchCompanies);
  const fetchOpportunities = useCRMStore((state) => state.fetchOpportunities);
  const fetchActivities = useCRMStore((state) => state.fetchActivities);
  const fetchExpenses = useCRMStore((state) => state.fetchExpenses);
  const fetchSettings = useCRMStore((state) => state.fetchSettings);
  const fetchLeads = useCRMStore((state) => state.fetchLeads);

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (user) {
      fetchSettings();
      fetchContacts();
      fetchCompanies();
      fetchOpportunities();
      fetchExpenses();
      fetchLeads();
    }
  }, [user, fetchContacts, fetchCompanies, fetchOpportunities, fetchExpenses, fetchSettings, fetchLeads]);

  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
