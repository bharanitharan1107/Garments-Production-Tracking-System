import { useState } from 'react';
import { inventory as initialInventory, InventoryItem } from '../data/mockData';
import { Plus, Search, AlertTriangle, Package, Edit, Trash2, X, TrendingDown, Tag, Truck } from 'lucide-react';

const CATEGORIES = ['All', 'Fabric', 'Thread', 'Accessories', 'Labels', 'Packaging'];

function StockBar({ qty, min, max }: { qty: number; min: number; max: number }) {
  const pct = Math.min(100, Math.round((qty / max) * 100));
  const isLow = qty < min;
  const isCritical = qty < min * 0.5;
  const color = isCritical ? 'bg-[var(--foreground)]' : isLow ? 'bg-[var(--text-neutral-400)]' : 'bg-[var(--text-neutral-400)]';
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 bg-[var(--hover-bg)] rounded-full h-1.5 border border-[var(--border-primary)]">
        <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[12px] text-[var(--text-neutral-450)] w-8 text-right">{pct}%</span>
    </div>
  );
}

const emptyItem: Partial<InventoryItem> = {
  name: '', category: 'Fabric', sku: '', quantity: 0, unit: 'meters',
  minStock: 0, maxStock: 0, location: '', supplier: '', costPerUnit: 0
};

