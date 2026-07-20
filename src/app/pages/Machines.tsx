import { useState } from 'react';
import { machines as initialMachines, Machine, MachineStatus } from '../data/mockData';
import { Cpu, AlertTriangle, CheckCircle, PauseCircle, Wrench, Edit, X, Zap, Activity } from 'lucide-react';

const STATUS_ICONS: Record<MachineStatus, React.ElementType> = {
  Running: CheckCircle, Idle: PauseCircle, Maintenance: Wrench, Breakdown: AlertTriangle
};

const MACHINE_TYPES = ['All', 'Sewing', 'Cutting', 'Overlock', 'Embroidery', 'Heat Press', 'Washing', 'Button Attach', 'Steam Press', 'Screen Printing'];

function daysUntilMaintenance(nextDate: string) {
  const diff = new Date(nextDate).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function StatusBadge({ status }: { status: MachineStatus }) {
  const isRunning = status === 'Running';
  const isBreakdown = status === 'Breakdown';
  const StatusIcon = STATUS_ICONS[status];
  return (
    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
      isRunning ? 'bg-[var(--hover-bg)] border-[var(--border-primary)] text-[var(--text-primary)] font-semibold'
      : isBreakdown ? 'bg-[var(--hover-bg)] border-[var(--border-primary)] text-[var(--text-primary)] font-bold line-through'
      : 'bg-[var(--hover-bg)] border-[var(--border-primary)] text-[var(--text-neutral-450)]'
    }`}>
      <StatusIcon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [selected, setSelected] = useState<Machine | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editMachine, setEditMachine] = useState<Partial<Machine>>({});

  const filtered = machines.filter(m =>
    (typeFilter === 'All' || m.type === typeFilter) &&
    (statusFilter === 'All' || m.status === statusFilter)
  );

  const stats = {
    running: machines.filter(m => m.status === 'Running').length,
    idle: machines.filter(m => m.status === 'Idle').length,
    maintenance: machines.filter(m => m.status === 'Maintenance').length,
    breakdown: machines.filter(m => m.status === 'Breakdown').length,
    avgEfficiency: Math.round(machines.filter(m => m.status === 'Running').reduce((s, m) => s + m.efficiency, 0) / Math.max(machines.filter(m => m.status === 'Running').length, 1)),
    overdue: machines.filter(m => daysUntilMaintenance(m.nextMaintenance) < 0).length,
  };

  const openEdit = (m: Machine) => { setEditMachine({ ...m }); setShowEdit(true); };
  const saveMachine = () => {
    setMachines(prev => prev.map(m => m.id === editMachine.id ? { ...m, ...editMachine } as Machine : m));
    setShowEdit(false);
  };

  const scheduleMaintenance = (id: string) => {
    setMachines(prev => prev.map(m => m.id === id ? {
      ...m, status: 'Maintenance',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    } : m));
  };

  const cardStats = [
    { label: 'Running', value: stats.running, icon: CheckCircle },
    { label: 'Idle', value: stats.idle, icon: PauseCircle },
    { label: 'Maintenance', value: stats.maintenance, icon: Wrench },
    { label: 'Breakdown', value: stats.breakdown, icon: AlertTriangle },
    { label: 'Avg Efficiency', value: `${stats.avgEfficiency}%`, icon: Zap },
    { label: 'Maint. Overdue', value: stats.overdue, icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">Machine Monitoring</h2>
          <p className="text-[var(--text-neutral-450)] text-sm mt-1">{machines.length} machines · {stats.overdue} overdue for maintenance</p>
        </div>
        <div className="flex bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-primary)] text-sm">
          <button onClick={() => setView('grid')}
            className={`px-4 py-1.5 rounded-md font-medium transition-all duration-200 cursor-pointer ${
              view === 'grid' ? 'bg-[var(--card)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[var(--text-neutral-450)] hover:text-[var(--text-primary)]'
            }`}>Grid</button>
          <button onClick={() => setView('table')}
            className={`px-4 py-1.5 rounded-md font-medium transition-all duration-200 cursor-pointer ${
              view === 'table' ? 'bg-[var(--card)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[var(--text-neutral-450)] hover:text-[var(--text-primary)]'
            }`}>Table</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cardStats.map(s => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-neutral-450)] text-[12px] font-medium">{s.label}</span>
              <s.icon className="w-3.5 h-3.5 text-[var(--text-neutral-400)]" />
            </div>
            <div className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight leading-none">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Maintenance alerts */}
      {machines.filter(m => daysUntilMaintenance(m.nextMaintenance) <= 7).length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-4 text-left shadow-[var(--card-shadow)]">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-[var(--text-primary)]" />
            <span className="text-[var(--text-primary)] font-semibold text-sm">Upcoming / Overdue Maintenance</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {machines.filter(m => daysUntilMaintenance(m.nextMaintenance) <= 7).map(m => {
              const days = daysUntilMaintenance(m.nextMaintenance);
              return (
                <span key={m.id} className={`text-[11px] px-2.5 py-1 rounded-full border cursor-pointer transition-all duration-150 ${
                  days < 0 ? 'bg-[var(--hover-bg)] text-[var(--text-primary)] border-[var(--border-primary)] font-semibold' : 'bg-[var(--hover-bg)] text-[var(--text-neutral-450)] border-[var(--border-primary)]'
                }`}
                  onClick={() => setSelected(m)}>
                  {m.name} — {days < 0 ? `${Math.abs(days)}d overdue` : `in ${days}d`}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="h-9 bg-[var(--card)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[13px] focus:outline-none focus:border-[var(--text-primary)] cursor-pointer transition-all duration-200">
          {MACHINE_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-9 bg-[var(--card)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[13px] focus:outline-none focus:border-[var(--text-primary)] cursor-pointer transition-all duration-200">
          <option value="All">All Status</option>
          {['Running', 'Idle', 'Maintenance', 'Breakdown'].map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="ml-auto text-[var(--text-neutral-450)] text-[13px]">{filtered.length} machines</span>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 text-left">
          {filtered.map(m => {
            const days = daysUntilMaintenance(m.nextMaintenance);
            const isOverdue = days < 0;
            return (
              <div key={m.id} onClick={() => setSelected(m)}
                className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[var(--text-neutral-400)]" />
                    <div>
                      <div className="text-[var(--text-primary)] font-semibold text-sm">{m.name}</div>
                      <div className="text-[var(--text-neutral-450)] text-[11px] mt-0.5">{m.type} · {m.location}</div>
                    </div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
                {m.status === 'Running' && (
                  <div className="mb-3">
                    <div className="flex justify-between mb-1.5 text-[11px]">
                      <span className="text-[var(--text-neutral-450)] font-medium">Efficiency</span>
                      <span className="text-[var(--text-primary)] font-semibold">{m.efficiency}%</span>
                    </div>
                    <div className="bg-[var(--hover-bg)] border border-[var(--border-primary)] rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-[var(--text-neutral-400)]" style={{ width: `${m.efficiency}%` }} />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-[13px] mb-3">
                  <div>
                    <span className="text-[var(--text-neutral-450)] text-[11px]">Operator</span>
                    <div className="text-[var(--text-primary)] font-medium">{m.operator}</div>
                  </div>
                  <div>
                    <span className="text-[var(--text-neutral-450)] text-[11px]">Op. Hours</span>
                    <div className="text-[var(--text-primary)] font-medium">{m.operatingHours.toLocaleString()}h</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[var(--text-neutral-450)] text-[11px]">Next Maintenance</span>
                    <div className={`font-medium ${isOverdue ? 'text-[var(--text-primary)] font-bold' : days <= 7 ? 'text-[var(--text-primary)]' : 'text-[var(--text-neutral-450)]'}`}>
                      {m.nextMaintenance} {isOverdue ? `(${Math.abs(days)}d overdue)` : days <= 7 ? `(in ${days}d)` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={e => { e.stopPropagation(); openEdit(m); }}
                    className="flex-1 text-[12px] bg-[var(--hover-bg)] border border-[var(--border-primary)] hover:bg-[var(--bg-input)] text-[var(--text-primary)] rounded-lg py-2 transition-all duration-200 cursor-pointer font-medium">Edit</button>
                  {m.status !== 'Maintenance' && (
                    <button onClick={e => { e.stopPropagation(); scheduleMaintenance(m.id); }}
                      className="flex-1 text-[12px] bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-[var(--background)] border border-[var(--border-primary)] font-bold rounded-lg py-2 transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                      Schedule Maint.
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl overflow-hidden text-left shadow-[var(--card-shadow)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[var(--bg-input)] border-b border-[var(--border-primary)] sticky top-0 z-10">
                <tr className="text-[var(--text-neutral-450)] text-[13px] font-medium">
                  {['Machine', 'Type', 'Status', 'Efficiency', 'Op. Hours', 'Operator', 'Location', 'Last Maint.', 'Next Maint.', 'Actions'].map(h => (
                    <th key={h} className="font-medium px-4 py-3.5 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)] text-[14px]">
                {filtered.map(m => {
                  const days = daysUntilMaintenance(m.nextMaintenance);
                  return (
                    <tr key={m.id} className="hover:bg-[var(--hover-bg)] transition-colors duration-150">
                      <td className="px-4 py-4">
                        <div className="text-[var(--text-primary)] font-semibold">{m.name}</div>
                        <div className="text-[var(--text-neutral-450)] text-[12px] font-mono mt-0.5">{m.model}</div>
                      </td>
                      <td className="px-4 py-4 text-[var(--text-neutral-450)]">{m.type}</td>
                      <td className="px-4 py-4"><StatusBadge status={m.status} /></td>
                      <td className="px-4 py-4">
                        {m.status === 'Running' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[var(--hover-bg)] border border-[var(--border-primary)] rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-[var(--text-neutral-400)]" style={{ width: `${m.efficiency}%` }} />
                            </div>
                            <span className="text-[var(--text-primary)] text-[13px] font-medium">{m.efficiency}%</span>
                          </div>
                        ) : <span className="text-[var(--text-neutral-450)] text-[13px]">N/A</span>}
                      </td>
                      <td className="px-4 py-4 text-[var(--text-primary)]">{m.operatingHours.toLocaleString()}h</td>
                      <td className="px-4 py-4 text-[var(--text-neutral-450)]">{m.operator}</td>
                      <td className="px-4 py-4 text-[var(--text-neutral-450)] max-w-[120px] truncate">{m.location}</td>
                      <td className="px-4 py-4 text-[var(--text-neutral-450)]">{m.lastMaintenance}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[13px] font-medium ${days < 0 ? 'text-[var(--text-primary)] font-bold' : days <= 7 ? 'text-[var(--text-primary)]' : 'text-[var(--text-neutral-450)]'}`}>
                          {m.nextMaintenance}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(m)} className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => scheduleMaintenance(m.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><Wrench className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <h3 className="text-[var(--text-primary)] font-bold text-lg">Edit Machine</h3>
              <button onClick={() => setShowEdit(false)} className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer transition-all duration-200"><X className="w-4.5 h-4.5" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Machine Name', key: 'name', col: 2 },
                { label: 'Operator', key: 'operator', col: 1 },
                { label: 'Location', key: 'location', col: 1 },
                { label: 'Efficiency (%)', key: 'efficiency', type: 'number', col: 1 },
                { label: 'Operating Hours', key: 'operatingHours', type: 'number', col: 1 },
                { label: 'Last Maintenance', key: 'lastMaintenance', type: 'date', col: 1 },
                { label: 'Next Maintenance', key: 'nextMaintenance', type: 'date', col: 1 },
              ].map((f: any) => (
                <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">{f.label}</label>
                  <input type={f.type || 'text'} value={(editMachine as any)[f.key] || ''}
                    onChange={e => setEditMachine(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
              ))}
              <div>
                <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">Status</label>
                <select value={editMachine.status || 'Running'} onChange={e => setEditMachine(p => ({ ...p, status: e.target.value as MachineStatus }))}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 cursor-pointer">
                  {['Running', 'Idle', 'Maintenance', 'Breakdown'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowEdit(false)} className="flex-1 bg-transparent border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer">Cancel</button>
              <button onClick={saveMachine} className="flex-1 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-sm rounded-lg py-2.5 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
