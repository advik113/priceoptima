import React from 'react';
import { Server, Database, BrainCircuit, Code2 } from 'lucide-react';

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="py-24 bg-charcoal-dark border-t border-warmblack-border relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warmblack border border-warmblack-border text-xs font-mono text-olive-light mb-3">
            <span>System Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ivory tracking-tight">
            Hybrid Full-Stack Integration
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ivory-dim font-light">
            Designed to bridge high-performance React UI with the established Python Flask
            backend, MySQL 8 multi-tenant storage, and Scikit-learn inference pipeline.
          </p>
        </div>

        {/* Stack Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-warmblack/80 border border-warmblack-border">
            <div className="flex items-center gap-2 text-bronze text-xs font-mono mb-2">
              <Code2 className="w-4 h-4" />
              <span>Frontend Layer</span>
            </div>
            <h4 className="font-serif font-semibold text-ivory text-base">React 18 + Vite</h4>
            <p className="text-xs text-ivory-dim mt-1 font-light">
              Cinematic client interface, reactive state management, Tailwind styling, and sub-second HMR.
            </p>
            <div className="mt-3 text-[11px] font-mono text-olive-light">Port: :5173</div>
          </div>

          <div className="p-5 rounded-xl bg-warmblack/80 border border-warmblack-border">
            <div className="flex items-center gap-2 text-bronze text-xs font-mono mb-2">
              <Server className="w-4 h-4" />
              <span>Backend Server</span>
            </div>
            <h4 className="font-serif font-semibold text-ivory text-base">Python Flask 3.0</h4>
            <p className="text-xs text-ivory-dim mt-1 font-light">
              RESTful APIs, session cookie security, PBKDF2 cryptography, and route orchestration.
            </p>
            <div className="mt-3 text-[11px] font-mono text-olive-light">Port: :5000</div>
          </div>

          <div className="p-5 rounded-xl bg-warmblack/80 border border-warmblack-border">
            <div className="flex items-center gap-2 text-bronze text-xs font-mono mb-2">
              <BrainCircuit className="w-4 h-4" />
              <span>Inference Engine</span>
            </div>
            <h4 className="font-serif font-semibold text-ivory text-base">Random Forest Regressor</h4>
            <p className="text-xs text-ivory-dim mt-1 font-light">
              Trained Scikit-learn model package (<code className="text-bronze">price_model.pkl</code>) with R² = 99.47%.
            </p>
            <div className="mt-3 text-[11px] font-mono text-olive-light">Inference: &lt;50ms</div>
          </div>

          <div className="p-5 rounded-xl bg-warmblack/80 border border-warmblack-border">
            <div className="flex items-center gap-2 text-bronze text-xs font-mono mb-2">
              <Database className="w-4 h-4" />
              <span>Database Layer</span>
            </div>
            <h4 className="font-serif font-semibold text-ivory text-base">MySQL 8.0 & SQLAlchemy</h4>
            <p className="text-xs text-ivory-dim mt-1 font-light">
              Multi-tenant data isolation, relational user/product schemas, and transactional integrity.
            </p>
            <div className="mt-3 text-[11px] font-mono text-olive-light">Schema: dynamic_price_db</div>
          </div>
        </div>
      </div>
    </section>
  );
}

