import { useState } from 'react';
import { qcRecords as initialRecords, QCRecord } from '../data/mockData';
import { Plus, Search, Shield, AlertTriangle, CheckCircle, Eye, Edit, X, ClipboardList, XCircle } from 'lucide-react';

const DEFECT_TYPES = [
  'Minor Stitching', 'Logo Alignment', 'Color Variation', 'Fabric Pilling',
  'Elastic Defect', 'Seam Puckering', 'Button Placement', 'Size Variance',
  'Fabric Tear', 'Print Smear', 'Thread Pull', 'Zipper Defect'
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Passed': 'border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-primary)] font-semibold',
    'Failed': 'border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-primary)]',
    'Under Review': 'border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-neutral-450)]',
    'Rework Required': 'border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-primary)]',
  };
  const icons: Record<string, string> = {
    'Passed': '✓', 'Failed': '✕', 'Under Review': '◐', 'Rework Required': '↺'
  };
  return (
    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${map[status] || map['Under Review']}`}>
      <span className="font-mono text-[10px]">{icons[status]}</span>
      {status}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    'Low': 'text-[var(--text-neutral-450)] font-normal',
    'Medium': 'text-[var(--text-primary)] font-medium',
    'High': 'text-[var(--text-primary)] font-bold',
    'Critical': 'text-[var(--text-primary)] font-extrabold underline decoration-double',
  };
  const icons: Record<string, string> = {
    'Low': '▽', 'Medium': '◇', 'High': '▲', 'Critical': '⬆'
  };
  return (
    <span className={`text-[11px] inline-flex items-center gap-0.5 ${map[severity] || map['Low']}`}>
      <span className="font-mono text-[10px]">{icons[severity]}</span>
      {severity}
    </span>
  );
}

export default function QualityControl() {
  const [records, setRecords] = useState<QCRecord[]>(initialRecords);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<QCRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState<Partial<QCRecord>>({});
  const [isEditing, setIsEditing] = useState(false);

  const filtered = records.filter(r => {
    const matchSearch = !search ||
      r.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.inspector.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: records.length,
    passed: records.filter(r => r.status === 'Passed').length,
    failed: records.filter(r => r.status === 'Failed').length,
    pending: records.filter(r => ['Under Review', 'Rework Required'].includes(r.status)).length,
    passRate: Math.round((records.filter(r => r.status === 'Passed').length / records.length) * 100),
    totalDefects: records.reduce((s, r) => s + r.defectsFound, 0),
  };

  const openNew = () => {
    setEditRecord({
      orderNumber: '', productName: '', inspector: 'David Park', date: new Date().toISOString().split('T')[0],
      status: 'Under Review', totalInspected: 100, defectsFound: 0, defectType: 'Minor Stitching',
      severity: 'Low', notes: '', resolved: false
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const openEdit = (r: QCRecord) => { setEditRecord({ ...r }); setIsEditing(true); setShowForm(true); };

  const saveRecord = () => {
    if (!editRecord.orderNumber) return;
    if (isEditing) {
      setRecords(prev => prev.map(r => r.id === editRecord.id ? { ...r, ...editRecord } as QCRecord : r));
    } else {
      setRecords(prev => [...prev, { ...editRecord as QCRecord, id: `qc${Date.now()}`, orderId: `o${Date.now()}` }]);
    }
    setShowForm(false);
  };

  const resolveRecord = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, resolved: true, status: 'Passed' as const } : r));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, resolved: true, status: 'Passed' } : null);
  };

  const cardStats = [
    { label: 'Total Inspections', value: stats.total, icon: ClipboardList },
    { label: 'Passed', value: stats.passed, icon: CheckCircle },
    { label: 'Failed', value: stats.failed, icon: XCircle },
    { label: 'Under Review', value: stats.pending, icon: Shield },
    { label: 'Pass Rate', value: `${stats.passRate}%`, icon: Shield },
    { label: 'Total Defects', value: stats.totalDefects, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">Quality Control</h2>
          <p className="text-[var(--text-neutral-450)] text-sm mt-1">Defect tracking &amp; inspection management</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-xs px-4 py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer border border-[var(--border-primary)]">
          <Plus className="w-4 h-4" /> New Inspection
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cardStats.map(s => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-neutral-450)] text-[12px] font-medium leading-tight">{s.label}</span>
              <s.icon className="w-3.5 h-3.5 text-[var(--text-neutral-400)]" />
            </div>
            <div className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight leading-none">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Unresolved critical issues */}
      {records.filter(r => !r.resolved && ['Failed', 'Rework Required'].includes(r.status)).length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-4 text-left shadow-[var(--card-shadow)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[var(--text-primary)]" />
            <span className="text-[var(--text-primary)] font-semibold text-sm">Unresolved Quality Issues Requiring Attention</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {records.filter(r => !r.resolved && ['Failed', 'Rework Required'].includes(r.status)).map(r => (
              <span key={r.id} className="text-[11px] bg-[var(--hover-bg)] text-[var(--text-neutral-450)] px-2.5 py-1 rounded-full border border-[var(--border-primary)] cursor-pointer hover:text-[var(--text-primary)] hover:border-[var(--text-neutral-405)] transition-all duration-150"
                onClick={() => setSelected(r)}>
                {r.orderNumber} — {r.defectType} ({r.severity})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-1 bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-primary)]">
          {['All', 'Passed', 'Failed', 'Under Review', 'Rework Required'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                statusFilter === s
                  ? 'bg-[var(--card)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                  : 'text-[var(--text-neutral-450)] hover:text-[var(--text-primary)]'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <div className="ml-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-neutral-450)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="h-10 bg-[var(--card)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-neutral-450)] rounded-lg pl-10 pr-4 text-[14px] w-52 focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl overflow-hidden text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--bg-input)] border-b border-[var(--border-primary)] sticky top-0 z-10">
              <tr className="text-[var(--text-neutral-450)] text-[13px] font-medium">
                {['Order #', 'Product', 'Inspector', 'Date', 'Inspected', 'Defects', 'Defect Rate', 'Defect Type', 'Severity', 'Status', 'Resolved', 'Actions'].map(h => (
                  <th key={h} className="font-medium px-4 py-3.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)] text-[14px]">
              {filtered.map(r => {
                const defectRate = ((r.defectsFound / r.totalInspected) * 100).toFixed(1);
                return (
                  <tr key={r.id} className="hover:bg-[var(--hover-bg)] transition-colors duration-150">
                    <td className="px-4 py-4 text-[var(--text-primary)] font-semibold">{r.orderNumber}</td>
                    <td className="px-4 py-4 text-[var(--text-neutral-450)] max-w-[140px] truncate">{r.productName}</td>
                    <td className="px-4 py-4 text-[var(--text-neutral-450)]">{r.inspector}</td>
                    <td className="px-4 py-4 text-[var(--text-neutral-450)]">{r.date}</td>
                    <td className="px-4 py-4 text-[var(--text-primary)]">{r.totalInspected}</td>
                    <td className="px-4 py-4 text-[var(--text-primary)] font-medium">{r.defectsFound}</td>
                    <td className="px-4 py-4">
                      <span className={`text-[13px] font-semibold ${+defectRate > 10 ? 'text-[var(--text-primary)] font-bold' : +defectRate > 5 ? 'text-[var(--text-primary)]' : 'text-[var(--text-neutral-450)]'}`}>
                        {defectRate}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[var(--text-neutral-450)]">{r.defectType}</td>
                    <td className="px-4 py-4"><SeverityBadge severity={r.severity} /></td>
                    <td className="px-4 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-4">
                      {r.resolved
                        ? <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-primary)] font-semibold"><CheckCircle className="w-3.5 h-3.5" /> Done</span>
                        : <span className="text-[11px] text-[var(--text-neutral-450)] font-medium uppercase tracking-wide">Pending</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(r)} className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><Edit className="w-4 h-4" /></button>
                        {!r.resolved && (
                          <button onClick={() => resolveRecord(r.id)} className="text-[11px] bg-[var(--hover-bg)] border border-[var(--border-primary)] hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)] text-[var(--text-primary)] px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-medium whitespace-nowrap">
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <div>
                <h3 className="text-[var(--text-primary)] font-bold text-lg">QC Report — {selected.orderNumber}</h3>
                <p className="text-[var(--text-neutral-450)] text-sm mt-0.5">{selected.productName}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer transition-all duration-200"><X className="w-4.5 h-4.5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Inspector', value: selected.inspector },
                  { label: 'Inspection Date', value: selected.date },
                  { label: 'Total Inspected', value: selected.totalInspected },
                  { label: 'Defects Found', value: selected.defectsFound },
                  { label: 'Defect Rate', value: `${((selected.defectsFound / selected.totalInspected) * 100).toFixed(1)}%` },
                  { label: 'Defect Type', value: selected.defectType },
                  { label: 'Severity', value: selected.severity },
                  { label: 'Status', value: selected.status },
                ].map(f => (
                  <div key={f.label}>
                    <div className="text-[var(--text-neutral-450)] text-[11px] uppercase tracking-wider font-semibold mb-1">{f.label}</div>
                    <div className="text-[var(--text-primary)] text-sm font-semibold">{f.value}</div>
                  </div>
                ))}
              </div>
              {selected.notes && (
                <div className="bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg p-3 text-[var(--text-neutral-450)] text-sm leading-relaxed">{selected.notes}</div>
              )}
              {!selected.resolved && (
                <button onClick={() => { resolveRecord(selected.id); setSelected(null); }}
                  className="w-full bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 active:scale-[0.99] text-[var(--background)] font-bold text-sm rounded-lg py-2.5 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <h3 className="text-[var(--text-primary)] font-bold text-lg">{isEditing ? 'Edit Inspection' : 'New Inspection Record'}</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer transition-all duration-200"><X className="w-4.5 h-4.5" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Order Number*', key: 'orderNumber', type: 'text', col: 1 },
                { label: 'Product Name*', key: 'productName', type: 'text', col: 1 },
                { label: 'Inspector', key: 'inspector', type: 'text', col: 1 },
                { label: 'Inspection Date', key: 'date', type: 'date', col: 1 },
                { label: 'Total Inspected', key: 'totalInspected', type: 'number', col: 1 },
                { label: 'Defects Found', key: 'defectsFound', type: 'number', col: 1 },
              ].map(f => (
                <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">{f.label}</label>
                  <input type={f.type} value={(editRecord as any)[f.key] || ''}
                    onChange={e => setEditRecord(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
              ))}
              {[
                { label: 'Defect Type', key: 'defectType', options: DEFECT_TYPES },
                { label: 'Severity', key: 'severity', options: ['Low', 'Medium', 'High', 'Critical'] },
                { label: 'Status', key: 'status', options: ['Passed', 'Failed', 'Under Review', 'Rework Required'] },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">{f.label}</label>
                  <select value={(editRecord as any)[f.key] || ''} onChange={e => setEditRecord(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 cursor-pointer">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Notes</label>
                <textarea value={editRecord.notes || ''} onChange={e => setEditRecord(p => ({ ...p, notes: e.target.value }))} rows={3}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 resize-none" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-transparent border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer">Cancel</button>
              <button onClick={saveRecord} className="flex-1 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-sm rounded-lg py-2.5 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                {isEditing ? 'Update Record' : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
