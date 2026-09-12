import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AppLayout } from '@/components/layout/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { CustomerFormPage } from '@/pages/CustomerFormPage';
import { QuotationsPage } from '@/pages/QuotationsPage';
import { QuotationFormPage } from '@/pages/QuotationFormPage';
import { QuotationDetailPage } from '@/pages/QuotationDetailPage';
import { SettingsPage } from '@/pages/SettingsPage';

interface PageState {
  page: string;
  data?: any;
}

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your business' },
  customers: { title: 'Customers', subtitle: 'Manage your customer database' },
  'customer-form': { title: 'Customer', subtitle: 'Manage customer details' },
  quotations: { title: 'Quotations', subtitle: 'Manage your quotations' },
  'quotation-form': { title: 'Quotation', subtitle: 'Create or edit a quotation' },
  'quotation-detail': { title: 'Quotation Details', subtitle: 'View quotation' },
  settings: { title: 'Settings', subtitle: 'Manage your account & preferences' },
};

function App() {
  const { isAuthenticated } = useAuthStore();

  // If already logged in on page load, go straight to dashboard. Otherwise landing.
  const [pageState, setPageState] = useState<PageState>(() => ({
    page: isAuthenticated ? 'dashboard' : 'landing',
  }));

  const navigate = useCallback((page: string, data?: any) => {
    setPageState({ page, data });
    window.scrollTo(0, 0);
  }, []);

  // When user logs out, send them to landing
  useEffect(() => {
    if (!isAuthenticated && !['landing', 'login', 'register'].includes(pageState.page)) {
      setPageState({ page: 'landing' });
    }
  }, [isAuthenticated, pageState.page]);

  // When user logs in (isAuthenticated becomes true), send them to dashboard
  useEffect(() => {
    if (isAuthenticated && ['landing', 'login', 'register'].includes(pageState.page)) {
      setPageState({ page: 'dashboard' });
    }
  }, [isAuthenticated, pageState.page]);

  // ───────────── UNAUTHENTICATED ROUTES ─────────────
  if (!isAuthenticated) {
    if (pageState.page === 'register') {
      return <RegisterPage onNavigate={navigate} />;
    }
    if (pageState.page === 'login') {
      return <LoginPage onNavigate={navigate} />;
    }
    return <LandingPage onNavigate={navigate} />;
  }

  // ───────────── AUTHENTICATED ROUTES ─────────────
  const currentPage = pageState.page;
  const pageInfo = pageTitles[currentPage] || { title: 'Dashboard', subtitle: 'Overview of your business' };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'customers':
        return <CustomersPage onNavigate={navigate} />;
      case 'customer-form':
        return (
          <CustomerFormPage
            customer={pageState.data?.customer}
            onNavigate={navigate}
          />
        );
      case 'quotations':
        return <QuotationsPage onNavigate={navigate} />;
      case 'quotation-form':
        return (
          <QuotationFormPage
            quotation={pageState.data?.quotation}
            onNavigate={navigate}
          />
        );
      case 'quotation-detail':
        return (
          <QuotationDetailPage
            quotationId={pageState.data?.id}
            onNavigate={navigate}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={navigate}
      title={pageInfo.title}
      subtitle={pageInfo.subtitle}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
