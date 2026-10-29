import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Activity, LogIn, User, LayoutDashboard } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { navigate } = useNavigation();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendAlive, setBackendAlive] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Soft ping to Flask backend to verify connectivity if running
  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (res.ok) setBackendAlive(true);
        else setBackendAlive(false);
      })
      .catch(() => setBackendAlive(false));
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-warmblack-dark/90 backdrop-blur-md border-b border-warmblack-border shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3.5 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-warmblack-surface border border-bronze/40 flex items-center justify-center text-bronze shadow-lg shadow-bronze/5 transition-transform duration-300 group-hover:scale-105 group-hover:border-bronze">
            <svg
              className="w-5 h-5 text-bronze"
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
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight text-ivory font-serif group-hover:text-bronze-light transition-colors">
                PriceOptima<span className="text-bronze font-sans font-bold">.AI</span>
              </span>
            </div>
            <span className="text-[10px] tracking-widest uppercase text-olive-light font-mono -mt-1">
              Dynamic Pricing Engine
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ivory-dim">
          <a
            href="#features"
            className="hover:text-bronze transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-bronze transition-colors duration-200"
          >
            How It Works
          </a>
          <a
            href="#simulation"
            className="hover:text-bronze transition-colors duration-200"
          >
            Live Simulator
          </a>
          <a
            href="#architecture"
            className="hover:text-bronze transition-colors duration-200"
          >
            Architecture
          </a>
        </nav>

        {/* Action Buttons & Status */}
        <div className="hidden md:flex items-center gap-4">
          {/* Flask Backend Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border border-warmblack-border bg-warmblack/60 text-ivory-muted"
            title={backendAlive ? "Flask API backend connected on port 5000" : "Flask backend standalone / standby"}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendAlive ? 'bg-olive-light animate-pulse' : 'bg-olive'
              }`}
            />
            <span>Flask :5000</span>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium bg-warmblack-surface border border-bronze/40 text-ivory px-3.5 py-2 rounded-lg hover:border-bronze hover:text-bronze transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-bronze" />
              <span>Dashboard ({user?.username})</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-ivory hover:text-bronze px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-bronze" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => navigate('/register')}
                className="text-sm font-medium bg-bronze text-charcoal-dark px-4 py-2 rounded-lg font-semibold hover:bg-bronze-light transition-all shadow-md hover:shadow-bronze/20 flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ivory-dim hover:text-ivory focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-bronze" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-warmblack-dark border-b border-warmblack-border px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-medium text-ivory-dim">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-bronze py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-bronze py-1"
            >
              How It Works
            </a>
            <a
              href="#simulation"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-bronze py-1"
            >
              Live Simulator
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-bronze py-1"
            >
              Architecture & ML
            </a>
          </nav>
          <div className="pt-4 border-t border-warmblack-border flex flex-col gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full text-center py-2.5 rounded-lg bg-bronze text-charcoal font-semibold text-sm flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard ({user?.username})</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-center py-2.5 rounded-lg border border-warmblack-border text-ivory text-sm font-medium hover:border-bronze"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full text-center py-2.5 rounded-lg bg-bronze text-charcoal font-semibold text-sm hover:bg-bronze-light flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
