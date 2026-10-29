import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import ArchitectureSection from './components/ArchitectureSection';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import OverviewTab from './components/dashboard/OverviewTab';
import DynamicPricingTab from './components/dashboard/DynamicPricingTab';
import ProductsTab from './components/dashboard/ProductsTab';
import SalesTab from './components/dashboard/SalesTab';
import MarketIntelTab from './components/dashboard/MarketIntelTab';
import ReportsTab from './components/dashboard/ReportsTab';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Loader2 } from 'lucide-react';

function MainRouter() {
  const { currentPath, navigate } = useNavigation();
  const { isAuthenticated, loading } = useAuth();

  const isDashboardRoute = [
    '/dashboard',
    '/pricing',
    '/products',
    '/sales',
    '/market',
    '/reports',
  ].includes(currentPath);

  // Protected route enforcement
  useEffect(() => {
    if (!loading && !isAuthenticated && isDashboardRoute) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, isDashboardRoute, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal text-ivory flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-bronze animate-spin" />
        <span className="text-xs font-mono text-ivory-dim tracking-wider uppercase">
          Verifying Session Credentials...
        </span>
      </div>
    );
  }

  // Public Auth Pages
  if (currentPath === '/login') {
    return <LoginPage />;
  }

  if (currentPath === '/register') {
    return <RegisterPage />;
  }

  // Dashboard Pages (Phase 3)
  if (currentPath === '/dashboard') {
    return (
      <DashboardLayout activeTab="overview">
        <OverviewTab />
      </DashboardLayout>
    );
  }

  if (currentPath === '/pricing') {
    return (
      <DashboardLayout activeTab="pricing">
        <DynamicPricingTab />
      </DashboardLayout>
    );
  }

  if (currentPath === '/products') {
    return (
      <DashboardLayout activeTab="products">
        <ProductsTab />
      </DashboardLayout>
    );
  }

  if (currentPath === '/sales') {
    return (
      <DashboardLayout activeTab="sales">
        <SalesTab />
      </DashboardLayout>
    );
  }

  if (currentPath === '/market') {
    return (
      <DashboardLayout activeTab="market">
        <MarketIntelTab />
      </DashboardLayout>
    );
  }

  if (currentPath === '/reports') {
    return (
      <DashboardLayout activeTab="reports">
        <ReportsTab />
      </DashboardLayout>
    );
  }

  // Default: Landing Page (Phase 1)
  return (
    <div className="min-h-screen bg-charcoal text-ivory flex flex-col font-sans selection:bg-bronze selection:text-charcoal-dark">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <ArchitectureSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <MainRouter />
      </NavigationProvider>
    </AuthProvider>
  );
}
