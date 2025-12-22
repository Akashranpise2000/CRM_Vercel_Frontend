'use client';

import { AuthProvider } from '@/lib/auth-context';
<<<<<<< HEAD
=======
import { ThemeProvider } from '@/lib/theme-context';
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
import { Providers } from './providers';
import AuthLayout from './auth-layout';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
<<<<<<< HEAD
    <AuthProvider>
      <AuthLayout>
        <Providers>
          {children}
        </Providers>
      </AuthLayout>
    </AuthProvider>
=======
    <ThemeProvider defaultTheme="light" storageKey="crm-theme">
      <AuthProvider>
        <AuthLayout>
          <Providers>
            {children}
          </Providers>
        </AuthLayout>
      </AuthProvider>
    </ThemeProvider>
>>>>>>> 52c36bae7ccd905b9092e37ff13c3ff68f315feb
  );
}
