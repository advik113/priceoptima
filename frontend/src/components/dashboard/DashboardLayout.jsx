import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Package, 
  Receipt, 
  Crosshair, 
  LineChart, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Database,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

const NAV_ITEMS = [
  { id: 'overview', path: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
  { id: 'pricing', path: '/pricing', label: 'Dynamic Pricing', icon: Cpu, badge: 'ML 99.5%' },
  { id: 'products', path: '/products', label: 'My Products', icon: Package },
  { id: 'sales', path: '/sales', label: 'My Sales Log', icon: Receipt },
  { id: 'market', path: '/market', label: 'Market Intel', icon: Crosshair },
  { id: 'reports', path: '/reports', label: 'Reports & Trends', icon: LineChart },
];

export default function DashboardLayout({ children, activeTab }) {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-charcoal text-ivory flex flex-col font-sans selection:bg-bronze selection:text-charcoal-dark">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-warmblack-dark/95 backdrop-blur-md border-b border-warmblack-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-warmblack-surface border border-bronze/40 flex items-center justify-center text-bronze shadow-md group-hover:border-bronze transition-colors">
                <svg
                  className="w-4 h-4 text-bronze"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-base font-semibold text-ivory font-serif tracking-tight group-hover:text-bronze transition-colors">
                  PriceOptima<span className="text-bronze font-sans font-bold">.AI</span>
                </span>
                <span className="text-[9px] font-mono uppercase text-olive-light tracking-widest -mt-1">
                  Enterprise Platform
                </span>
              </div>
            </button>

            <span className="hidden md:inline-block text-warmblack-border">/</span>
            
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warmblack border border-warmblack-border text-[11px] font-mono text-olive-light">
              <Database className="w-3 h-3 text-bronze" />
              <span>Tenant ID: #{user?.id || 1}</span>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-warmblack border border-warmblack-border">
              <div className="w-6 h-6 rounded-full bg-bronze/20 border border-bronze/40 flex items-center justify-center text-bronze text-xs font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-ivory leading-none">
                  {user?.username}
                </span>
                <span className="text-[10px] text-ivory-muted/70 font-mono leading-none mt-1">
                  {user?.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-charcoal border border-warmblack-border text-xs font-mono text-ivory-dim hover:text-red-300 hover:border-red-900/50 transition-colors flex items-center gap-1.5"
              title="Sign Out of Session"
            >
              <LogOut className="w-4 h-4 text-bronze sm:text-ivory-dim" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-ivory-dim hover:text-ivory bg-warmblack border border-warmblack-border"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-bronze" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Tab Bar */}
        <div className="hidden md:block bg-warmblack/80 border-t border-warmblack-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-charcoal text-ivory border border-bronze/40 shadow-sm'
                      : 'text-ivory-dim hover:text-ivory hover:bg-charcoal/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-bronze' : 'text-ivory-muted'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-bronze/15 text-bronze border border-bronze/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-warmblack-dark border-t border-warmblack-border p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-charcoal text-ivory border border-bronze/40'
                      : 'text-ivory-dim hover:bg-charcoal/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-bronze' : 'text-ivory-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono text-bronze">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Dashboard Global Footer */}
      <footer className="bg-warmblack-dark border-t border-warmblack-border py-4 text-center text-xs font-mono text-ivory-muted/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-olive-light" />
            <span>Multi-Tenant MySQL Database Isolation Active</span>
          </div>
          <div className="text-[11px]">
            PriceOptima AI v2.0 &bull; Random Forest Regression &bull; Python Flask + React
          </div>
        </div>
      </footer>
    </div>
  );
}

