import { useState, useRef, useEffect } from 'react';
import { shipments as initialShipments, orders as mockOrders, Shipment, ShipmentStatus } from '../data/mockData';
import { Plus, Search, MapPin, Calendar, Truck, Package, CheckCircle, RotateCcw, X, Edit, Eye, Navigation, ChevronRight, Info } from 'lucide-react';

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  'Preparing': 'bg-[var(--hover-bg)] text-[var(--text-neutral-450)] border-[var(--border-primary)]',
  'Dispatched': 'bg-[var(--hover-bg)] text-[var(--text-primary)] border-[var(--border-primary)]',
  'In Transit': 'bg-[var(--hover-bg)] text-[var(--text-primary)] border-[var(--border-primary)]',
  'Delivered': 'bg-[var(--card)] text-[var(--text-primary)] font-semibold border-[var(--border-primary)] shadow-sm',
  'Returned': 'line-through bg-[var(--hover-bg)] text-[var(--text-neutral-450)] border-[var(--border-primary)]',
};

const CARRIERS = ['DHL Express', 'FedEx', 'UPS', 'Blue Dart', 'Aramex', 'TNT', 'USPS', 'DPD'];

interface RouteInfo {
  code: string;
  name: string;
  distance: number;
}

const ROUTE_MAP: Record<string, RouteInfo> = {
  'Chennai, Tamil Nadu': { code: 'MAA', name: 'Chennai International', distance: 0 },
  'Coimbatore, Tamil Nadu': { code: 'CJB', name: 'Coimbatore Airport', distance: 510 },
  'Salem, Tamil Nadu': { code: 'SXV', name: 'Salem Airport', distance: 340 },
  'Tirupur, Tamil Nadu': { code: 'TUP', name: 'Tirupur', distance: 490 },
  'Bangalore, Karnataka': { code: 'BLR', name: 'Kempegowda International', distance: 290 },
};

const emptyShipment: Partial<Shipment> = {
  orderNumber: '', customerName: '', destination: 'Chennai, Tamil Nadu', carrier: 'Delhivery',
  trackingNumber: '', status: 'Preparing', weight: 0, shippedDate: '', estimatedDelivery: '', notes: ''
};

