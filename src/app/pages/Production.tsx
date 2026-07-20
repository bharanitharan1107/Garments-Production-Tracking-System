import { useState } from 'react';
import { productionLines as initial, ProductionLine, ProductionStage } from '../data/mockData';
import { Factory, CheckCircle, AlertTriangle, PauseCircle, ChevronRight, Users } from 'lucide-react';

const STAGES: ProductionStage[] = ['Cutting', 'Sewing', 'Finishing', 'QC', 'Packaging'];

const STAGE_PILL: Record<ProductionStage, string> = {
  'Cutting': 'bg-[var(--hover-bg)] text-[var(--text-primary)] border-[var(--border-primary)]',
  'Sewing': 'bg-[var(--hover-bg)] text-[var(--text-primary)] border-[var(--border-primary)]',
  'Finishing': 'bg-[var(--hover-bg)] text-[var(--text-primary)] border-[var(--border-primary)]',
  'QC': 'bg-[var(--hover-bg)] text-[var(--text-primary)] border-[var(--border-primary)]',
  'Packaging': 'bg-[var(--foreground)] text-[var(--background)] border-[var(--border-primary)] font-semibold',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  Active: CheckCircle, Paused: PauseCircle, Completed: CheckCircle, Delayed: AlertTriangle
};

function ProgressBar({ value, status }: { value: number; status: string }) {
  const color = status === 'Completed' ? 'bg-[var(--foreground)]' : status === 'Delayed' ? 'bg-[var(--text-neutral-400)]' : 'bg-[var(--text-neutral-400)]';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[var(--hover-bg)] rounded-full h-1.5 border border-[var(--border-primary)]">
        <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[var(--text-neutral-450)] text-xs w-8 text-right">{value}%</span>
    </div>
  );
}

function daysLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Active': 'border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-primary)]',
    'Completed': 'border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-neutral-450)]',
    'Paused': 'border-[var(--border-primary)] bg-[var(--hover-bg)] text-[var(--text-neutral-450)]',
    'Delayed': 'border-[var(--foreground)] bg-[var(--hover-bg)] text-[var(--text-primary)] font-semibold',
  };
  return (
    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${map[status] || map['Active']}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block opacity-60" />
      {status}
    </span>
  );
}

