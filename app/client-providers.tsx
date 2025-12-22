'use client';

import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { Providers } from './providers';
import AuthLayout from './auth-layout';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="crm-theme">
      <AuthProvider>
        <AuthLayout>
          <Providers>
            {children}
          </Providers>
        </AuthLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}