// Generate points along a curved path in geographic coordinate space (curved flight routes)
export default function Shipping() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string>(initialShipments[0]?.id || '');
  const [showForm, setShowForm] = useState(false);
  const [editShipment, setEditShipment] = useState<Partial<Shipment>>(emptyShipment);
  const [isEditing, setIsEditing] = useState(false);

  const selected = shipments.find(s => s.id === selectedId) || shipments[0];

  const filtered = shipments.filter(s => {
    const matchSearch = !search ||
      s.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openNew = () => {
    setEditShipment({ ...emptyShipment, trackingNumber: `TRK-${Date.now()}` });
    setIsEditing(false);
    setShowForm(true);
  };

  const openEdit = (e: React.MouseEvent, s: Shipment) => {
    e.stopPropagation();
    setEditShipment({ ...s });
    setIsEditing(true);
    setShowForm(true);
  };

  const saveShipment = () => {
    if (!editShipment.orderNumber) return;
    if (isEditing) {
      setShipments(prev => prev.map(s => s.id === editShipment.id ? { ...s, ...editShipment } as Shipment : s));
    } else {
      const newShip: Shipment = {
        ...editShipment as Shipment,
        id: `sh${Date.now()}`,
        orderId: `o${Date.now()}`,
        customerId: 'c1',
        actualDelivery: ''
      };
      setShipments(prev => [newShip, ...prev]);
      setSelectedId(newShip.id);
    }
    setShowForm(false);
  };

  const advanceStatus = (id: string) => {
    const order: ShipmentStatus[] = ['Preparing', 'Dispatched', 'In Transit', 'Delivered'];
    setShipments(prev => prev.map(s => {
      if (s.id !== id) return s;
      const idx = order.indexOf(s.status);
      if (idx < order.length - 1) {
        const newStatus = order[idx + 1];
        return {
          ...s,
          status: newStatus,
          shippedDate: s.status === 'Preparing' ? new Date().toISOString().split('T')[0] : s.shippedDate,
          actualDelivery: newStatus === 'Delivered' ? new Date().toISOString().split('T')[0] : s.actualDelivery,
        };
      }
      return s;
    }));
  };

  const destInfo = selected ? (ROUTE_MAP[selected.destination] || ROUTE_MAP['New York, USA']) : ROUTE_MAP['New York, USA'];

  let statusText = 'Preparing in Factory';
  if (selected) {
    if (selected.status === 'Dispatched') {
      statusText = 'Dispatched from Hub';
    } else if (selected.status === 'In Transit') {
      statusText = 'In Air Transit';
    } else if (selected.status === 'Delivered') {
      statusText = 'Delivered to Destination';
    } else if (selected.status === 'Returned') {
      statusText = 'Returning to Warehouse';
    }
  }

  // Google Maps Satellite View updates dynamically based on selection

  const shipmentOrder = selected ? mockOrders.find(o => o.orderNumber === selected.orderNumber) : null;
  const goodsList = shipmentOrder ? [
    { name: shipmentOrder.product, qty: shipmentOrder.quantity, value: shipmentOrder.totalValue, unitPrice: shipmentOrder.unitPrice }
  ] : [
    { name: 'Garment Box Set (Assorted)', qty: 850, value: 12750, unitPrice: 15 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">Shipping & Dispatch</h2>
          <p className="text-[var(--text-neutral-450)] text-sm mt-1">{shipments.length} active shipments</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-xs px-4 py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer border border-[var(--border-primary)]">
          <Plus className="w-4 h-4" /> New Shipment
        </button>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-left items-start">
        
        {/* Left Column: Tickets */}
        <div className="xl:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-neutral-450)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracking, orders..."
              className="h-10 w-full bg-[var(--card)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-neutral-450)] rounded-xl pl-10 pr-4 text-[14px] focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[680px] pr-1.5 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-800 scrollbar-track-transparent">
            {filtered.map(s => {
              const route = ROUTE_MAP[s.destination] || ROUTE_MAP['New York, USA'];
              const isActive = s.id === selectedId;
              
              return (
                <div key={s.id} onClick={() => setSelectedId(s.id)}
                  className={`relative cursor-pointer rounded-xl p-4 border transition-all duration-250 group ${
                    isActive 
                      ? 'bg-[var(--hover-bg)] border-[var(--foreground)] shadow-[0_2px_8px_rgba(0,0,0,0.07)]' 
                      : 'bg-[var(--card)] border-[var(--border-primary)] hover:border-[var(--text-neutral-405)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.06)]'
                  }`}>
                  <div className="flex justify-between items-center text-[10px] text-[var(--text-neutral-450)] font-semibold uppercase tracking-wider mb-2.5">
                    <span>{s.carrier}</span>
                    <span className="font-mono text-[9px]">#{s.trackingNumber}</span>
                  </div>

                  {/* Route Boarding Pass Style (BOM -> JFK) */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="text-left">
                      <div className="text-[var(--text-primary)] text-lg font-black tracking-tight">BOM</div>
                      <div className="text-[10px] text-[var(--text-neutral-450)] mt-0.5">Chennai, IND</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-4 relative">
                      <div className="text-[9px] text-[var(--text-neutral-450)] font-bold uppercase tracking-widest leading-none mb-1">{s.status}</div>
                      <div className="w-full h-[1px] bg-[var(--border-primary)] relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--text-neutral-450)]" />
                      </div>
                      <Navigation className="w-3.5 h-3.5 text-[var(--text-primary)] rotate-90 mt-1" />
                    </div>

                    <div className="text-right">
                      <div className="text-[var(--text-primary)] text-lg font-black tracking-tight">{route.code}</div>
                      <div className="text-[10px] text-[var(--text-neutral-450)] mt-0.5 truncate max-w-[80px]">{s.destination.split(',')[0]}</div>
                    </div>
                  </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[var(--border-primary)] text-xs">
                      <div className="text-left">
                        <div className="text-[var(--text-neutral-450)] text-[9px] uppercase font-semibold tracking-wider">Order No</div>
                        <div className="text-[var(--text-primary)] font-semibold mt-0.5">{s.orderNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[var(--text-neutral-450)] text-[9px] uppercase font-semibold tracking-wider">Weight / Date</div>
                        <div className="text-[var(--text-primary)] font-medium mt-0.5">
                          {s.weight} kg · {s.shippedDate || 'Pending'}
                        </div>
                      </div>
                    </div>

                  <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => openEdit(e, s)} className="p-1 rounded bg-[var(--hover-bg)] border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"><Edit className="w-3 h-3" /></button>
                  </div>
                </div>
              );
            })}
            
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[var(--text-neutral-450)] bg-[var(--card)] border border-[var(--border-primary)] rounded-xl">No shipments found.</div>
            )}
          </div>
        </div>

        {/* Right Column: Globe Map & Details */}
        {selected ? (
          <div className="xl:col-span-8 space-y-6">
            
            {/* 3D WebGL Globe Visualizer Card */}
            <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 z-10 relative">
                <div>
                  <h3 className="text-[var(--text-primary)] text-sm font-bold tracking-tight">Live Shipment Tracking</h3>
                  <p className="text-[var(--text-neutral-450)] text-[11px] font-medium mt-0.5">{selected.orderNumber} · {selected.carrier}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-primary)] font-semibold">
                    {statusText}
                  </span>
                </div>
              </div>

              {/* Dynamic WebGL Globe Container */}
              {(() => {
                const isReturned = selected.status === 'Returned';
                const startCode = isReturned ? destInfo.code : 'BOM';
                const endCode = isReturned ? 'BOM' : destInfo.code;
                return (
                  <div className="bg-[var(--card)] rounded-xl border border-[var(--border-primary)] relative overflow-hidden mt-3 shadow-inner">
                    {/* Visual Route Header */}
                    <div className="bg-[var(--hover-bg)] border-b border-[var(--border-primary)] px-4 py-2.5 flex items-center justify-between text-[11px] font-bold z-10 relative">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-primary)] bg-[var(--hover-bg)] border border-[var(--border-primary)] px-1.5 py-0.5 rounded text-[10px]">{startCode}</span>
                        <span className="text-[var(--text-neutral-450)]">{isReturned ? '←' : '→'}</span>
                        <span className="text-[var(--text-primary)] bg-[var(--hover-bg)] border border-[var(--border-primary)] px-1.5 py-0.5 rounded text-[10px]">{endCode}</span>
                        <span className="text-[var(--text-neutral-450)] font-normal">
                          {isReturned ? `Returning from ${selected.destination} to Chennai Factory` : `Factory to ${selected.destination}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--text-neutral-450)] font-normal">
                        <span className="text-[var(--text-primary)] font-bold">{selected.carrier}</span>
                        <span className="text-[var(--text-neutral-450)]">|</span>
                        <span>{statusText}</span>
                      </div>
                    </div>

                    {/* Google Maps */}
                    {(() => {
                      const factoryAddress = 'Guindy, Chennai, Tamil Nadu, India';
                      const destAddress = selected.destination === 'Chennai, Tamil Nadu' ? 'Chennai International Airport, India' : selected.destination;
                      const saddr = isReturned ? destAddress : factoryAddress;
                      const daddr = isReturned ? factoryAddress : destAddress;
                      
                      return (
                        <div className="h-[360px] relative w-full rounded-b-xl z-0 overflow-hidden bg-[var(--hover-bg)]">
                          <iframe
                            title="Google Maps"
                            src={`https://maps.google.com/maps?saddr=${encodeURIComponent(saddr)}&daddr=${encodeURIComponent(daddr)}&t=m&z=${selected.destination.includes('Chennai') ? 11 : 5}&output=embed`}
                            className="w-full h-full border-none rounded-b-xl grayscale contrast-125 dark:invert dark:hue-rotate-180 opacity-90 hover:opacity-100 transition-opacity duration-300"
                            loading="lazy"
                          />
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}
            </div>

            {/* Bottom Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Goods Details */}
              <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div>
                  <h4 className="text-[var(--text-primary)] text-sm font-semibold mb-4">Shipped Goods List</h4>
                  <div className="space-y-4">
                    {goodsList.map((g, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-[var(--border-primary)] pb-3">
                        <div>
                          <div className="text-[var(--text-primary)] text-sm font-bold leading-tight">{g.name}</div>
                          <div className="text-[var(--text-neutral-450)] text-[10px] mt-0.5 font-semibold">{g.qty.toLocaleString()} units · ₹{g.unitPrice.toLocaleString('en-IN')}/unit</div>
                        </div>
                        <div className="text-right text-[var(--text-primary)] font-black text-sm">
                          ₹{g.value.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                  <div className="bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl p-3.5 flex items-start gap-2.5 mt-4">
                    <Info className="w-4 h-4 text-[var(--text-neutral-400)] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[var(--text-primary)] text-[11px] font-semibold uppercase block tracking-wider">Cargo Notes</span>
                      <span className="text-[var(--text-neutral-450)] text-[12px] leading-relaxed block mt-0.5">{selected.notes || 'None'}</span>
                    </div>
                  </div>
              </div>

              {/* Status Checklist */}
              <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div>
                  <h4 className="text-[var(--text-primary)] text-sm font-semibold mb-4">Carrier Milestones</h4>
                  <div className="space-y-3.5">
                    {[
                      { step: 'Preparing', done: true, desc: 'Package wrapped & labeled' },
                      { step: 'Dispatched', done: ['Dispatched', 'In Transit', 'Delivered'].includes(selected.status), desc: 'Released from Factory Warehouse' },
                      { step: 'In Transit', done: ['In Transit', 'Delivered'].includes(selected.status), desc: 'In flight route transit' },
                      { step: 'Delivered', done: selected.status === 'Delivered', desc: 'Arrived & customs cleared' },
                    ].map((m, idx) => (
                      <div key={idx} className="flex gap-3 items-start text-xs text-left">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] border flex-shrink-0 ${
                          m.done 
                            ? 'bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)]' 
                            : 'bg-[var(--hover-bg)] border-[var(--border-primary)] text-[var(--text-neutral-450)]'
                        }`}>
                          {m.done ? '✓' : idx + 1}
                        </div>
                        <div>
                          <div className={`font-bold leading-none ${m.done ? 'text-[var(--text-primary)]' : 'text-[var(--text-neutral-450)]'}`}>{m.step}</div>
                          <div className="text-[var(--text-neutral-450)] text-[10px] mt-1 leading-normal font-medium">{m.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-primary)]">
                  {!['Delivered', 'Returned'].includes(selected.status) ? (
                    <button 
                      onClick={() => advanceStatus(selected.id)}
                      className="w-full bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-[var(--background)] font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm border border-[var(--border-primary)]"
                    >
                      Advance Shipping Stage
                    </button>
                  ) : (
                    <div className="text-center text-xs text-[var(--text-neutral-450)] font-bold uppercase tracking-wider py-2">
                      Shipment Completed
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="xl:col-span-8 bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-12 text-center text-[var(--text-neutral-450)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            Select a shipment cargo card to track details.
          </div>
        )}

      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <h3 className="text-[var(--text-primary)] font-bold text-lg">{isEditing ? 'Edit Shipment' : 'New Shipment'}</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer transition-all duration-200"><X className="w-4.5 h-4.5" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Order Number*', key: 'orderNumber', col: 1 },
                { label: 'Customer Name', key: 'customerName', col: 1 },
                { label: 'Destination', key: 'destination', col: 2 },
                { label: 'Tracking Number', key: 'trackingNumber', col: 1 },
                { label: 'Weight (kg)', key: 'weight', type: 'number', col: 1 },
                { label: 'Shipped Date', key: 'shippedDate', type: 'date', col: 1 },
                { label: 'Est. Delivery', key: 'estimatedDelivery', type: 'date', col: 1 },
              ].map((f: any) => (
                <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-neutral-400 text-xs font-semibold mb-1">{f.label}</label>
                  <input type={f.type || 'text'} value={(editShipment as any)[f.key] || ''}
                    onChange={e => setEditShipment(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
              ))}
              <div>
                <label className="block text-neutral-400 text-xs font-semibold mb-1">Carrier</label>
                <select value={editShipment.carrier || 'DHL Express'} onChange={e => setEditShipment(p => ({ ...p, carrier: e.target.value }))}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 cursor-pointer">
                  {CARRIERS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Status</label>
                <select value={editShipment.status || 'Preparing'} onChange={e => setEditShipment(p => ({ ...p, status: e.target.value as ShipmentStatus }))}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 cursor-pointer">
                  {['Preparing', 'Dispatched', 'In Transit', 'Delivered', 'Returned'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Notes</label>
                <textarea value={editShipment.notes || ''} onChange={e => setEditShipment(p => ({ ...p, notes: e.target.value }))} rows={2}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 resize-none" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-transparent border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer">Cancel</button>
              <button onClick={saveShipment} className="flex-1 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-sm rounded-lg py-2.5 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                {isEditing ? 'Update' : 'Create Shipment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
