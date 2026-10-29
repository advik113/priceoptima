import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  DollarSign, 
  Layers, 
  Filter,
  ArrowUpDown
} from 'lucide-react';

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Form states
  const [formState, setFormState] = useState({
    name: '',
    category: 'General',
    cost_price: 45.0,
    base_price: 99.99,
    current_price: 99.99,
    competitor_price: 105.0,
    inventory_level: 50,
    demand_level: 2,
    season: 1
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to load products.');
      const json = await res.json();
      setProducts(json.products || []);
    } catch (err) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setFormState({
      name: '',
      category: 'General',
      cost_price: 45.0,
      base_price: 99.99,
      current_price: 99.99,
      competitor_price: 105.0,
      inventory_level: 50,
      demand_level: 2,
      season: 1
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formState)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add product.');

      setIsAddModalOpen(false);
      setActionMessage({ type: 'success', text: `Product '${formState.name}' saved to MySQL.` });
      await fetchProducts();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/products/edit/${editingProduct.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: editingProduct.name,
          category: editingProduct.category,
          cost_price: parseFloat(editingProduct.cost_price),
          base_price: parseFloat(editingProduct.base_price),
          current_price: parseFloat(editingProduct.current_price)
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update product.');

      setEditingProduct(null);
      setActionMessage({ type: 'success', text: `Product '${editingProduct.name}' updated.` });
      await fetchProducts();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deletingProduct) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/products/delete/${deletingProduct.id}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete product.');

      setDeletingProduct(null);
      setActionMessage({ type: 'success', text: `Product '${deletingProduct.name}' deleted.` });
      await fetchProducts();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered products list
  const categories = ['ALL', ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory tracking-tight">
            My Catalog Products
          </h1>
          <p className="text-xs sm:text-sm text-ivory-dim font-light mt-1">
            Manage your tenant inventory SKUs, cost floors, and current pricing benchmarks in MySQL.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-bronze text-charcoal font-semibold text-xs hover:bg-bronze-light transition-all shadow-md hover:shadow-bronze/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Action Banners */}
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

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-warmblack/80 border border-warmblack-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ivory-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal border border-warmblack-border rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-ivory placeholder-ivory-muted/40 focus:outline-none focus:border-bronze"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ivory-muted shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-charcoal border border-warmblack-border rounded-xl px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-bronze"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-2xl bg-warmblack/80 border border-warmblack-border shadow-lg">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 text-bronze animate-spin" />
            <p className="text-xs font-mono text-ivory-dim">Loading MySQL Records...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-ivory-muted border-b border-warmblack-border pb-3 uppercase text-[10px] tracking-wider">
                  <th className="pb-3">SKU Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Cost Floor</th>
                  <th className="pb-3 text-right">MSRP Base</th>
                  <th className="pb-3 text-right">Active Price</th>
                  <th className="pb-3 text-right">Competitor</th>
                  <th className="pb-3 text-right">Stock</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmblack-border/40">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-charcoal/40 transition-colors">
                    <td className="py-3.5 text-ivory font-sans font-semibold max-w-[200px] truncate">
                      {p.name}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded bg-charcoal border border-warmblack-border text-ivory-dim text-[11px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-ivory-muted">${p.cost_price}</td>
                    <td className="py-3.5 text-right text-ivory-dim">${p.base_price}</td>
                    <td className="py-3.5 text-right text-bronze font-bold text-sm">
                      ${p.current_price}
                    </td>
                    <td className="py-3.5 text-right text-ivory-muted">
                      ${p.competitor_price || p.current_price}
                    </td>
                    <td className="py-3.5 text-right text-olive-light font-bold">
                      {p.inventory_level || 50}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-charcoal border border-warmblack-border text-ivory-dim hover:text-bronze transition-colors"
                          title="Edit SKU"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 rounded-lg bg-charcoal border border-warmblack-border text-ivory-dim hover:text-red-400 transition-colors"
                          title="Delete SKU"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-ivory-muted font-light space-y-3">
            <Package className="w-8 h-8 text-ivory-muted/40 mx-auto" />
            <p>No products match your search or filter.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-warmblack-dark border border-warmblack-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-warmblack-border mb-5">
              <h3 className="text-lg font-serif font-bold text-ivory">
                Add Catalog Product
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-ivory-muted hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-ivory-muted block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Office Chair"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory-muted block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="text-ivory-muted block mb-1">Cost Price Floor ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formState.cost_price}
                    onChange={(e) => setFormState({ ...formState, cost_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-ivory-muted block mb-1">Base MSRP ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formState.base_price}
                    onChange={(e) => setFormState({ ...formState, base_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none"
                  />
                </div>
                <div>
                  <label className="text-ivory-muted block mb-1">Initial Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={formState.current_price}
                    onChange={(e) => setFormState({ ...formState, current_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-warmblack-border/40">
                <div>
                  <label className="text-ivory-muted block mb-1">Competitor Benchmark ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.competitor_price}
                    onChange={(e) => setFormState({ ...formState, competitor_price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none"
                  />
                </div>
                <div>
                  <label className="text-ivory-muted block mb-1">Stock Level (Units)</label>
                  <input
                    type="number"
                    min="1"
                    value={formState.inventory_level}
                    onChange={(e) => setFormState({ ...formState, inventory_level: parseInt(e.target.value) || 50 })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none"
                  />
                </div>
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
                  <span>Save to MySQL</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-warmblack-dark border border-warmblack-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-warmblack-border mb-5">
              <h3 className="text-lg font-serif font-bold text-ivory">
                Edit Product: {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-ivory-muted hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-ivory-muted block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none font-sans"
                />
              </div>

              <div>
                <label className="text-ivory-muted block mb-1">Category</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3.5 py-2.5 text-ivory focus:border-bronze outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-ivory-muted block mb-1">Cost Floor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.cost_price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, cost_price: e.target.value })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3 py-2 text-ivory focus:border-bronze outline-none"
                  />
                </div>
                <div>
                  <label className="text-ivory-muted block mb-1">MSRP Base</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.base_price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, base_price: e.target.value })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3 py-2 text-ivory focus:border-bronze outline-none"
                  />
                </div>
                <div>
                  <label className="text-ivory-muted block mb-1">Active Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.current_price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, current_price: e.target.value })}
                    className="w-full bg-charcoal border border-warmblack-border rounded-xl px-3 py-2 text-ivory focus:border-bronze outline-none text-bronze font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-warmblack-border">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
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
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-warmblack-dark border border-warmblack-border rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative text-center space-y-4">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-ivory">
              Delete Product?
            </h3>
            <p className="text-xs text-ivory-dim font-light leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-ivory font-mono">'{deletingProduct.name}'</strong>? This will cascade and remove its related sales and market records from MySQL.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl bg-charcoal border border-warmblack-border text-xs font-mono text-ivory-dim hover:text-ivory"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-red-800 text-ivory font-semibold text-xs hover:bg-red-700 transition-colors flex items-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

