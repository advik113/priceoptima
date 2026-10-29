import React from 'react';
import { useNavigation } from '../context/NavigationContext';

export default function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-warmblack-dark border-t border-warmblack-border py-14 text-sm text-ivory-dim">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-warmblack-border/80">
          {/* Engine Description & Status */}
          <div className="md:col-span-2 space-y-4 flex flex-col justify-start">
            <p className="text-xs text-ivory-dim leading-relaxed font-light max-w-sm">
              An institutional dynamic pricing engine combining machine-learning demand elasticity
              modeling with algorithmic profit margin guardrails. Built for enterprise and academic laboratory applications.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-olive-light">
              <span className="w-2 h-2 rounded-full bg-olive-light" />
              <span>Engine Status: Production Ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-ivory font-semibold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-dim font-light">
              <li>
                <a href="#features" className="hover:text-bronze transition-colors">
                  Features & Guardrails
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-bronze transition-colors">
                  Inference Workflow
                </a>
              </li>
              <li>
                <a href="#simulation" className="hover:text-bronze transition-colors">
                  Live Pricing Simulator
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-bronze transition-colors">
                  System Architecture
                </a>
              </li>
            </ul>
          </div>

          {/* Authentication */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-ivory font-semibold mb-4">
              Access
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory-dim font-light">
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="hover:text-bronze transition-colors text-left"
                >
                  Sign In to Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/register')}
                  className="hover:text-bronze transition-colors text-left"
                >
                  Create Catalog Account
                </button>
              </li>
              <li>
                <a href="/pricing" className="hover:text-bronze transition-colors">
                  Dynamic Pricing Hub
                </a>
              </li>
              <li>
                <a href="/reports" className="hover:text-bronze transition-colors">
                  Revenue Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Stack */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-ivory font-semibold mb-4">
              Technology Stack
            </h4>
            <ul className="space-y-1.5 text-[11px] font-mono text-ivory-muted/90">
              <li>UI: React 18 + Vite</li>
              <li>API: Python 3 Flask</li>
              <li>ML: Scikit-learn Random Forest</li>
              <li>Database: MySQL 8.0 & SQLAlchemy</li>
              <li>Security: PBKDF2 Hashing</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ivory-muted/60">
          <div>
            &copy; {new Date().getFullYear()} PriceOptima AI. Dynamic Price Optimization Engine. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Charcoal & Bronze Theme</span>
            <span>&bull;</span>
            <span>Phase 1 Landing Page</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

