import React from 'react';
import { Database, Cpu, ShieldAlert, RefreshCw } from 'lucide-react';

const STEPS = [
  {
    step: "01",
    title: "Continuous Signal Ingestion",
    icon: Database,
    description: "The engine ingests multi-factor data signals from your inventory catalog: procurement cost floors, current selling prices, competitor scrape benchmarks, warehouse unit scarcity, and seasonal velocity.",
    metric: "Signals: Cost · Comp Price · Stock · Demand · Season",
    output: "Clean 7-Feature Vector"
  },
  {
    step: "02",
    title: "Multi-Feature ML Inference",
    icon: Cpu,
    description: "The normalized feature vector is processed by a high-accuracy Random Forest Regressor trained on real-world retail elasticity data. It computes the theoretical revenue-maximizing price point.",
    metric: "Model: Random Forest (100 Trees, R² = 99.47%)",
    output: "Raw Optimized Estimate ($)"
  },
  {
    step: "03",
    title: "Algorithmic Guardrails Verification",
    icon: ShieldAlert,
    description: "Before any recommendation is finalized, our dual safety guardrails are executed: enforcing Price ≥ Cost × 1.12 to lock in minimum 12% gross margins, and dampening maximum price fluctuations to ±25%.",
    metric: "Guardrails: Min 12% Margin Floor & ±25% Volatility Band",
    output: "Guarded Optimal Selling Price"
  },
  {
    step: "04",
    title: "1-Click Production Deployment",
    icon: RefreshCw,
    description: "The verified price recommendation, along with a transparent business rationale, is presented in your dashboard. Accept with a single click to instantly update live MySQL records.",
    metric: "Execution: Atomic MySQL Transaction & Audit Trail",
    output: "Live Catalog Updated"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-charcoal relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warmblack border border-warmblack-border text-xs font-mono text-bronze mb-3">
            <span>Execution Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ivory tracking-tight">
            How The AI Pricing Engine Operates
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ivory-dim font-light">
            A closed-loop decision architecture bridging statistical machine learning
            with defensive corporate margin risk policies.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-warmblack/70 border border-warmblack-border flex flex-col justify-between group hover:border-bronze/40 transition-all duration-300"
              >
                {/* Step badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-serif font-bold text-bronze/70 group-hover:text-bronze transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-charcoal border border-warmblack-border flex items-center justify-center text-ivory-dim group-hover:text-bronze group-hover:border-bronze/30 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-serif font-semibold text-ivory mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ivory-dim leading-relaxed font-light mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-warmblack-border/60 space-y-2">
                  <div className="text-[10px] font-mono text-olive-light">
                    {item.metric}
                  </div>
                  <div className="text-[11px] font-mono text-ivory flex items-center gap-1.5 bg-charcoal/80 px-2.5 py-1 rounded border border-warmblack-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
                    <span>{item.output}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