function StatusBadge({ item }: { item: InventoryItem }) {
  if (item.quantity < item.minStock * 0.5) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-primary)] font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] inline-block" />
        Critical
      </span>
    );
  }
  if (item.quantity < item.minStock) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-primary)] font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-neutral-400)] inline-block" />
        Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-neutral-450)]">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-neutral-400)] inline-block" />
      In Stock
    </span>
  );
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Partial<InventoryItem>>(emptyItem);
  const [isEditing, setIsEditing] = useState(false);

  const filtered = items.filter(item => {
    const matchSearch = !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || item.category === catFilter;
    const matchStock = stockFilter === 'All' ||
      (stockFilter === 'Low Stock' && item.quantity < item.minStock) ||
      (stockFilter === 'In Stock' && item.quantity >= item.minStock);
    return matchSearch && matchCat && matchStock;
  });

  const lowStockItems = items.filter(i => i.quantity < i.minStock);
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.costPerUnit, 0);
  const categories = CATEGORIES.length - 1;
  const suppliers = [...new Set(items.map(i => i.supplier))].length;

  const openNew = () => {
    setEditItem({ ...emptyItem, sku: `SKU-${Date.now()}` });
    setIsEditing(false);
    setShowForm(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditItem({ ...item });
    setIsEditing(true);
    setShowForm(true);
  };

  const saveItem = () => {
    if (!editItem.name) return;
    if (isEditing) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...editItem } as InventoryItem : i));
    } else {
      setItems(prev => [...prev, { ...editItem as InventoryItem, id: `inv${Date.now()}`, lastUpdated: new Date().toISOString().split('T')[0] }]);
    }
    setShowForm(false);
  };

  const deleteItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const cardStats = [
    { label: 'Total Items', value: items.length, icon: Package, change: `${lowStockItems.length} low stock`, time: 'Updated just now' },
    { label: 'Low Stock', value: lowStockItems.length, icon: TrendingDown, change: 'Requires reorder', time: 'Needs attention' },
    { label: 'Categories', value: categories, icon: Tag, change: 'Active categories', time: 'All types' },
    { label: 'Suppliers', value: suppliers, icon: Truck, change: `₹${totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} total value`, time: 'Across all items' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">Inventory Management</h2>
          <p className="text-[var(--text-neutral-450)] text-sm mt-1">{items.length} items · Total Value: ₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-xs px-4 py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer border border-[var(--border-primary)]">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Low stock alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-4 text-left shadow-[var(--card-shadow)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[var(--text-primary)]" />
            <span className="text-[var(--text-primary)] font-semibold text-sm">{lowStockItems.length} items below minimum stock level</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <span key={item.id} className="text-[11px] bg-[var(--hover-bg)] text-[var(--text-neutral-450)] px-2.5 py-1 rounded-full border border-[var(--border-primary)]">
                {item.name} ({item.quantity} {item.unit})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {cardStats.map(s => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[var(--text-neutral-450)] text-sm font-medium">{s.label}</span>
              <s.icon className="w-4.5 h-4.5 text-[var(--text-neutral-400)]" />
            </div>
            <div className="text-[36px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-2">{s.value}</div>
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-neutral-450)]">
              <span className="font-semibold text-[var(--text-primary)]">{s.change}</span>
              <span>·</span>
              <span>{s.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Category tabs & Filter controls */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-4 flex flex-wrap gap-4 items-center shadow-[var(--card-shadow)]">
        <div className="flex gap-1 bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-primary)]">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                catFilter === cat
                  ? 'bg-[var(--card)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                  : 'text-[var(--text-neutral-450)] hover:text-[var(--text-primary)]'
              }`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-3">
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}
            className="h-10 bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[var(--text-primary)] transition-all duration-200 hover:border-[var(--text-neutral-405)] cursor-pointer">
            <option>All</option>
            <option>In Stock</option>
            <option>Low Stock</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-neutral-450)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..."
              className="h-10 bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-neutral-450)] rounded-lg pl-10 pr-4 text-[14px] w-52 focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-left">
        <div className="overflow-x-auto relative">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--bg-input)] border-b border-[var(--border-primary)] sticky top-0 z-10">
              <tr className="text-[var(--text-neutral-450)] text-[13px] font-medium">
                {['Item Name', 'SKU', 'Category', 'Stock Level', 'Qty / Unit', 'Min Stock', 'Location', 'Supplier', 'Cost/Unit', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3.5 font-medium text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)] text-[14px]">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-[var(--hover-bg)] transition-colors duration-150">
                  <td className="px-4 py-4 text-[var(--text-primary)] font-semibold">{item.name}</td>
                  <td className="px-4 py-4 text-[var(--text-neutral-450)] font-mono text-[12px]">{item.sku}</td>
                  <td className="px-4 py-4">
                    <span className="text-[11px] border border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-neutral-450)] px-2 py-0.5 rounded-md">{item.category}</span>
                  </td>
                  <td className="px-4 py-4"><StockBar qty={item.quantity} min={item.minStock} max={item.maxStock} /></td>
                  <td className="px-4 py-4 text-[var(--text-primary)]">{item.quantity.toLocaleString()} <span className="text-[var(--text-neutral-450)] text-[12px]">{item.unit}</span></td>
                  <td className="px-4 py-4 text-[var(--text-neutral-450)]">{item.minStock.toLocaleString()}</td>
                  <td className="px-4 py-4 text-[var(--text-neutral-450)] max-w-[140px] truncate">{item.location}</td>
                  <td className="px-4 py-4 text-[var(--text-neutral-450)]">{item.supplier}</td>
                  <td className="px-4 py-4 text-[var(--text-primary)] font-medium">₹{item.costPerUnit.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4"><StatusBadge item={item} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(item)} title="Edit" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deleteItem(item.id)} title="Delete" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="text-center text-[var(--text-neutral-450)] py-12">No items found matching your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <h3 className="text-[var(--text-primary)] font-bold text-lg">{isEditing ? 'Edit Item' : 'Add Inventory Item'}</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><X className="w-4.5 h-4.5" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Item Name*', key: 'name', type: 'text', col: 2 },
                { label: 'SKU', key: 'sku', type: 'text', col: 1 },
                { label: 'Unit', key: 'unit', type: 'text', col: 1 },
                { label: 'Quantity', key: 'quantity', type: 'number', col: 1 },
                  { label: 'Cost Per Unit (₹)', key: 'costPerUnit', type: 'number', col: 1 },
                { label: 'Min Stock', key: 'minStock', type: 'number', col: 1 },
                { label: 'Max Stock', key: 'maxStock', type: 'number', col: 1 },
                { label: 'Location', key: 'location', type: 'text', col: 2 },
                { label: 'Supplier', key: 'supplier', type: 'text', col: 2 },
              ].map(f => (
                <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">{f.label}</label>
                  <input type={f.type} value={(editItem as any)[f.key] || ''}
                    onChange={e => setEditItem(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
              ))}
              <div>
                <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Category</label>
                <select value={editItem.category || 'Fabric'} onChange={e => setEditItem(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 cursor-pointer">
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-transparent border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer">Cancel</button>
              <button onClick={saveItem} className="flex-1 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-sm rounded-lg py-2.5 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                {isEditing ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
