import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Crosshair, 
  Database, 
  Zap, 
  BarChart, 
  Layers, 
  Lock 
} from 'lucide-react';

const FEATURE_LIST = [
  {
    icon: Cpu,
    title: "Non-Linear Elasticity ML Engine",
    subtitle: "Random Forest Regressor (R²: 99.47%)",
    description: "Trained across thousands of market transactions to accurately model Price Elasticity of Demand (PED). Captures non-linear inflection points where revenue (Price × Quantity) peaks without eroding margin.",
    tag: "Machine Learning"
  },
  {
    icon: ShieldCheck,
    title: "Institutional Safety Guardrails",
    subtitle: "+12% Margin Floor & ±25% Cap",
    description: "Hardcoded safety mechanisms prevent algorithmic runaways. Ensures recommended prices never breach unit procurement costs plus 12% ROI, while dampening market volatility within ±25%.",
    tag: "Risk Protection"
  },
  {
    icon: Crosshair,
    title: "Real-Time Competitor Telemetry",
    subtitle: "Scarcity & Inventory Balancing",
    description: "Continuously weighs external market benchmarks against your warehouse inventory. When stock is constrained and competitors raise rates, the engine automatically extracts premium pricing leverage.",
    tag: "Market Intelligence"
  },
  {
    icon: Database,
    title: "Multi-Tenant MySQL Architecture",
    subtitle: "Strict Row-Level Isolation",
    description: "Enterprise-grade database schema where every product, sale, and AI recommendation is cryptographically bound to your specific user identity via enforced MySQL foreign-key relationships.",
    tag: "Data Security"
  },
  {
    icon: Zap,
    title: "1-Click Production Catalog Sync",
    subtitle: "Atomic Database Execution",
    description: "Review explainable AI rationales for any catalog SKU and commit new dynamic prices to production with a single click. Instant rollback and historical recommendation auditing built in.",
    tag: "Automation"
  },
  {
    icon: BarChart,
    title: "Executive Revenue Velocity Analytics",
    subtitle: "REST API & Time-Series Reporting",
    description: "Track the tangible financial impact of automated dynamic pricing over time. Visualize sales volume versus revenue curves, competitor price deviations, and category distribution.",
    tag: "Analytics"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-charcoal-dark border-t border-warmblack-border relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warmblack border border-warmblack-border text-xs font-mono text-olive-light mb-3">
            <span>Enterprise Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ivory tracking-tight">
            Engineered for Precision & Margin Protection
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ivory-dim font-light">
            Dynamic pricing is not about racing to the bottom. It is an algorithmic science
            of capturing maximum customer surplus at every phase of the demand curve.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURE_LIST.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group p-7 rounded-2xl bg-warmblack/70 border border-warmblack-border hover:border-bronze/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-bronze/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-charcoal border border-warmblack-border flex items-center justify-center text-bronze group-hover:border-bronze/50 group-hover:scale-105 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-charcoal border border-warmblack-border text-olive-light">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-semibold text-ivory group-hover:text-bronze-light transition-colors">
                    {feat.title}
                  </h3>
                  <div className="text-xs font-mono text-bronze/80 mt-1 mb-3">
                    {feat.subtitle}
                  </div>

                  <p className="text-sm text-ivory-dim/90 leading-relaxed font-light">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-warmblack-border/60 flex items-center gap-2 text-xs font-mono text-ivory-muted group-hover:text-bronze transition-colors">
                  <span>Explore module specification</span>
                  <span>&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

