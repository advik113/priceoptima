import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  Package
} from 'lucide-react';

export default function SalesTab() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Add Sale Form State
  const [formState, setFormState] = useState({
    product_id: '',
    quantity_sold: 1,
    selling_price: 0,
    sale_date: new Date().toISOString().split('T')[0]
  });

  const fetchSales = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/sales', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to load sales log.');
      const json = await res.json();
      setSales(json.sales || []);
      setProducts(json.products || []);
      if (json.products && json.products.length > 0 && !formState.product_id) {
        setFormState((prev) => ({
          ...prev,
          product_id: json.products[0].id,
          selling_price: json.products[0].current_price
        }));
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleProductChange = (prodId) => {
    const selected = products.find((p) => p.id === parseInt(prodId));
    setFormState({
      ...formState,
      product_id: prodId,
      selling_price: selected ? selected.current_price : 0
    });
  };

  const handleAddSaleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/sales/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formState)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to record sale.');

      setIsAddModalOpen(false);
      setActionMessage({ type: 'success', text: json.message || 'Sale recorded and inventory updated.' });
      await fetchSales();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const exportSalesCSV = () => {
    if (sales.length === 0) return;
    const headers = ['Transaction ID', 'Product ID', 'Product Name', 'Date', 'Quantity Sold', 'Unit Price ($)', 'Total Revenue ($)'];
    const rows = sales.map((s) => [
      s.id,
      s.product_id,
      `"${s.product_name.replace(/"/g, '""')}"`,
      s.sale_date,
      s.quantity_sold,
      s.selling_price,
      s.total_revenue
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PriceOptima_Sales_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalRevenue = sales.reduce((acc, s) => acc + (s.total_revenue || 0), 0);
  const totalUnits = sales.reduce((acc, s) => acc + (s.quantity_sold || 0), 0);
  const avgOrderValue = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0.00';

  // Filtered sales
  const filteredSales = sales.filter((s) =>
    s.product_name.toLowerCase().includes(search.toLowerCase()) ||
    s.sale_date.includes(search)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-tight">
            My Sales Transactions Log
          </h1>
          <p className="text-xs sm:text-sm text-ivory-dim font-light mt-1">
            Real transactional history recorded in MySQL, used for demand velocity calculations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {sales.length > 0 && (
            <button
              onClick={exportSalesCSV}
              className="px-3.5 py-2.5 rounded-xl bg-charcoal border border-warmblack-border text-ivory-dim hover:text-bronze text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={products.length === 0}
            className="px-4 py-2.5 rounded-xl bg-bronze text-charcoal font-semibold text-xs hover:bg-bronze-light transition-all shadow-md hover:shadow-bronze/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Record Real Sale</span>
          </button>
        </div>
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

      {/* 3 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-warmblack/80 border border-warmblack-border">
          <span className="text-xs font-mono uppercase tracking-wider text-ivory-muted block mb-2">
            Cumulative Revenue
          </span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] font-mono text-olive-light mt-1 block">
            Across {sales.length} Logged Transactions
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-warmblack/80 border border-warmblack-border">
          <span className="text-xs font-mono uppercase tracking-wider text-ivory-muted block mb-2">
            Total Units Sold
          </span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-bronze">
            {totalUnits} Units
          </div>
          <span className="text-[11px] font-mono text-olive-light mt-1 block">
            Warehouse Velocity Ingested
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-warmblack/80 border border-warmblack-border">
          <span className="text-xs font-mono uppercase tracking-wider text-ivory-muted block mb-2">
            Average Order Value (AOV)
          </span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
            ${avgOrderValue}
          </div>
          <span className="text-[11px] font-mono text-olive-light mt-1 block">
            Revenue per Transaction Event
          </span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl bg-warmblack/80 border border-warmblack-border shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-ivory-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by product name or date (YYYY-MM-DD)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal border border-warmblack-border rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-ivory placeholder-ivory-muted/40 focus:outline-none focus:border-bronze"
          />
        </div>
      </div>

      {/* Sales Log Table */}
      <div className="p-6 rounded-2xl bg-warmblack/80 border border-warmblack-border shadow-lg">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 text-bronze animate-spin" />
            <p className="text-xs font-mono text-ivory-dim">Querying Sales Table...</p>
          </div>
        ) : filteredSales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-ivory-muted border-b border-warmblack-border pb-3 uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Transaction #</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3 text-right">Units Sold</th>
                  <th className="pb-3 text-right">Selling Price</th>
                  <th className="pb-3 text-right pr-2">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmblack-border/40">
                {filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-charcoal/40 transition-colors">
                    <td className="py-3 text-ivory-muted">#{s.id}</td>
                    <td className="py-3 text-ivory-dim">{s.sale_date}</td>
                    <td className="py-3 text-ivory font-sans font-medium">{s.product_name}</td>
                    <td className="py-3 text-right text-olive-light font-bold">{s.quantity_sold}x</td>
                    <td className="py-3 text-right text-ivory-dim">${s.selling_price}</td>
                    <td className="py-3 text-right pr-2 text-bronze font-bold text-sm">
                      ${s.total_revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-ivory-muted font-light space-y-2">
            <Receipt className="w-8 h-8 text-ivory-muted/40 mx-auto" />
            <p>No sales records found matching your filter.</p>
          </div>
        )}
      </div>

      {/* Record Real Sale Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-warmblack-dark border border-warmblack-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-warmblack-border mb-5">
              <h3 className="text-lg font-serif font-bold text-ivory">
                Record Sales Transaction
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-ivory-muted hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSaleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-ivory-muted block mb-1">Select Product</label>
                <select
                  required
                  value={formState.product_id}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none font-sans"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Active Price: ${p.current_price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory-muted block mb-1">Quantity Sold</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formState.quantity_sold}
                    onChange={(e) => setFormState({ ...formState, quantity_sold: parseInt(e.target.value) || 1 })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none"
                  />
                </div>
                <div>
                  <label className="text-ivory-muted block mb-1">Unit Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formState.selling_price}
                    onChange={(e) => setFormState({ ...formState, selling_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-ivory-muted block mb-1">Transaction Date</label>
                <input
                  type="date"
                  required
                  value={formState.sale_date}
                  onChange={(e) => setFormState({ ...formState, sale_date: e.target.value })}
                  className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none"
                />
              </div>

              <div className="p-3 bg-charcoal rounded-xl border border-warmblack-border flex justify-between items-center text-xs">
                <span className="text-ivory-muted">Estimated Total Revenue:</span>
                <span className="text-bronze font-bold text-sm">
                  ${(formState.quantity_sold * formState.selling_price).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-warmblack-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  <span>Commit to MySQL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

