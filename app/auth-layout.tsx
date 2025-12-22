'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { CompetitorSidebar } from '@/components/competitors/competitor-sidebar';
import type { Competitor } from '@/types';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Mobile menu state management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Competitor sidebar state management
  const [competitorSidebarOpen, setCompetitorSidebarOpen] = useState(false);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

  // Load competitors from localStorage on mount
  useEffect(() => {
    const savedCompetitors = localStorage.getItem('crm-competitors');
    if (savedCompetitors) {
      try {
        setCompetitors(JSON.parse(savedCompetitors));
      } catch (error) {
        console.error('Error loading competitors:', error);
      }
    }
  }, []);

  // Save competitors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('crm-competitors', JSON.stringify(competitors));
  }, [competitors]);

  // Competitor management functions
  const handleAddCompetitor = (competitorData: Omit<Competitor, 'id' | 'created_at' | 'updated_at'>) => {
    const newCompetitor: Competitor = {
      ...competitorData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCompetitors(prev => [...prev, newCompetitor]);
  };

  const handleUpdateCompetitor = (id: string, updates: Partial<Competitor>) => {
    setCompetitors(prev => prev.map(competitor =>
      competitor.id === id
        ? { ...competitor, ...updates, updated_at: new Date().toISOString() }
        : competitor
    ));
  };

  const handleDeleteCompetitor = (id: string) => {
    setCompetitors(prev => prev.filter(competitor => competitor.id !== id));
  };

  useEffect(() => {
    console.log('AuthLayout - Auth state change:', { user: user?.email, loading, pathname });

    // If still loading auth state, don't redirect yet
    if (loading) {
      return;
    }

    // If not authenticated and not on auth pages, redirect to login
    if (!user && !pathname.startsWith('/auth/login') && !pathname.startsWith('/auth/signup')) {
      console.log('Redirecting to login - no user found');
      router.push('/auth/login');
      return;
    }

    // If authenticated and on auth pages, redirect to dashboard
    if (user && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup'))) {
      console.log('User authenticated, redirecting to dashboard');
      router.push('/');
      return;
    }
  }, [user, loading, pathname, router]);

  // Show loading spinner while checking authentication
  if (loading || (!user && pathname === '/')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show dashboard layout
  if (user) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuChange={setMobileMenuOpen}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            onMenuClick={() => setMobileMenuOpen(true)}
            onCompetitorToggle={() => setCompetitorSidebarOpen(!competitorSidebarOpen)}
            competitorCount={competitors.length}
          />
          <main className="flex-1 overflow-auto bg-background p-6">
            {children}
          </main>
        </div>
        <CompetitorSidebar
          isOpen={competitorSidebarOpen}
          onClose={() => setCompetitorSidebarOpen(false)}
          competitors={competitors}
          onAddCompetitor={handleAddCompetitor}
          onUpdateCompetitor={handleUpdateCompetitor}
          onDeleteCompetitor={handleDeleteCompetitor}
        />
      </div>
    );
  }

  // If not authenticated, show auth pages without dashboard layout
  return <>{children}</>;
}
