import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export default function DynamicPricingTab() {
  const { navigate } = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  
  // Custom input state overrides for simulation / live recommendation
  const [competitorPrice, setCompetitorPrice] = useState(100.0);
  const [demandLevel, setDemandLevel] = useState(2);
  const [inventoryLevel, setInventoryLevel] = useState(50);
  const [season, setSeason] = useState(1);
  
  // State for actions
  const [generating, setGenerating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchData = async (productId = null) => {
    setLoading(true);
    setError('');
    try {
      const url = productId ? `/api/pricing/data?product_id=${productId}` : '/api/pricing/data';
      const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to load pricing data.');
      const json = await res.json();
      setData(json);

      if (json.selected_product) {
        setSelectedProductId(json.selected_product.id);
      }
      if (json.selected_market) {
        setCompetitorPrice(json.selected_market.competitor_price);
        setDemandLevel(json.selected_market.demand_level);
        setInventoryLevel(json.selected_market.inventory_level);
        setSeason(json.selected_market.season);
      } else if (json.selected_product) {
        setCompetitorPrice(json.selected_product.current_price);
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductSelect = (id) => {
    setSelectedProductId(id);
    fetchData(id);
  };

  const handleGenerateRecommendation = async () => {
    if (!selectedProductId) return;
    setGenerating(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await fetch(`/api/pricing/recommend/${selectedProductId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          competitor_price: parseFloat(competitorPrice),
          demand_level: parseInt(demandLevel),
          inventory_level: parseInt(inventoryLevel),
          season: parseInt(season)
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to generate recommendation.');

      setActionMessage({
        type: 'success',
        text: `AI Recommendation generated: $${json.recommendation.recommended_price} (${json.recommendation.price_difference >= 0 ? '+' : ''}$${json.recommendation.price_difference})`
      });

      // Refresh pricing data to show latest recommendation
      await fetchData(selectedProductId);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setGenerating(false);
    }
  };

  const handleApplyRecommendation = async (recId) => {
    if (!recId) return;
    setApplying(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await fetch(`/api/pricing/apply/${recId}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to apply price.');

      setActionMessage({
        type: 'success',
        text: json.message || 'Price successfully updated in live MySQL catalog!'
      });

      await fetchData(selectedProductId);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setApplying(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-bronze animate-spin" />
        <p className="text-xs font-mono text-ivory-dim">Querying ML Models & Catalog...</p>
      </div>
    );
  }

  const products = data?.products || [];
  const selectedProduct = data?.selected_product;
  const latestRec = data?.latest_recommendation;
  const recommendations = data?.recommendations || [];

  if (products.length === 0) {
    return (
      <div className="p-10 rounded-2xl bg-warmblack/80 border border-warmblack-border text-center space-y-4 max-w-2xl mx-auto">
        <Cpu className="w-12 h-12 text-bronze mx-auto opacity-70" />
        <h2 className="text-xl font-serif font-bold text-ivory">No Products Found In Catalog</h2>
        <p className="text-xs text-ivory-dim font-light leading-relaxed">
          Dynamic pricing requires at least one catalog SKU with procurement unit cost to calculate elasticity and enforce margin floors.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 rounded-xl bg-bronze text-charcoal font-semibold text-xs hover:bg-bronze-light transition-all shadow-md"
        >
          Add Product to Catalog
        </button>
      </div>
    );
  }

  // Calculate variances for display
  const priceDiff = latestRec ? latestRec.price_difference : 0;
  const pctDiff = selectedProduct && latestRec ? ((priceDiff / selectedProduct.current_price) * 100).toFixed(1) : 0;
  const marginPercent = selectedProduct && latestRec ? (((latestRec.recommended_price - selectedProduct.cost_price) / latestRec.recommended_price) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-tight">
            Dynamic Price Optimization Hub
          </h1>
          <p className="text-xs sm:text-sm text-ivory-dim font-light mt-1">
            Execute Random Forest regression with guaranteed +12% cost floor and &plusmn;25% volatility limits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-warmblack px-3 py-1.5 rounded-xl border border-warmblack-border text-olive-light">
          <ShieldCheck className="w-4 h-4 text-bronze" />
          <span>Active Guardrail: Cost Floor +12%</span>
        </div>
      </div>

      {/* Action Notifications */}
      {actionMessage.text && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-3 animate-fadeIn ${
            actionMessage.type === 'success'
              ? 'bg-warmblack-dark border-olive/50 text-olive-light'
              : 'bg-warmblack-dark border-red-900/50 text-red-300'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-olive-light" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Product Selector Bar */}
      <div className="p-5 rounded-2xl bg-warmblack/80 border border-warmblack-border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-mono text-ivory-muted uppercase tracking-wider whitespace-nowrap">
            Select Active SKU:
          </label>
          <div className="relative w-full sm:w-80">
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(parseInt(e.target.value))}
              className="w-full bg-charcoal border border-warmblack-border rounded-xl px-4 py-2.5 text-xs font-mono text-ivory focus:outline-none focus:border-bronze appearance-none cursor-pointer pr-10"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.current_price})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-ivory-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {selectedProduct && (
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ivory-dim">
            <span>Category: <strong className="text-ivory font-sans">{selectedProduct.category}</strong></span>
            <span>&bull;</span>
            <span>Cost Unit Floor: <strong className="text-bronze">${selectedProduct.cost_price}</strong></span>
            <span>&bull;</span>
            <span>MSRP: <strong className="text-ivory">${selectedProduct.base_price}</strong></span>
          </div>
        )}
      </div>

      {/* Main Grid: Input Signals on Left, Live Output Recommendation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Signal Inputs */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-warmblack/80 border border-warmblack-border space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-warmblack-border/60">
            <div>
              <h3 className="text-base font-serif font-semibold text-ivory">
                Market Signals & Telemetry
              </h3>
              <p className="text-xs text-ivory-dim font-light">
                Feature signals passed into Random Forest regressor.
              </p>
            </div>
            <span className="text-[11px] font-mono text-olive-light bg-charcoal px-2.5 py-1 rounded border border-warmblack-border">
              7-Vector Pipeline
            </span>
          </div>

          {/* Pricing benchmarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-ivory-muted mb-1.5">
                Current Catalog Price ($)
              </label>
              <div className="p-3 bg-charcoal rounded-xl border border-warmblack-border font-mono text-ivory text-sm">
                ${selectedProduct?.current_price || '0.00'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-ivory-muted mb-1.5">
                Competitor Price Benchmark ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={competitorPrice}
                onChange={(e) => setCompetitorPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 font-mono text-ivory text-sm focus:outline-none focus:border-bronze"
              />
            </div>
          </div>

          {/* Inventory Scarcity */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-ivory-muted">Current Inventory Stock</span>
              <span className="text-bronze font-bold">{inventoryLevel} Units</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              value={inventoryLevel}
              onChange={(e) => setInventoryLevel(parseInt(e.target.value))}
              className="w-full accent-bronze bg-charcoal h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ivory-muted/60 mt-1 font-mono">
              <span>Scarcity (5 units)</span>
              <span>Balanced (50 units)</span>
              <span>Surplus (200 units)</span>
            </div>
          </div>

          {/* Demand Level */}
          <div>
            <div className="flex justify-between text-xs mb-2 font-mono">
              <span className="text-ivory-muted">Consumer Demand Velocity</span>
              <span className="text-olive-light font-bold">
                {demandLevel === 1 ? 'Low Demand' : demandLevel === 2 ? 'Moderate Demand' : 'High Surge Demand'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 1, label: 'Low (1)' },
                { level: 2, label: 'Moderate (2)' },
                { level: 3, label: 'High Surge (3)' },
              ].map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setDemandLevel(item.level)}
                  className={`py-2 text-xs rounded-xl font-medium transition-all border ${
                    demandLevel === item.level
                      ? 'bg-bronze text-charcoal font-semibold border-bronze shadow-md'
                      : 'bg-charcoal text-ivory-dim border-warmblack-border hover:border-bronze/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Season Selector */}
          <div>
            <div className="flex justify-between text-xs mb-2 font-mono">
              <span className="text-ivory-muted">Seasonal Cycle Factor</span>
              <span className="text-bronze font-bold">
                {['Spring (1)', 'Summer (2)', 'Autumn (3)', 'Winter / Q4 (4)'][season - 1]}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 1, label: 'Spring' },
                { id: 2, label: 'Summer' },
                { id: 3, label: 'Autumn' },
                { id: 4, label: 'Winter (Q4)' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeason(s.id)}
                  className={`py-2 text-xs rounded-xl transition-all border ${
                    season === s.id
                      ? 'bg-warmblack-surface border-bronze text-bronze font-semibold'
                      : 'bg-charcoal text-ivory-muted border-warmblack-border hover:text-ivory'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Execute Inference Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerateRecommendation}
              disabled={generating}
              className="w-full py-3.5 rounded-xl bg-bronze text-charcoal font-semibold text-sm hover:bg-bronze-light transition-all shadow-lg hover:shadow-bronze/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing Scikit-Learn Model...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Execute ML Price Optimization</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Recommendation Output */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-warmblack/80 border border-bronze/40 flex flex-col justify-between shadow-2xl relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-warmblack-border/60">
              <span className="text-xs font-mono uppercase tracking-wider text-olive-light">
                Model Recommendation
              </span>
              <span className="text-xs font-mono text-bronze bg-bronze/10 px-2.5 py-0.5 rounded-full border border-bronze/20">
                Confidence: {latestRec?.confidence_score || '99.5'}%
              </span>
            </div>

            {latestRec ? (
              <>
                <div>
                  <span className="text-xs text-ivory-muted font-mono block mb-1">
                    Recommended Optimal Price
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl font-serif font-bold text-ivory tracking-tight">
                      ${latestRec.recommended_price}
                    </span>
                    <span
                      className={`text-sm font-mono font-medium px-2 py-0.5 rounded ${
                        latestRec.price_difference >= 0
                          ? 'text-olive-light bg-olive/15'
                          : 'text-bronze bg-bronze/15'
                      }`}
                    >
                      {latestRec.price_difference >= 0 ? '+' : ''}${latestRec.price_difference} ({pctDiff}%)
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-warmblack-border/60 text-xs font-mono">
                  <div className="bg-charcoal p-3 rounded-xl border border-warmblack-border">
                    <span className="text-ivory-muted block text-[11px]">Expected Margin</span>
                    <span className="text-olive-light font-bold text-base mt-1 block">
                      {marginPercent}% ROI
                    </span>
                  </div>
                  <div className="bg-charcoal p-3 rounded-xl border border-warmblack-border">
                    <span className="text-ivory-muted block text-[11px]">Cost Margin Floor</span>
                    <span className="text-bronze font-bold text-base mt-1 block">
                      ${(selectedProduct.cost_price * 1.12).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Viva AI Rationale */}
                <div className="p-4 rounded-xl bg-charcoal border border-warmblack-border text-xs text-ivory-dim leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-1.5 text-bronze font-mono text-[11px]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Explainable Machine Learning Rationale:</span>
                  </div>
                  <p className="font-light">{latestRec.reason}</p>
                </div>
              </>
            ) : (
              <div className="py-16 text-center space-y-3">
                <Sparkles className="w-10 h-10 text-bronze/40 mx-auto" />
                <p className="text-xs text-ivory-dim font-light">
                  Click "Execute ML Price Optimization" to query the trained Random Forest model.
                </p>
              </div>
            )}
          </div>

          {/* 1-Click Apply to Catalog Button */}
          {latestRec && (
            <div className="pt-6 mt-6 border-t border-warmblack-border/60">
              {latestRec.status === 'Applied' ? (
                <div className="py-3 px-4 rounded-xl bg-olive/15 border border-olive/30 text-olive-light text-xs font-mono flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-olive-light" />
                  <span>Applied in MySQL (Active Selling Price: ${selectedProduct?.current_price})</span>
                </div>
              ) : (
                <button
                  onClick={() => handleApplyRecommendation(latestRec.id)}
                  disabled={applying}
                  className="w-full py-3 px-4 rounded-xl bg-bronze text-charcoal font-semibold text-xs hover:bg-bronze-light transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-bronze/25 disabled:opacity-50"
                >
                  {applying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Writing to MySQL...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>1-Click Apply Price (${latestRec.recommended_price}) to Catalog</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Historical Recommendations Table */}
      <div className="p-6 rounded-2xl bg-warmblack/80 border border-warmblack-border">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-warmblack-border/60">
          <h3 className="text-base font-serif font-semibold text-ivory">
            Recommendation Audit Log
          </h3>
          <span className="text-xs font-mono text-ivory-muted">
            {recommendations.length} Suggestions Recorded
          </span>
        </div>

        {recommendations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-ivory-muted border-b border-warmblack-border/40 pb-2">
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Product</th>
                  <th className="pb-2 text-right">Old Price</th>
                  <th className="pb-2 text-right">Recommended</th>
                  <th className="pb-2 text-right">Variance</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmblack-border/30">
                {recommendations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-charcoal/40 transition-colors">
                    <td className="py-2.5 text-ivory-muted">{rec.generated_at}</td>
                    <td className="py-2.5 text-ivory font-sans font-medium">{rec.product_name}</td>
                    <td className="py-2.5 text-right text-ivory-dim">${rec.current_price}</td>
                    <td className="py-2.5 text-right text-bronze font-bold">${rec.recommended_price}</td>
                    <td className="py-2.5 text-right">
                      <span className={rec.price_difference >= 0 ? 'text-olive-light' : 'text-red-400'}>
                        {rec.price_difference >= 0 ? '+' : ''}${rec.price_difference}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          rec.status === 'Applied'
                            ? 'bg-olive/15 text-olive-light border-olive/30'
                            : 'bg-bronze/15 text-bronze border-bronze/30'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      {rec.status === 'Pending' ? (
                        <button
                          onClick={() => handleApplyRecommendation(rec.id)}
                          className="text-[11px] text-bronze hover:underline"
                        >
                          Apply
                        </button>
                      ) : (
                        <span className="text-ivory-muted/60 text-[11px]">Applied</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-ivory-muted font-light">
            No recommendations generated yet.
          </div>
        )}
      </div>
    </div>
  );
}

