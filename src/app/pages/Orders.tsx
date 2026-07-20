import { useState } from 'react';
import { orders as initialOrders, Order, OrderStatus, Priority } from '../data/mockData';
import { 
  Plus, Search, Eye, Edit, Trash2, X, ChevronDown, ArrowUpRight, 
  ShoppingCart, Clock, AlertCircle, CheckCircle2, Check, Circle, ShieldAlert, Pause
} from 'lucide-react';

const STATUS_BADGES: Record<OrderStatus, { icon: React.ReactNode; label: string; className: string }> = {
  'Pending': {
    icon: <Circle className="w-2.5 h-2.5 mr-1.5 flex-shrink-0" />,
    label: 'Pending',
    className: 'text-[var(--text-neutral-450)] border-[var(--border-primary)] bg-[var(--hover-bg)]',
  },
  'In Progress': {
    icon: (
      <svg className="w-2.5 h-2.5 mr-1.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 0 12 22A10 10 0 0 0 12 2 M12 4V20A8 8 0 0 0 12 4" />
      </svg>
    ),
    label: 'In Progress',
    className: 'text-[var(--text-primary)] border-[var(--border-primary)] bg-[var(--hover-bg)] font-medium',
  },
  'QC Review': {
    icon: <ShieldAlert className="w-2.5 h-2.5 mr-1.5 flex-shrink-0" />,
    label: 'QC Review',
    className: 'text-[var(--text-primary)] border-[var(--border-primary)] bg-[var(--hover-bg)] border-dashed',
  },
  'Completed': {
    icon: <Check className="w-2.5 h-2.5 mr-1.5 flex-shrink-0" />,
    label: 'Completed',
    className: 'text-[var(--text-primary)] border-[var(--border-primary)] bg-[var(--hover-bg)] font-semibold',
  },
  'Cancelled': {
    icon: <X className="w-2.5 h-2.5 mr-1.5 flex-shrink-0" />,
    label: 'Cancelled',
    className: 'text-[var(--text-neutral-450)] border-[var(--border-primary)] bg-[var(--hover-bg)] opacity-60 line-through',
  },
  'On Hold': {
    icon: <Pause className="w-2.5 h-2.5 mr-1.5 flex-shrink-0" />,
    label: 'On Hold',
    className: 'text-[var(--text-neutral-450)] border-[var(--border-primary)] bg-[var(--hover-bg)]',
  },
};

const PRIORITY_BADGES: Record<Priority, { label: string; className: string; icon?: React.ReactNode }> = {
  'Critical': {
    label: 'Critical',
    icon: <span className="mr-1 text-[8px] leading-none">▲</span>,
    className: 'bg-[var(--hover-bg)] text-[var(--text-primary)] border border-[var(--border-primary)] font-semibold rounded px-1.5 py-0.5 text-[10px] inline-flex items-center',
  },
  'High': {
    label: 'High',
    className: 'bg-[var(--hover-bg)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded px-1.5 py-0.5 text-[10px] inline-flex items-center',
  },
  'Medium': {
    label: 'Medium',
    className: 'bg-transparent text-[var(--text-neutral-450)] border border-[var(--border-primary)] rounded px-1.5 py-0.5 text-[10px] inline-flex items-center',
  },
  'Low': {
    label: 'Low',
    className: 'bg-transparent text-[var(--text-neutral-450)] border border-[var(--border-primary)] rounded px-1.5 py-0.5 text-[10px] inline-flex items-center',
  },
};

