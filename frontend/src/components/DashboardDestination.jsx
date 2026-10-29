import React from 'react';
import { 
  ShieldCheck, 
  User, 
  LogOut, 
  Sliders, 
  ExternalLink, 
  Sparkles, 
  Database, 
  Cpu, 
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

export default function DashboardDestination() {
  const { user, logout } = useAuth();
  const { navigate } = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-charcoal bg-grid-pattern text-ivory flex flex-col justify-between py-12 px-6 sm:px-8 selection:bg-bronze selection:text-charcoal-dark">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-ivory-dim hover:text-bronze transition-colors py-2 px-3 rounded-lg bg-warmblack/60 border border-warmblack-border hover:border-bronze/40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-xs font-mono text-red-300 hover:text-red-200 py-2 px-3 rounded-lg bg-warmblack/60 border border-warmblack-border hover:border-red-900/50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="rounded-2xl bg-warmblack/90 border border-warmblack-border p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle bronze top accent bar */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-bronze to-transparent opacity-60" />

          {/* User Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-warmblack-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-charcoal border border-bronze/40 flex items-center justify-center text-bronze shadow-lg shadow-bronze/10">
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-olive-light uppercase tracking-wider">
                    Authenticated Session
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-olive-light animate-pulse" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory mt-0.5">
                  Welcome, {user?.username || 'Catalog Manager'}
                </h1>
                <p className="text-xs text-ivory-dim font-mono mt-0.5">
                  Account: {user?.email || 'authenticated user'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono bg-charcoal/80 px-3.5 py-2 rounded-xl border border-warmblack-border text-ivory-dim">
              <Database className="w-4 h-4 text-bronze" />
              <span>Tenant ID: #{user?.id || 1} (MySQL)</span>
            </div>
          </div>

          {/* Phase 2 Completion Notice */}
          <div className="my-8 p-5 rounded-xl bg-charcoal/70 border border-bronze/30 space-y-2">
            <div className="flex items-center gap-2 text-bronze text-xs font-mono uppercase tracking-wider font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Phase 2 Status: Authentication Connected</span>
            </div>
            <p className="text-sm text-ivory-dim font-light leading-relaxed">
              Your session is securely authenticated with the Flask backend. You can interact with the live pricing simulator below, or access the existing server-rendered Flask dashboard.
            </p>
            <div className="text-[11px] font-mono text-olive-light pt-1">
              &bull; Full React Dashboard redesign will be implemented in Phase 3.
            </div>
          </div>

          {/* Action Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-5 rounded-xl bg-charcoal border border-warmblack-border hover:border-bronze/50 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-bronze mb-2">
                  <Sliders className="w-5 h-5" />
                  <span className="text-xs font-mono text-olive-light">&larr; Return</span>
                </div>
                <h4 className="font-serif font-semibold text-ivory text-base group-hover:text-bronze transition-colors">
                  Interactive Elasticity Simulator
                </h4>
                <p className="text-xs text-ivory-dim font-light mt-1">
                  Test live ML recommendations with your active session guardrails.
                </p>
              </div>
            </button>

            <a
              href="http://127.0.0.1:5000/"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-xl bg-charcoal border border-warmblack-border hover:border-bronze/50 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-bronze mb-2">
                  <ExternalLink className="w-5 h-5" />
                  <span className="text-xs font-mono text-olive-light">Port 5000 &rarr;</span>
                </div>
                <h4 className="font-serif font-semibold text-ivory text-base group-hover:text-bronze transition-colors">
                  Legacy Server Dashboard
                </h4>
                <p className="text-xs text-ivory-dim font-light mt-1">
                  View existing products, sales, and MySQL records on the Flask server.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-[11px] font-mono text-ivory-muted/60 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
        <span>PriceOptima AI Phase 2 &bull; Active Flask Session</span>
      </div>
    </div>
  );
}

