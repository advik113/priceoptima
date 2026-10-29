import React, { useState, useMemo, useEffect } from 'react';
import { Sliders, TrendingUp, ShieldCheck, Sparkles, AlertCircle, ArrowUpRight, CheckCircle2, Cpu } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export default function LiveSimulationWidget() {
  const { navigate } = useNavigation();
  // Simulator inputs matching backend ml/predict_price.py
  const [costPrice, setCostPrice] = useState(45.0);
  const [currentPrice, setCurrentPrice] = useState(99.99);
  const [competitorPrice, setCompetitorPrice] = useState(105.0);
  const [inventoryLevel, setInventoryLevel] = useState(35);
  const [demandLevel, setDemandLevel] = useState(3); // 1=Low, 2=Medium, 3=High
  const [season, setSeason] = useState(4); // 1=Spring, 2=Summer, 3=Fall, 4=Winter

  // Backend live prediction state
  const [backendResult, setBackendResult] = useState(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Debounced API call to Python backend
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('/api/pricing/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cost_price: costPrice,
          current_price: currentPrice,
          competitor_price: competitorPrice,
          demand_level: demandLevel,
          inventory_level: inventoryLevel,
          season: season,
          quantity_sold: 25,
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && data.simulation) {
            setBackendResult(data.simulation);
            setIsLiveConnected(true);
          } else {
            setIsLiveConnected(false);
          }
        })
        .catch(() => {
          setIsLiveConnected(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [costPrice, currentPrice, competitorPrice, inventoryLevel, demandLevel, season]);

  // Dynamic pricing calculation reflecting exact backend guardrails & model mechanics
  const calculation = useMemo(() => {
    if (backendResult && isLiveConnected) {
      const minMarginPrice = costPrice * 1.12;
      return {
        recommendedPrice: Number(backendResult.recommended_price).toFixed(2),
        priceDiff: Number(backendResult.price_difference).toFixed(2),
        pctChange: Number(backendResult.percentage_change).toFixed(1),
        profitMargin: Number(backendResult.profit_margin).toFixed(1),
        minFloor: minMarginPrice.toFixed(2),
        rationale: backendResult.reason,
        isFloorActive: backendResult.recommended_price <= minMarginPrice,
      };
    }

    // Client-side fallback calculation matching Python logic
    const demandMultiplier = demandLevel === 3 ? 1.08 : demandLevel === 2 ? 1.0 : 0.94;
    const inventoryFactor = inventoryLevel < 40 ? 1.06 : inventoryLevel > 100 ? 0.93 : 1.0;
    const compDiff = competitorPrice - currentPrice;
    const compFactor = compDiff > 0 ? Math.min(1.05, 1 + (compDiff / currentPrice) * 0.35) : Math.max(0.95, 1 + (compDiff / currentPrice) * 0.35);
    const seasonMultiplier = season === 4 ? 1.04 : season === 2 ? 1.02 : 1.0;

    const rawEstimated = currentPrice * demandMultiplier * inventoryFactor * compFactor * seasonMultiplier;
    const minMarginPrice = costPrice * 1.12;
    const guardedPrice = Math.max(rawEstimated, minMarginPrice);

    const maxAllowed = currentPrice * 1.25;
    const minAllowed = Math.max(currentPrice * 0.75, minMarginPrice);
    const finalPrice = Math.min(Math.max(guardedPrice, minAllowed), maxAllowed);

    const priceDiff = finalPrice - currentPrice;
    const pctChange = currentPrice > 0 ? (priceDiff / currentPrice) * 100 : 0;
    const profitMargin = finalPrice > 0 ? ((finalPrice - costPrice) / finalPrice) * 100 : 0;

    let rationale = "";
    if (demandLevel === 3 && inventoryLevel < 50) {
      rationale = "High consumer demand (Level 3) paired with low inventory (<50 units) creates pricing power. Algorithmic margin floor safeguarded at 12%+ ROI.";
    } else if (demandLevel === 1 && inventoryLevel > 100) {
      rationale = "High stock velocity dampening and low demand indicate a calculated markdown to liquidate inventory while maintaining positive unit margins.";
    } else if (competitorPrice > currentPrice * 1.05) {
      rationale = `Competitors are priced higher at $${competitorPrice.toFixed(2)}. Upward adjustment captures incremental profit margin without volume erosion.`;
    } else {
      rationale = `Balanced elasticity equilibrium. Price optimized at $${finalPrice.toFixed(2)} to maximize total revenue (Price × Quantity Sold).`;
    }

    return {
      recommendedPrice: finalPrice.toFixed(2),
      priceDiff: priceDiff.toFixed(2),
      pctChange: pctChange.toFixed(1),
      profitMargin: profitMargin.toFixed(1),
      minFloor: minMarginPrice.toFixed(2),
      rationale,
      isFloorActive: guardedPrice === minMarginPrice,
    };
  }, [costPrice, currentPrice, competitorPrice, inventoryLevel, demandLevel, season, backendResult, isLiveConnected]);

  return (
    <div id="simulation" className="w-full max-w-5xl mx-auto rounded-2xl bg-warmblack/80 border border-warmblack-border p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-bronze/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-olive/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warmblack-border">
        <div>
          <div className="flex items-center gap-2 text-bronze text-xs font-mono uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Elasticity Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-ivory">
            Live Pricing & Guardrail Simulator
          </h3>
          <p className="text-sm text-ivory-dim mt-1">
            Adjust real-time market signals to observe autonomous ML inference and profit-margin floor guardrails.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-charcoal px-3 py-1.5 rounded-lg border border-warmblack-border text-xs text-olive-light font-mono">
            <ShieldCheck className="w-4 h-4 text-bronze" />
            <span>Guardrail: Cost +12% Floor</span>
          </div>
          {isLiveConnected ? (
            <div className="flex items-center gap-1.5 bg-olive/20 text-olive-light border border-olive/30 px-2.5 py-1 rounded-lg text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-olive-light animate-pulse" />
              <span>Flask ML Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-warmblack text-ivory-muted border border-warmblack-border px-2.5 py-1 rounded-lg text-xs font-mono">
              <Cpu className="w-3 h-3 text-bronze" />
              <span>Client ML Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Controls on left, Live Result Card on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Prices Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-ivory-muted block mb-1.5">
                Cost Price ($)
              </label>
              <input
                type="number"
                min="5"
                max="500"
                step="1"
                value={costPrice}
                onChange={(e) => setCostPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-charcoal border border-warmblack-border rounded-lg px-3 py-2 text-ivory font-mono text-sm focus:outline-none focus:border-bronze transition-colors"
              />
              <span className="text-[10px] text-ivory-muted/70 mt-1 block">Min Floor: ${(costPrice * 1.12).toFixed(2)}</span>
            </div>

            <div>
              <label className="text-xs font-medium text-ivory-muted block mb-1.5">
                Current Price ($)
              </label>
              <input
                type="number"
                min="5"
                max="1000"
                step="1"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-charcoal border border-warmblack-border rounded-lg px-3 py-2 text-ivory font-mono text-sm focus:outline-none focus:border-bronze transition-colors"
              />
              <span className="text-[10px] text-ivory-muted/70 mt-1 block">Active selling price</span>
            </div>

            <div>
              <label className="text-xs font-medium text-ivory-muted block mb-1.5">
                Competitor Price ($)
              </label>
              <input
                type="number"
                min="5"
                max="1000"
                step="1"
                value={competitorPrice}
                onChange={(e) => setCompetitorPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-charcoal border border-warmblack-border rounded-lg px-3 py-2 text-ivory font-mono text-sm focus:outline-none focus:border-bronze transition-colors"
              />
              <span className="text-[10px] text-ivory-muted/70 mt-1 block">Live market scrape</span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ivory-muted">Inventory Units in Stock</span>
                <span className="text-bronze font-mono font-medium">{inventoryLevel} units</span>
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
                <span>5 (Scarcity)</span>
                <span>100 (Balanced)</span>
                <span>200 (Surplus)</span>
              </div>
            </div>

            {/* Demand Level Selector */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ivory-muted">Consumer Demand Velocity</span>
                <span className="text-bronze font-mono font-medium">
                  {demandLevel === 1 ? 'Low Demand' : demandLevel === 2 ? 'Moderate' : 'Peak High Demand'}
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
                    className={`py-2 text-xs rounded-lg font-medium transition-all border ${
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
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ivory-muted">Seasonal Cycle Factor</span>
                <span className="text-bronze font-mono font-medium">
                  {['Spring', 'Summer', 'Autumn', 'Winter / Q4'][season - 1]}
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
                    className={`py-1.5 text-xs rounded-lg transition-all border ${
                      season === s.id
                        ? 'bg-warmblack-surface border-bronze text-bronze font-medium'
                        : 'bg-charcoal text-ivory-muted border-warmblack-border hover:text-ivory'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Recommendation Output Column */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-charcoal/90 rounded-xl p-5 border border-bronze/30 shadow-xl relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-warmblack-border">
              <span className="text-xs uppercase tracking-wider text-olive-light font-mono">
                ML Recommendation Output
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-bronze bg-bronze/10 px-2 py-0.5 rounded-full border border-bronze/20">
                <CheckCircle2 className="w-3 h-3" />
                Guarded
              </span>
            </div>

            {/* Big Price Display */}
            <div>
              <span className="text-xs text-ivory-muted block mb-1">Optimal Recommended Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-serif font-bold text-ivory tracking-tight">
                  ${calculation.recommendedPrice}
                </span>
                <span
                  className={`text-sm font-mono font-medium px-2 py-0.5 rounded ${
                    parseFloat(calculation.priceDiff) >= 0
                      ? 'text-olive-light bg-olive/15'
                      : 'text-bronze-light bg-bronze/15'
                  }`}
                >
                  {parseFloat(calculation.priceDiff) >= 0 ? '+' : ''}${calculation.priceDiff} ({calculation.pctChange}%)
                </span>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-warmblack-border text-xs font-mono">
              <div className="bg-warmblack/50 p-2.5 rounded-lg border border-warmblack-border">
                <span className="text-ivory-muted block text-[11px]">Expected Margin ROI</span>
                <span className="text-ivory font-semibold text-base mt-0.5 block text-olive-light">
                  {calculation.profitMargin}%
                </span>
              </div>
              <div className="bg-warmblack/50 p-2.5 rounded-lg border border-warmblack-border">
                <span className="text-ivory-muted block text-[11px]">Cost Floor Limit</span>
                <span className="text-ivory font-semibold text-base mt-0.5 block text-bronze">
                  ${calculation.minFloor}
                </span>
              </div>
            </div>

            {/* Explanation / Rationale */}
            <div className="text-xs text-ivory-dim leading-relaxed bg-warmblack/70 p-3 rounded-lg border border-warmblack-border">
              <div className="flex items-center gap-1.5 text-bronze font-mono text-[11px] mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Explainable AI Rationale:</span>
              </div>
              <p>{calculation.rationale}</p>
            </div>
          </div>

          {/* Action Callout */}
          <div className="pt-4 mt-4 border-t border-warmblack-border">
            <button
              onClick={() => navigate('/register')}
              className="w-full py-2.5 px-4 bg-bronze text-charcoal-dark font-semibold text-sm rounded-lg hover:bg-bronze-light transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-bronze/20 cursor-pointer"
            >
              <span>Connect Your Catalog to AI</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
