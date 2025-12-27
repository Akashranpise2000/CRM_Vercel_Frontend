import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/lib/theme-context'
import { AuthProvider } from '@/lib/auth-context'
import { Providers } from '@/app/providers'
import AuthLayout from '@/app/auth-layout'
import Dashboard from '@/app/page'
import CompaniesPage from '@/app/companies/page'
import ContactsPage from '@/app/contacts/page'
import ContactDetailPage from '@/app/contacts/[id]/page'
import AddContactPage from '@/app/contacts/add/page'
import LeadsPage from '@/app/leads/page'
import OpportunitiesPage from '@/app/opportunities/page'
import ExpensesPage from '@/app/expenses/page'
import CalendarPage from '@/app/calendar/page'
import CompetitorsPage from '@/app/competitors/page'
import ImportPage from '@/app/import/page'
import SettingsPage from '@/app/settings/page'
import LoginPage from '@/app/auth/login/page'
import SignupPage from '@/app/auth/signup/page'

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="crm-ui-theme">
        <AuthProvider>
          <AuthLayout>
            <Providers>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/contacts/:id" element={<ContactDetailPage />} />
                <Route path="/contacts/add" element={<AddContactPage />} />
                <Route path="/leads" element={<LeadsPage />} />
                <Route path="/opportunities" element={<OpportunitiesPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/competitors" element={<CompetitorsPage />} />
                <Route path="/import" element={<ImportPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/signup" element={<SignupPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Providers>
          </AuthLayout>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App