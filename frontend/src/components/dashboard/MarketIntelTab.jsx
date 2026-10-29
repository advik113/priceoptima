import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  TrendingUp, 
  TrendingDown, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  Layers, 
  ShieldAlert, 
  BarChart,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export default function MarketIntelTab() {
  const { navigate } = useNavigation();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Update telemetry modal state
  const [editingEntry, setEditingEntry] = useState(null);
  const [formState, setFormState] = useState({
    competitor_price: 100.0,
    demand_level: 2,
    inventory_level: 50,
    season: 1
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchMarket = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/market', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to load market intelligence data.');
      const json = await res.json();
      setEntries(json.entries || []);
    } catch (err) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarket();
  }, []);

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setFormState({
      competitor_price: entry.market ? entry.market.competitor_price : entry.product.current_price,
      demand_level: entry.market ? entry.market.demand_level : 2,
      inventory_level: entry.market ? entry.market.inventory_level : 50,
      season: entry.market ? entry.market.season : 1
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingEntry) return;
    setActionLoading(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await fetch(`/api/market/update/${editingEntry.product.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formState)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update market telemetry.');

      setEditingEntry(null);
      setActionMessage({ type: 'success', text: `Telemetry updated for '${editingEntry.product.name}'.` });
      await fetchMarket();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-tight">
            Market Intelligence & Competitor Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-ivory-dim font-light mt-1">
            Real competitor benchmark scraping and warehouse inventory balancing stored in MySQL <code className="text-bronze font-mono">market_data</code>.
          </p>
        </div>

        <button
          onClick={fetchMarket}
          className="p-2.5 rounded-xl bg-warmblack border border-warmblack-border text-ivory-dim hover:text-bronze self-start sm:self-auto transition-colors"
          title="Refresh Market Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Action Notification */}
      {actionMessage.text && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between animate-fadeIn ${
            actionMessage.type === 'success'
              ? 'bg-warmblack-dark border-olive/50 text-olive-light'
              : 'bg-warmblack-dark border-red-900/50 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage({ type: '', text: '' })}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Info Callout */}
      <div className="p-4 rounded-xl bg-warmblack/70 border border-warmblack-border flex items-start gap-3 text-xs font-mono text-ivory-dim">
        <Crosshair className="w-4 h-4 text-bronze shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-ivory font-semibold">Real-Time Market Feedback Loop</span>
          <p className="font-light text-ivory-muted text-[11px]">
            When competitor benchmark prices increase and available inventory is scarce, the Random Forest model captures incremental margin surplus without reducing unit velocity.
          </p>
        </div>
      </div>

      {/* Market Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 text-bronze animate-spin" />
          <p className="text-xs font-mono text-ivory-dim">Querying Market Records...</p>
        </div>
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => {
            const p = entry.product;
            const m = entry.market;
            const compPrice = m ? m.competitor_price : p.current_price;
            const priceDiff = compPrice - p.current_price;
            const diffPct = p.current_price > 0 ? ((priceDiff / p.current_price) * 100).toFixed(1) : 0;
            const invLevel = m ? m.inventory_level : 50;
            const demandLabel = m ? m.demand_label : 'Medium';
            const seasonLabel = m ? m.season_label : 'Spring';

            return (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-warmblack/80 border border-warmblack-border hover:border-bronze/40 transition-all flex flex-col justify-between shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-warmblack-border/60 mb-4">
                    <span className="text-[10px] font-mono text-olive-light uppercase tracking-wider bg-charcoal px-2 py-0.5 rounded border border-warmblack-border">
                      {p.category}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 rounded-lg bg-charcoal border border-warmblack-border text-ivory-muted hover:text-bronze transition-colors"
                      title="Update Market Telemetry"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-serif font-semibold text-ivory truncate mb-4">
                    {p.name}
                  </h3>

                  {/* Price Comparison */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-charcoal border border-warmblack-border font-mono text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-ivory-muted block">Our Active Price</span>
                      <span className="text-sm font-bold text-ivory mt-0.5 block">${p.current_price}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ivory-muted block">Competitor Quote</span>
                      <span className="text-sm font-bold text-bronze mt-0.5 block">${compPrice}</span>
                    </div>
                  </div>

                  {/* Benchmark Status */}
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="text-ivory-muted">Price Differential:</span>
                    <span className={`font-semibold flex items-center gap-1 ${priceDiff >= 0 ? 'text-olive-light' : 'text-red-400'}`}>
                      {priceDiff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{priceDiff >= 0 ? '+' : ''}${priceDiff.toFixed(2)} ({diffPct}%)</span>
                    </span>
                  </div>

                  {/* Inventory Scarcity */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-ivory-muted">Stock Level:</span>
                      <span className="text-ivory font-bold">{invLevel} units</span>
                    </div>
                    <div className="w-full bg-charcoal h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, (invLevel / 150) * 100)}%` }}
                        className={`h-full rounded-full ${invLevel < 40 ? 'bg-red-400' : invLevel > 100 ? 'bg-bronze' : 'bg-olive-light'}`}
                      />
                    </div>
                  </div>

                  {/* Demand & Season */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-warmblack-border/40">
                    <div>
                      <span className="text-ivory-muted block text-[10px]">Demand Signal</span>
                      <span className="text-olive-light font-medium">{demandLabel}</span>
                    </div>
                    <div>
                      <span className="text-ivory-muted block text-[10px]">Active Season</span>
                      <span className="text-ivory font-medium">{seasonLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-warmblack-border/60">
                  <button
                    onClick={() => navigate(`/pricing`)}
                    className="w-full py-2 rounded-xl bg-charcoal hover:bg-charcoal/80 border border-warmblack-border hover:border-bronze text-xs font-mono text-bronze transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Run ML Optimization</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 rounded-2xl bg-warmblack/80 border border-warmblack-border text-center space-y-3">
          <Crosshair className="w-8 h-8 text-ivory-muted/40 mx-auto" />
          <p className="text-xs text-ivory-muted font-light">No products in catalog to benchmark.</p>
        </div>
      )}

      {/* Update Telemetry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-warmblack-dark border border-warmblack-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-warmblack-border mb-5">
              <h3 className="text-lg font-serif font-bold text-ivory">
                Update Market Benchmark
              </h3>
              <button onClick={() => setEditingEntry(null)} className="text-ivory-muted hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-sans text-ivory-dim mb-4">
              Updating telemetry for <strong className="text-ivory font-mono">'{editingEntry.product.name}'</strong>.
            </p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-ivory-muted block mb-1">Competitor Benchmark Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formState.competitor_price}
                  onChange={(e) => setFormState({ ...formState, competitor_price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none text-sm font-bold text-bronze"
                />
              </div>

              <div>
                <label className="text-ivory-muted block mb-1">Remaining Stock in Warehouse</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formState.inventory_level}
                  onChange={(e) => setFormState({ ...formState, inventory_level: parseInt(e.target.value) || 50 })}
                  className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none"
                />
              </div>

              <div>
                <label className="text-ivory-muted block mb-1.5">Demand Level Velocity</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 1, label: 'Low (1)' },
                    { id: 2, label: 'Moderate (2)' },
                    { id: 3, label: 'High (3)' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setFormState({ ...formState, demand_level: d.id })}
                      className={`py-2 rounded-xl text-xs border ${
                        formState.demand_level === d.id
                          ? 'bg-bronze text-charcoal font-semibold border-bronze'
                          : 'bg-charcoal text-ivory-dim border-warmblack-border'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-ivory-muted block mb-1.5">Season Cycle</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 1, label: 'Spring' },
                    { id: 2, label: 'Summer' },
                    { id: 3, label: 'Fall' },
                    { id: 4, label: 'Winter' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormState({ ...formState, season: s.id })}
                      className={`py-1.5 rounded-lg text-xs border ${
                        formState.season === s.id
                          ? 'bg-warmblack-surface border-bronze text-bronze'
                          : 'bg-charcoal text-ivory-muted border-warmblack-border'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-warmblack-border">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-xl bg-charcoal border border-warmblack-border text-ivory-dim hover:text-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-bronze text-charcoal font-semibold hover:bg-bronze-light flex items-center gap-1.5"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Telemetry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