const emptyOrder: Partial<Order> = {
  orderNumber: '', customerName: '', product: '', quantity: 0,
  status: 'Pending', priority: 'Medium', deadline: '', assignedTo: '', notes: '', unitPrice: 0
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState<Partial<Order>>(emptyOrder);
  const [isEditing, setIsEditing] = useState(false);

  const filtered = orders.filter(o => {
    const matchSearch = search === '' ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || o.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const openNew = () => {
    setEditOrder({ ...emptyOrder, orderNumber: `ORD-2026-${String(orders.length + 1).padStart(3, '0')}` });
    setIsEditing(false);
    setShowForm(true);
  };

  const openEdit = (o: Order) => {
    setEditOrder({ ...o });
    setIsEditing(true);
    setShowForm(true);
  };

  const saveOrder = () => {
    if (!editOrder.customerName || !editOrder.product) return;
    if (isEditing) {
      setOrders(prev => prev.map(o => o.id === editOrder.id ? { ...o, ...editOrder } as Order : o));
    } else {
      const newOrder: Order = {
        ...editOrder as Order,
        id: `o${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        totalValue: (editOrder.quantity || 0) * (editOrder.unitPrice || 0),
      };
      setOrders(prev => [newOrder, ...prev]);
    }
    setShowForm(false);
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    if (selectedOrder?.id === id) setSelectedOrder(null);
  };

  const stats = {
    total: orders.length,
    active: orders.filter(o => o.status === 'In Progress').length,
    pending: orders.filter(o => o.status === 'Pending').length,
    completed: orders.filter(o => o.status === 'Completed').length,
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const cardStats = [
    { label: 'Total Orders', value: stats.total, icon: ShoppingCart, change: '+3 Today', time: 'Updated just now' },
    { label: 'In Progress', value: stats.active, icon: Clock, change: 'Running', time: 'Updated 5m ago' },
    { label: 'Pending', value: stats.pending, icon: AlertCircle, change: 'Requires review', time: '1 high priority' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, change: '+5 Completed', time: 'Updated just now' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">Order Management</h2>
          <p className="text-[var(--text-neutral-450)] text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-xs px-4 py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer border border-[var(--border-primary)]">
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {cardStats.map(s => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-250 cursor-pointer">
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

      {/* Filters */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-neutral-450)]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders, customers, products..."
            className="w-full h-10 bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-neutral-450)] rounded-lg pl-10 pr-4 text-[14px] focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
        </div>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="h-10 bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[var(--text-primary)] transition-all duration-200 hover:border-[var(--text-neutral-405)] cursor-pointer">
            <option value="All">All Status</option>
            {['Pending', 'In Progress', 'QC Review', 'Completed', 'On Hold', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="h-10 bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[var(--text-primary)] transition-all duration-200 hover:border-[var(--text-neutral-405)] cursor-pointer">
            <option value="All">All Priority</option>
            {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-left">
        <div className="overflow-x-auto relative">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--bg-input)] border-b border-[var(--border-primary)] sticky top-0 z-10">
              <tr className="text-[var(--text-neutral-450)] text-[13px] font-medium uppercase tracking-wider font-sans">
                {['Order #', 'Customer', 'Product', 'Qty', 'Value', 'Status', 'Priority', 'Deadline', 'Assigned', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3.5 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)] text-[14px]">
              {filtered.map(order => {
                const statusBadge = STATUS_BADGES[order.status];
                const priorityBadge = PRIORITY_BADGES[order.priority];
                return (
                  <tr key={order.id} className="hover:bg-[var(--table-row-hover)] transition-colors duration-150 group">
                    <td className="px-4 py-4.5 text-[var(--text-primary)] font-bold">{order.orderNumber}</td>
                    <td className="px-4 py-4.5 text-[var(--text-primary)]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[var(--hover-bg)] border border-[var(--border-primary)] flex items-center justify-center text-[11px] font-bold text-[var(--text-neutral-450)] flex-shrink-0 select-none">
                          {getInitials(order.customerName)}
                        </div>
                        <span className="font-medium">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4.5 text-[var(--text-primary)] max-w-[140px] truncate">{order.product}</td>
                    <td className="px-4 py-4.5 text-[var(--text-primary)]">{order.quantity.toLocaleString()}</td>
                    <td className="px-4 py-4.5 text-[var(--text-primary)]">₹{order.totalValue.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4.5">
                      <span className={`inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-full border transition-all duration-200 ${statusBadge.className}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-4.5">
                      <span className={priorityBadge.className}>
                        {priorityBadge.icon}
                        {priorityBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-4.5 text-[var(--text-neutral-450)]">{order.deadline}</td>
                    <td className="px-4 py-4.5 text-[var(--text-neutral-450)] max-w-[120px] truncate">{order.assignedTo}</td>
                    <td className="px-4 py-4.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedOrder(order)} 
                          title="View Details"
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(order)} 
                          title="Edit Order"
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteOrder(order.id)} 
                          title="Delete Order"
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="text-center text-[var(--text-neutral-450)] py-12">No orders found matching your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <div>
                <h3 className="text-[var(--text-primary)] font-bold text-lg">{selectedOrder.orderNumber}</h3>
                <p className="text-[var(--text-neutral-450)] text-xs mt-0.5">{selectedOrder.product}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} 
                className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Customer', value: selectedOrder.customerName },
                  { label: 'Status', value: selectedOrder.status },
                  { label: 'Quantity', value: selectedOrder.quantity.toLocaleString() },
                  { label: 'Unit Price', value: `₹${selectedOrder.unitPrice.toLocaleString('en-IN')}` },
                  { label: 'Total Value', value: `₹${selectedOrder.totalValue.toLocaleString('en-IN')}` },
                  { label: 'Deadline', value: selectedOrder.deadline },
                  { label: 'Priority', value: selectedOrder.priority },
                  { label: 'Assigned To', value: selectedOrder.assignedTo },
                  { label: 'Created', value: selectedOrder.createdAt },
                ].map(f => (
                  <div key={f.label}>
                    <div className="text-[var(--text-neutral-450)] text-[10px] uppercase tracking-wider font-bold mb-0.5">{f.label}</div>
                    <div className="text-[var(--text-primary)] text-sm font-semibold">{f.value}</div>
                  </div>
                ))}
              </div>
              {selectedOrder.notes && (
                <div>
                  <div className="text-[var(--text-neutral-450)] text-[10px] uppercase tracking-wider font-bold mb-1">Notes</div>
                  <div className="text-[var(--text-primary)] text-xs bg-[var(--bg-input)] rounded-lg p-3 border border-[var(--border-primary)] leading-relaxed">{selectedOrder.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <h3 className="text-[var(--text-primary)] font-bold text-lg">{isEditing ? 'Edit Order' : 'New Order'}</h3>
              <button onClick={() => setShowForm(false)} 
                className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Order Number</label>
                  <input value={editOrder.orderNumber || ''} onChange={e => setEditOrder(p => ({ ...p, orderNumber: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Customer Name*</label>
                  <input value={editOrder.customerName || ''} onChange={e => setEditOrder(p => ({ ...p, customerName: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Product*</label>
                  <input value={editOrder.product || ''} onChange={e => setEditOrder(p => ({ ...p, product: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Quantity</label>
                  <input type="number" value={editOrder.quantity || ''} onChange={e => setEditOrder(p => ({ ...p, quantity: +e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Unit Price (₹)</label>
                  <input type="number" value={editOrder.unitPrice || ''} onChange={e => setEditOrder(p => ({ ...p, unitPrice: +e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Status</label>
                  <select value={editOrder.status || 'Pending'} onChange={e => setEditOrder(p => ({ ...p, status: e.target.value as OrderStatus }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 cursor-pointer">
                    {['Pending', 'In Progress', 'QC Review', 'Completed', 'On Hold', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Priority</label>
                  <select value={editOrder.priority || 'Medium'} onChange={e => setEditOrder(p => ({ ...p, priority: e.target.value as Priority }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 cursor-pointer">
                    {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Deadline</label>
                  <input type="date" value={editOrder.deadline || ''} onChange={e => setEditOrder(p => ({ ...p, deadline: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Assigned To</label>
                  <input value={editOrder.assignedTo || ''} onChange={e => setEditOrder(p => ({ ...p, assignedTo: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Notes</label>
                  <textarea value={editOrder.notes || ''} onChange={e => setEditOrder(p => ({ ...p, notes: e.target.value }))} rows={3}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 resize-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 bg-transparent border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-lg py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer">Cancel</button>
                <button onClick={saveOrder} className="flex-1 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-xs rounded-lg py-2.5 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  {isEditing ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