export default function Production() {
  const [lines, setLines] = useState<ProductionLine[]>(initial);
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [stageFilter, setStageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<ProductionLine | null>(null);

  const filtered = lines.filter(l =>
    (stageFilter === 'All' || l.stage === stageFilter) &&
    (statusFilter === 'All' || l.status === statusFilter)
  );

  const advanceStage = (id: string) => {
    setLines(prev => prev.map(l => {
      if (l.id !== id) return l;
      const idx = STAGES.indexOf(l.stage);
      if (idx < STAGES.length - 1) return { ...l, stage: STAGES[idx + 1], progress: Math.min(l.progress + 15, 100) };
      return { ...l, status: 'Completed', progress: 100 };
    }));
  };

  const stats = {
    active: lines.filter(l => l.status === 'Active').length,
    delayed: lines.filter(l => l.status === 'Delayed').length,
    completed: lines.filter(l => l.status === 'Completed').length,
    paused: lines.filter(l => l.status === 'Paused').length,
  };

  const stageCount = STAGES.reduce((acc, s) => {
    acc[s] = lines.filter(l => l.stage === s).length;
    return acc;
  }, {} as Record<string, number>);

  const cardStats = [
    { label: 'Active Lines', value: stats.active, icon: Factory },
    { label: 'Delayed', value: stats.delayed, icon: AlertTriangle },
    { label: 'Completed', value: stats.completed, icon: CheckCircle },
    { label: 'Paused', value: stats.paused, icon: PauseCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">Production Tracking</h2>
          <p className="text-[var(--text-neutral-450)] text-sm mt-1">{lines.length} production lines tracked</p>
        </div>
        <div className="flex bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-primary)] text-sm">
          <button onClick={() => setView('table')}
            className={`px-4 py-1.5 rounded-md font-medium transition-all duration-200 cursor-pointer ${
              view === 'table' ? 'bg-[var(--card)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[var(--text-neutral-450)] hover:text-[var(--text-primary)]'
            }`}>
            Table
          </button>
          <button onClick={() => setView('kanban')}
            className={`px-4 py-1.5 rounded-md font-medium transition-all duration-200 cursor-pointer ${
              view === 'kanban' ? 'bg-[var(--card)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]' : 'text-[var(--text-neutral-450)] hover:text-[var(--text-primary)]'
            }`}>
            Kanban
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {cardStats.map(s => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[var(--text-neutral-450)] text-sm font-medium">{s.label}</span>
              <s.icon className="w-4.5 h-4.5 text-[var(--text-neutral-400)]" />
            </div>
            <div className="text-[36px] font-bold text-[var(--text-primary)] tracking-tight leading-none">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Stage pipeline */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left shadow-[var(--card-shadow)]">
        <h3 className="text-[var(--text-neutral-450)] text-[11px] font-semibold uppercase tracking-wider mb-4">Production Pipeline</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {STAGES.map((stage, idx) => (
            <div key={stage} className="flex items-center gap-2">
              <div className={`rounded-lg px-4 py-2.5 border text-center min-w-[90px] cursor-pointer transition-all duration-200 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06)] ${
                stageFilter === stage ? 'ring-2 ring-[var(--foreground)]' : ''
              } ${STAGE_PILL[stage]}`}
                onClick={() => setStageFilter(stageFilter === stage ? 'All' : stage)}>
                <div className="text-lg font-bold">{stageCount[stage] || 0}</div>
                <div className="text-[10px] uppercase tracking-wider font-medium mt-0.5">{stage}</div>
              </div>
              {idx < STAGES.length - 1 && <ChevronRight className="w-4 h-4 text-[var(--text-neutral-450)] flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
          className="h-9 bg-[var(--card)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[13px] focus:outline-none focus:border-[var(--text-primary)] cursor-pointer transition-all duration-200">
          <option value="All">All Stages</option>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-9 bg-[var(--card)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[13px] focus:outline-none focus:border-[var(--text-primary)] cursor-pointer transition-all duration-200">
          <option value="All">All Status</option>
          {['Active', 'Paused', 'Completed', 'Delayed'].map(s => <option key={s}>{s}</option>)}
        </select>
        <span className="ml-auto text-[var(--text-neutral-450)] text-[13px]">{filtered.length} results</span>
      </div>

      {view === 'table' ? (
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl overflow-hidden text-left shadow-[var(--card-shadow)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[var(--bg-input)] border-b border-[var(--border-primary)] sticky top-0 z-10">
                <tr className="text-[var(--text-neutral-450)] text-[13px] font-medium">
                  {['Order', 'Product', 'Stage', 'Progress', 'Target/Done', 'Deadline', 'Status', 'Workers', 'Actions'].map(h => (
                    <th key={h} className="font-medium px-4 py-3.5 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)] text-[14px]">
                {filtered.map(line => {
                  const days = daysLeft(line.endDate);
                  const StatusIcon = STATUS_ICONS[line.status];
                  return (
                    <tr key={line.id} className="hover:bg-[var(--hover-bg)] transition-colors duration-150 cursor-pointer" onClick={() => setSelected(line)}>
                      <td className="px-4 py-4 text-[var(--text-primary)] font-semibold">{line.orderNumber}</td>
                      <td className="px-4 py-4 text-[var(--text-neutral-450)] max-w-[160px] truncate">{line.product}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${STAGE_PILL[line.stage]}`}>{line.stage}</span>
                      </td>
                      <td className="px-4 py-4 min-w-[140px]"><ProgressBar value={line.progress} status={line.status} /></td>
                      <td className="px-4 py-4 text-[var(--text-neutral-450)]">{line.completedQty.toLocaleString()} / {line.targetQty.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[13px] font-medium ${days < 3 ? 'text-[var(--text-primary)] font-bold' : days < 7 ? 'text-[var(--text-primary)]' : 'text-[var(--text-neutral-450)]'}`}>
                          {line.endDate} {days > 0 ? `(${days}d)` : `(${Math.abs(days)}d overdue)`}
                        </span>
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={line.status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-[var(--text-neutral-450)] text-[13px]">
                          <Users className="w-3.5 h-3.5" />
                          <span>{line.assignedWorkers.length}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {line.status !== 'Completed' && (
                          <button onClick={e => { e.stopPropagation(); advanceStage(line.id); }}
                            className="text-[11px] bg-[var(--hover-bg)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)] px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-medium">
                            Advance
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Kanban view
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
          {STAGES.map(stage => (
            <div key={stage} className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-3 shadow-[var(--card-shadow)]">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-[var(--text-primary)] text-[11px] font-semibold uppercase tracking-wider">{stage}</span>
                <span className="ml-auto bg-[var(--hover-bg)] border border-[var(--border-primary)] text-[var(--text-neutral-450)] rounded-full px-2 py-0.5 text-[10px] font-medium">{lines.filter(l => l.stage === stage).length}</span>
              </div>
              <div className="space-y-2.5">
                {lines.filter(l => l.stage === stage).map(line => (
                  <div key={line.id} className="bg-[var(--bg-input)] border border-[var(--border-primary)] hover:border-[var(--text-neutral-405)] rounded-lg p-3 cursor-pointer transition-all duration-150 hover:shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                    onClick={() => setSelected(line)}>
                    <div className="text-[var(--text-primary)] text-xs font-semibold mb-1">{line.orderNumber}</div>
                    <div className="text-[var(--text-neutral-450)] text-[12px] mb-2 truncate">{line.product}</div>
                    <ProgressBar value={line.progress} status={line.status} />
                    <div className="mt-2.5 flex items-center justify-between">
                      <StatusBadge status={line.status} />
                      <div className="flex items-center gap-1 text-[var(--text-neutral-450)] text-xs">
                        <Users className="w-3 h-3" /> {line.assignedWorkers.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left" onClick={() => setSelected(null)}>
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <div>
                <h3 className="text-[var(--text-primary)] font-bold text-lg">{selected.orderNumber}</h3>
                <p className="text-[var(--text-neutral-450)] text-sm mt-0.5">{selected.product}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer transition-all duration-200"><span className="text-lg leading-none">✕</span></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Current Stage', value: selected.stage },
                  { label: 'Status', value: selected.status },
                  { label: 'Progress', value: `${selected.progress}%` },
                  { label: 'Machine', value: selected.machineId },
                  { label: 'Target Qty', value: selected.targetQty.toLocaleString() },
                  { label: 'Completed', value: selected.completedQty.toLocaleString() },
                  { label: 'Start Date', value: selected.startDate },
                  { label: 'Deadline', value: selected.endDate },
                ].map(f => (
                  <div key={f.label}>
                    <div className="text-[var(--text-neutral-450)] text-[11px] uppercase tracking-wider font-semibold mb-1">{f.label}</div>
                    <div className="text-[var(--text-primary)] text-sm font-semibold">{f.value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[var(--text-neutral-450)] text-[11px] uppercase tracking-wider font-semibold mb-2">Progress</div>
                <ProgressBar value={selected.progress} status={selected.status} />
              </div>
              {selected.notes && (
                <div className="bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-lg p-3 text-[var(--text-neutral-450)] text-sm leading-relaxed">{selected.notes}</div>
              )}
              {selected.status !== 'Completed' && (
                <button onClick={() => { advanceStage(selected.id); setSelected(null); }}
                  className="w-full bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 active:scale-[0.99] text-[var(--background)] font-bold text-sm rounded-lg py-2.5 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  Advance to Next Stage
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
