import React from 'react';
import { ArrowRight, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export default function CtaSection() {
  const { navigate } = useNavigation();

  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-bronze/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="rounded-3xl bg-warmblack/90 border border-bronze/30 p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal border border-warmblack-border text-xs font-mono text-bronze mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Immediate Deployment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ivory tracking-tight max-w-2xl mx-auto leading-tight">
            Take Control of Your Pricing Power Today
          </h2>

          <p className="mt-4 text-base sm:text-lg text-ivory-dim max-w-xl mx-auto font-light leading-relaxed">
            Protect your profit floors, capitalize on scarce inventory, and discover the exact
            equilibrium where consumer demand maximizes total catalog revenue.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-bronze text-charcoal font-semibold text-base hover:bg-bronze-light transition-all shadow-xl hover:shadow-bronze/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started With Your Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-charcoal border border-warmblack-border text-ivory font-medium text-base hover:border-bronze hover:text-bronze transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-bronze" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Bottom Security Guarantee */}
          <div className="mt-10 pt-6 border-t border-warmblack-border/80 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-olive-light">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-bronze" />
              Strict Multi-Tenant Database
            </span>
            <span className="text-warmblack-border">&bull;</span>
            <span>Zero Uncontrolled Price Fluctuations</span>
            <span className="text-warmblack-border">&bull;</span>
            <span>Local MySQL & Python Native</span>
          </div>
        </div>
      </div>
    </section>
  );
}

