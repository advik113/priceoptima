import React from 'react';
import { ArrowRight, Sliders, Shield, Award, BarChart3, ChevronDown, CheckCircle } from 'lucide-react';
import LiveSimulationWidget from './LiveSimulationWidget';
import { useNavigation } from '../context/NavigationContext';

export default function Hero() {
  const { navigate } = useNavigation();

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-charcoal bg-grid-pattern">
      {/* Top radial ambient glow in warm bronze */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-warm-radial pointer-events-none" />

      {/* Decorative architectural borders */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Top Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warmblack border border-bronze/30 text-xs font-mono text-ivory shadow-lg">
            <span className="w-2 h-2 rounded-full bg-bronze animate-pulse" />
            <span className="text-bronze font-semibold">PriceOptima AI 2.0</span>
            <span className="text-ivory-muted/40">|</span>
            <span className="text-ivory-dim">Applied ML Pricing Engine</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-ivory tracking-tight leading-[1.1]">
            Every Price.{' '}
            <span className="italic font-normal text-bronze-light decoration-bronze/40 underline-offset-8">
              Smarter Decisions.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-ivory-dim max-w-2xl mx-auto font-sans font-light leading-relaxed">
            Eliminate static catalog guesswork. Our enterprise regression models predict real-time
            price elasticity, outmaneuver competitors, and enforce unshakeable{' '}
            <strong className="text-ivory font-medium">+12% gross profit margin floors</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-bronze text-charcoal font-semibold text-base hover:bg-bronze-light transition-all shadow-xl hover:shadow-bronze/25 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#simulation"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-warmblack-surface border border-warmblack-border text-ivory font-medium text-base hover:border-bronze hover:text-bronze transition-all flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4 text-bronze" />
              <span>Launch Live Simulator</span>
            </a>
          </div>

          {/* Key Stat Proof Points */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-warmblack-border/80">
            <div className="text-center p-3 rounded-lg bg-warmblack/40 border border-warmblack-border/50">
              <span className="block text-2xl font-serif font-bold text-bronze">99.47%</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-olive-light">
                Model R² Score
              </span>
            </div>

            <div className="text-center p-3 rounded-lg bg-warmblack/40 border border-warmblack-border/50">
              <span className="block text-2xl font-serif font-bold text-ivory">+12%</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-olive-light">
                Cost Margin Floor
              </span>
            </div>

            <div className="text-center p-3 rounded-lg bg-warmblack/40 border border-warmblack-border/50">
              <span className="block text-2xl font-serif font-bold text-bronze">&plusmn;25%</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-olive-light">
                Volatility Cap
              </span>
            </div>

            <div className="text-center p-3 rounded-lg bg-warmblack/40 border border-warmblack-border/50">
              <span className="block text-2xl font-serif font-bold text-ivory">&lt; 50ms</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-olive-light">
                Inference Speed
              </span>
            </div>
          </div>
        </div>

        {/* Live Simulator Preview Card */}
        <div className="mt-16 sm:mt-20">
          <LiveSimulationWidget />
        </div>
      </div>
    </section>
  );
}

