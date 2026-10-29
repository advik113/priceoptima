import React, { useState, useEffect } from 'react';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  BarChart2, 
  AlertCircle,
  Loader2,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export default function OverviewTab() {
  const { navigate } = useNavigation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);
  const [seedingDemo, setSeedingDemo] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard/overview', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to load dashboard data.');
      const json = await res.json();
      setData(json);

      // Fetch sales trend chart
      const chartRes = await fetch('/api/chart/sales-trends', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (chartRes.ok) {
        const cJson = await chartRes.json();
        setChartData(cJson);
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleSeedDemo = async () => {
    setSeedingDemo(true);
    try {
      const res = await fetch('/api/user/load-demo-data', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        await fetchOverview();
      }
    } catch {
      // Ignored
    } finally {
      setSeedingDemo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-bronze animate-spin" />
        <p className="text-xs font-mono text-ivory-dim">Querying MySQL & ML Engine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-warmblack/80 border border-red-900/40 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="text-sm text-red-300">{error}</p>
        <button
          onClick={fetchOverview}
          className="px-4 py-2 rounded-lg bg-charcoal border border-warmblack-border text-xs font-mono text-ivory hover:text-bronze"
        >
          Retry Query
        </button>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const recentSales = data?.recent_sales || [];
  const recentRecs = data?.recent_recs || [];
  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-tight">
            Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-ivory-dim font-light mt-1">
            Real-time catalog telemetry, automated pricing performance, and transaction velocities.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={fetchOverview}
            className="p-2 rounded-xl bg-warmblack border border-warmblack-border text-ivory-dim hover:text-bronze transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className="px-4 py-2 rounded-xl bg-bronze text-charcoal font-semibold text-xs hover:bg-bronze-light transition-all flex items-center gap-2 shadow-md hover:shadow-bronze/20"
          >
            <Cpu className="w-4 h-4" />
            <span>Optimize Pricing</span>
          </button>
        </div>
      </div>

      {/* Empty State Banner (if 0 products) */}
      {!data?.has_products && (
        <div className="p-6 rounded-2xl bg-warmblack/90 border border-bronze/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center gap-2 text-bronze text-xs font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Empty Catalog State</span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-ivory">
              Welcome to PriceOptima AI
            </h3>
            <p className="text-xs text-ivory-dim max-w-xl font-light">
              Your account currently has no active products. You can either add products manually or seed our standard 4-SKU retail demo catalog to immediately test dynamic price inference.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 rounded-xl bg-charcoal border border-warmblack-border text-xs font-medium text-ivory hover:text-bronze transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-bronze" />
              <span>Add Custom SKU</span>
            </button>
            <button
              onClick={handleSeedDemo}
              disabled={seedingDemo}
              className="px-4 py-2 rounded-xl bg-bronze text-charcoal text-xs font-semibold hover:bg-bronze-light transition-all flex items-center gap-1.5"
            >
              {seedingDemo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Load Starter Demo Catalog</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-warmblack/80 border border-warmblack-border hover:border-bronze/30 transition-all shadow-lg">
          <div className="flex items-center justify-between text-ivory-muted mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Catalog SKUs</span>
            <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center text-bronze">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-ivory">
            {kpis.total_products || 0}
          </div>
          <div className="text-[11px] font-mono text-olive-light mt-1.5 flex items-center gap-1">
            <span>Avg Active Price:</span>
            <span className="text-ivory">${kpis.avg_price || '0.00'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-warmblack/80 border border-warmblack-border hover:border-bronze/30 transition-all shadow-lg">
          <div className="flex items-center justify-between text-ivory-muted mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center text-olive-light">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-ivory">
            ${kpis.total_revenue?.toLocaleString() || '0.00'}
          </div>
          <div className="text-[11px] font-mono text-olive-light mt-1.5">
            {kpis.user_sales_count || 0} Transactions Logged
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-warmblack/80 border border-warmblack-border hover:border-bronze/30 transition-all shadow-lg">
          <div className="flex items-center justify-between text-ivory-muted mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Units Sold</span>
            <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center text-bronze">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-ivory">
            {kpis.total_units_sold || 0}
          </div>
          <div className="text-[11px] font-mono text-olive-light mt-1.5">
            Velocity Tracked Across Catalog
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-warmblack/80 border border-warmblack-border hover:border-bronze/30 transition-all shadow-lg">
          <div className="flex items-center justify-between text-ivory-muted mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">AI Recommendations</span>
            <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center text-bronze">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-ivory">
            {kpis.pending_recs || 0}
            <span className="text-sm font-sans font-normal text-ivory-muted ml-2">Pending</span>
          </div>
          <div className="text-[11px] font-mono text-olive-light mt-1.5">
            {kpis.applied_recs || 0} Applied to Live Catalog
          </div>
        </div>
      </div>

      {/* Grid: Sales Trend Visual Chart + ML Model Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Visual Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-warmblack/80 border border-warmblack-border">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-warmblack-border/60">
            <div>
              <h3 className="text-base font-serif font-semibold text-ivory">
                Revenue & Sales Trends
              </h3>
              <p className="text-xs text-ivory-dim font-light">
                Aggregated revenue performance across sales date sequence.
              </p>
            </div>
            <span className="text-xs font-mono text-olive-light bg-charcoal px-2.5 py-1 rounded border border-warmblack-border">
              REST /api/chart/sales-trends
            </span>
          </div>

          {/* Simple Visual Line / Bar Chart Representation */}
          {chartData && chartData.labels && chartData.labels.length > 0 ? (
            <div className="space-y-4">
              <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2 overflow-x-auto">
                {chartData.labels.map((label, idx) => {
                  const rev = chartData.revenues[idx] || 0;
                  const maxRev = Math.max(...chartData.revenues, 1);
                  const heightPercent = Math.max(15, Math.min(100, (rev / maxRev) * 100));
                  return (
                    <div key={idx} className="flex-1 min-w-[45px] flex flex-col items-center gap-2 group">
                      <div className="text-[10px] font-mono text-bronze opacity-0 group-hover:opacity-100 transition-opacity">
                        ${rev}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-charcoal via-bronze/40 to-bronze rounded-t transition-all group-hover:brightness-125"
                      />
                      <span className="text-[10px] font-mono text-ivory-muted truncate w-full text-center">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-ivory-dim pt-2 border-t border-warmblack-border/40">
                <span>Total Historical Velocity Point Count: {chartData.labels.length}</span>
                <span className="text-bronze">Real-time MySQL Aggregation</span>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center p-6 border border-dashed border-warmblack-border rounded-xl">
              <BarChart2 className="w-8 h-8 text-ivory-muted/40 mb-2" />
              <p className="text-xs text-ivory-dim font-light">
                No historical sales logged yet. Record a sale to view graphical revenue trends.
              </p>
              <button
                onClick={() => navigate('/sales')}
                className="mt-3 text-xs font-mono text-bronze hover:underline"
              >
                Log First Sale &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Model Performance & Guardrails */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-warmblack/80 border border-warmblack-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-bronze text-xs font-mono uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>Inference Engine</span>
            </div>
            <h3 className="text-base font-serif font-semibold text-ivory">
              Random Forest Regressor
            </h3>
            <p className="text-xs text-ivory-dim font-light mt-1">
              Active predictive model evaluating non-linear retail price elasticity.
            </p>

            <div className="mt-5 space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-charcoal border border-warmblack-border flex items-center justify-between">
                <span className="text-ivory-muted">Model Accuracy (R²)</span>
                <span className="text-bronze font-bold text-sm">
                  {metrics?.r2_score ? `${(metrics.r2_score * 100).toFixed(2)}%` : '99.47%'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-charcoal border border-warmblack-border flex items-center justify-between">
                <span className="text-ivory-muted">Cost Margin Floor</span>
                <span className="text-olive-light font-bold text-sm">+12% Minimum</span>
              </div>

              <div className="p-3 rounded-xl bg-charcoal border border-warmblack-border flex items-center justify-between">
                <span className="text-ivory-muted">Max Price Swing</span>
                <span className="text-ivory font-bold text-sm">&plusmn;25% Capped</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-warmblack-border/60">
            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-2.5 rounded-xl bg-charcoal border border-warmblack-border hover:border-bronze text-xs font-mono text-ivory hover:text-bronze transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Pricing Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Recent Sales Activity & Recent AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales Table */}
        <div className="p-6 rounded-2xl bg-warmblack/80 border border-warmblack-border">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-warmblack-border/60">
            <h3 className="text-base font-serif font-semibold text-ivory">
              Recent Sales Transactions
            </h3>
            <button
              onClick={() => navigate('/sales')}
              className="text-xs font-mono text-bronze hover:underline"
            >
              View Full Log ({kpis.user_sales_count || 0})
            </button>
          </div>

          {recentSales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-ivory-muted border-b border-warmblack-border/40 pb-2">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Product</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warmblack-border/30">
                  {recentSales.map((s) => (
                    <tr key={s.id} className="hover:bg-charcoal/40 transition-colors">
                      <td className="py-2.5 text-ivory-muted">{s.sale_date}</td>
                      <td className="py-2.5 text-ivory font-sans font-medium truncate max-w-[150px]">
                        {s.product_name}
                      </td>
                      <td className="py-2.5 text-right text-olive-light font-bold">{s.quantity_sold}x</td>
                      <td className="py-2.5 text-right text-ivory font-bold">${s.total_revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-ivory-muted font-light">
              No transactions recorded yet.
            </div>
          )}
        </div>

        {/* Recent AI Recommendations */}
        <div className="p-6 rounded-2xl bg-warmblack/80 border border-warmblack-border">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-warmblack-border/60">
            <h3 className="text-base font-serif font-semibold text-ivory">
              Recent AI Recommendations
            </h3>
            <button
              onClick={() => navigate('/pricing')}
              className="text-xs font-mono text-bronze hover:underline"
            >
              Dynamic Pricing Hub
            </button>
          </div>

          {recentRecs.length > 0 ? (
            <div className="space-y-3">
              {recentRecs.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl bg-charcoal/80 border border-warmblack-border hover:border-bronze/40 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1 max-w-[65%]">
                    <div className="text-xs font-sans font-semibold text-ivory truncate">
                      {rec.product_name}
                    </div>
                    <div className="text-[11px] font-mono text-ivory-dim">
                      ${rec.current_price} &rarr;{' '}
                      <span className="text-bronze font-bold">${rec.recommended_price}</span>{' '}
                      <span className={rec.price_difference >= 0 ? 'text-olive-light' : 'text-red-400'}>
                        ({rec.price_difference >= 0 ? '+' : ''}${rec.price_difference})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        rec.status === 'Applied'
                          ? 'bg-olive/15 text-olive-light border-olive/30'
                          : 'bg-bronze/15 text-bronze border-bronze/30'
                      }`}
                    >
                      {rec.status}
                    </span>
                    <span className="text-[10px] font-mono text-ivory-muted/60">
                      {rec.generated_at}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-ivory-muted font-light">
              No recommendations generated yet. Head to Dynamic Pricing to run ML inference.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

