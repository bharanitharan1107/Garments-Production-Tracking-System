import { useState } from 'react';
import { workers as initialWorkers, Worker, Shift } from '../data/mockData';
import { Plus, Search, Edit, Trash2, X, Users, Award, TrendingUp, Clock, MoreVertical, CheckCircle2, Briefcase, Timer } from 'lucide-react';

const DEPARTMENTS = ['All', 'Sewing', 'Cutting', 'Finishing', 'Embroidery', 'Packaging', 'Quality Control'];

const emptyWorker: Partial<Worker> = {
  name: '', email: '', phone: '', department: 'Sewing', role: '',
  shift: 'Morning', status: 'On Duty', efficiency: 85, tasksCompleted: 0
};

const DEPT_GLOW: Record<string, string> = {
  Sewing: 'var(--text-neutral-400)',
  Cutting: 'var(--text-neutral-450)',
  Finishing: 'var(--text-neutral-500)',
  Embroidery: 'var(--text-neutral-550)',
  Packaging: 'var(--text-neutral-555)',
  'Quality Control': 'var(--foreground)',
};

const STATUS_STYLE: Record<string, { bg: string; dot: string; text: string }> = {
  'On Duty': { bg: 'var(--hover-bg)', dot: 'var(--foreground)', text: 'var(--text-primary)' },
  'Off Duty': { bg: 'var(--hover-bg)', dot: 'var(--text-neutral-450)', text: 'var(--text-neutral-450)' },
  'On Leave': { bg: 'var(--hover-bg)', dot: 'var(--text-neutral-500)', text: 'var(--text-neutral-500)' },
  'Absent': { bg: 'var(--hover-bg)', dot: 'var(--text-neutral-555)', text: 'var(--text-neutral-555)' },
};

const SHIFT_STYLE: Record<string, { bg: string; text: string }> = {
  'Morning': { bg: 'var(--hover-bg)', text: 'var(--text-primary)' },
  'Afternoon': { bg: 'var(--hover-bg)', text: 'var(--text-neutral-400)' },
  'Night': { bg: 'var(--hover-bg)', text: 'var(--text-neutral-555)' },
};

function effColor(e: number) {
  if (e >= 90) return { bar: 'var(--foreground)', text: 'var(--text-primary)' };
  if (e >= 80) return { bar: 'var(--text-neutral-400)', text: 'var(--text-neutral-400)' };
  if (e >= 70) return { bar: 'var(--text-neutral-500)', text: 'var(--text-neutral-500)' };
  return { bar: 'var(--text-neutral-555)', text: 'var(--text-neutral-555)' };
}

export default function Workers() {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [shiftFilter, setShiftFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editWorker, setEditWorker] = useState<Partial<Worker>>(emptyWorker);
  const [isEditing, setIsEditing] = useState(false);

  const filtered = workers.filter(w => {
    const matchSearch = !search ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      w.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || w.department === deptFilter;
    const matchShift = shiftFilter === 'All' || w.shift === shiftFilter;
    return matchSearch && matchDept && matchShift;
  });

  const stats = {
    onDuty: workers.filter(w => w.status === 'On Duty').length,
    absent: workers.filter(w => w.status === 'Absent').length,
    onLeave: workers.filter(w => w.status === 'On Leave').length,
    avgEfficiency: Math.round(workers.reduce((s, w) => s + w.efficiency, 0) / workers.length),
  };

  const openNew = () => {
    setEditWorker({ ...emptyWorker, employeeId: `EMP-${String(workers.length + 1).padStart(3, '0')}` });
    setIsEditing(false);
    setShowForm(true);
  };

  const openEdit = (w: Worker) => { setEditWorker({ ...w }); setIsEditing(true); setShowForm(true); };
  const deleteWorker = (id: string) => setWorkers(prev => prev.filter(w => w.id !== id));

  const saveWorker = () => {
    if (!editWorker.name) return;
    if (isEditing) {
      setWorkers(prev => prev.map(w => w.id === editWorker.id ? { ...w, ...editWorker } as Worker : w));
    } else {
      setWorkers(prev => [...prev, { ...editWorker as Worker, id: `w${Date.now()}`, joinDate: new Date().toISOString().split('T')[0] }]);
    }
    setShowForm(false);
  };

  const topPerformers = [...workers].sort((a, b) => b.efficiency - a.efficiency).slice(0, 5);

  const cardStats = [
    { label: 'On Duty', value: stats.onDuty, icon: Users, sub: `${workers.length} total employees` },
    { label: 'Absent Today', value: stats.absent, icon: Clock, sub: 'Unplanned absences' },
    { label: 'On Leave', value: stats.onLeave, icon: TrendingUp, sub: 'Approved leave' },
    { label: 'Avg Efficiency', value: `${stats.avgEfficiency}%`, icon: Award, sub: 'Across all workers' },
  ];

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">Worker Management</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-neutral-450)' }}>{workers.length} total employees</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-xs px-4 py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer border border-[var(--border-primary)]">
          <Plus className="w-4 h-4" /> Add Worker
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {cardStats.map(s => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--text-neutral-450)' }}>{s.label}</span>
              <s.icon className="w-4.5 h-4.5 text-[var(--text-neutral-400)]" />
            </div>
            <div className="text-[36px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-1">{s.value}</div>
            <div className="text-[12px]" style={{ color: 'var(--text-neutral-450)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 text-left">
        {/* Main content */}
        <div className="xl:col-span-3 space-y-4">
          {/* Filters */}
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-4 flex flex-wrap gap-3 shadow-[var(--card-shadow)]">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-neutral-450)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workers..."
                className="h-10 w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg pl-10 pr-4 text-[14px] focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" style={{ color: 'var(--text-primary)' }} />
              <style>{`.worker-search::placeholder { color: var(--text-neutral-450) !important; }`}</style>
            </div>
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
              className="h-10 bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[var(--text-primary)] cursor-pointer transition-all duration-200">
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}
              className="h-10 bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[var(--text-primary)] cursor-pointer transition-all duration-200">
              <option value="All">All Shifts</option>
              {['Morning', 'Afternoon', 'Night'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Worker Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(worker => {
              const ec = effColor(worker.efficiency);
              const st = STATUS_STYLE[worker.status] || STATUS_STYLE['On Duty'];
              const sh = SHIFT_STYLE[worker.shift] || SHIFT_STYLE['Morning'];
              const glow = DEPT_GLOW[worker.department] || 'rgba(107,114,128,0.1)';
              const initials = worker.name.split(' ').map(n => n[0]).join('');

              return (
                <div key={worker.id}
                  className="group relative border border-[var(--border-primary)] rounded-[22px] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5"
                  style={{ boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>

                  {/* Background gradient: top to bottom */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(180deg, var(--bg-gradient-card-from) 0%, var(--bg-gradient-card-to-1e1e24) 100%)' }} />

                  {/* Department glow */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-100 pointer-events-none transition-opacity duration-300"
                    style={{ background: glow }} />

                  {/* Card content */}
                  <div className="relative p-6">

                    {/* Top: Avatar + Name + Menu */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-input)] border border-[var(--border-primary)] flex items-center justify-center text-[15px] font-bold text-[var(--text-primary)] flex-shrink-0 tracking-wide">
                          {initials}
                        </div>
                        <div>
                          <div className="text-[18px] font-semibold text-[var(--text-primary)] leading-tight">{worker.name}</div>
                          <div className="text-[13px] font-mono mt-0.5" style={{ color: 'var(--text-neutral-450)' }}>{worker.employeeId}</div>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Pills: Department, Role, Shift, Status */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-input)] border border-[var(--border-primary)]" style={{ color: 'var(--text-primary)' }}>
                        <Briefcase className="w-3 h-3" /> {worker.department}
                      </span>
                      <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--bg-input)] border border-[var(--border-primary)]" style={{ color: 'var(--text-neutral-450)' }}>
                        {worker.role}
                      </span>
                      <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: sh.bg, color: sh.text }}>
                        <span className="w-1.5 h-1.5 rounded-full mr-1 opacity-60" style={{ background: 'currentColor' }} />
                        {worker.shift}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                        {worker.status}
                      </span>
                    </div>

                    {/* Efficiency */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-medium" style={{ color: 'var(--text-neutral-450)' }}>Efficiency</span>
                        <span className="text-[22px] font-bold tracking-tight" style={{ color: ec.text }}>{worker.efficiency}%</span>
                      </div>
                      <div className="w-full rounded-full h-2 border overflow-hidden" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}>
                        <div className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${worker.efficiency}%`, background: ec.bar, animation: 'effFill 0.8s ease-out forwards' }} />
                      </div>
                    </div>

                    {/* Tasks Completed */}
                    <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 border mb-5" style={{ background: 'var(--bg-input)', borderColor: 'var(--border-primary)' }}>
                      <CheckCircle2 className="w-4.5 h-4.5" style={{ color: 'var(--text-neutral-400)' }} />
                      <span className="text-[12px] font-medium" style={{ color: 'var(--text-neutral-450)' }}>Tasks Completed</span>
                      <span className="ml-auto text-[17px] font-bold" style={{ color: 'var(--text-primary)' }}>{worker.tasksCompleted}</span>
                    </div>

                    {/* Footer: Edit + Delete */}
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(worker)}
                        className="flex-1 h-10 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] text-[var(--text-primary)] flex items-center justify-center gap-2 text-[12px] font-semibold hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)] transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => deleteWorker(worker.id)}
                        className="h-10 w-10 rounded-xl border bg-[var(--bg-input)] flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                        style={{ borderColor: 'var(--border-primary)', color: 'var(--text-neutral-450)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--destructive)'; e.currentTarget.style.borderColor = 'var(--destructive)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-neutral-450)'; e.currentTarget.style.borderColor = 'var(--border-primary)'; }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-[22px] p-12 text-center shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
              <Users className="w-10 h-10 text-[var(--text-neutral-400)] mx-auto mb-3" />
              <p className="text-[var(--text-primary)] font-semibold text-sm">No workers found</p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-neutral-450)' }}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Sidebar panels */}
        <div className="space-y-4">
          {/* Top performers */}
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-[22px] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[var(--text-primary)]" />
              <h3 className="text-[var(--text-primary)] font-semibold text-sm">Top Performers</h3>
            </div>
            <div className="space-y-3">
              {topPerformers.map((w, i) => (
                <div key={w.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border flex-shrink-0 ${
                    i === 0 ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]' : 'bg-[var(--hover-bg)] border-[var(--border-primary)]'
                  }`} style={{ color: i === 0 ? 'var(--background)' : 'var(--text-neutral-450)' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[var(--text-primary)] text-sm font-semibold truncate">{w.name}</div>
                    <div className="text-[11px]" style={{ color: 'var(--text-neutral-450)' }}>{w.department}</div>
                  </div>
                  <div className="text-[var(--text-primary)] text-sm font-bold">{w.efficiency}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dept distribution */}
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-[22px] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-4">By Department</h3>
            <div className="space-y-3">
              {DEPARTMENTS.filter(d => d !== 'All').map(dept => {
                const count = workers.filter(w => w.department === dept).length;
                if (count === 0) return null;
                return (
                  <div key={dept} className="flex items-center gap-2 text-sm">
                    <span className="text-[12px] flex-1 truncate" style={{ color: 'var(--text-neutral-450)' }}>{dept}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 bg-[var(--hover-bg)] rounded-full h-1 border border-[var(--border-primary)]">
                        <div className="h-1 rounded-full bg-[var(--foreground)]" style={{ width: `${(count / workers.length) * 100}%` }} />
                      </div>
                      <span className="text-[var(--text-primary)] text-[12px] w-3 text-right font-semibold">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-[22px] w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <h3 className="text-[var(--text-primary)] font-bold text-lg">{isEditing ? 'Edit Worker' : 'Add Worker'}</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer transition-all duration-200"><X className="w-4.5 h-4.5" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name*', key: 'name', type: 'text', col: 2 },
                { label: 'Employee ID', key: 'employeeId', type: 'text', col: 1 },
                { label: 'Role', key: 'role', type: 'text', col: 1 },
                { label: 'Email', key: 'email', type: 'email', col: 2 },
                { label: 'Phone', key: 'phone', type: 'text', col: 2 },
                { label: 'Efficiency (%)', key: 'efficiency', type: 'number', col: 1 },
                { label: 'Tasks Completed', key: 'tasksCompleted', type: 'number', col: 1 },
              ].map(f => (
                <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-neutral-450)' }}>{f.label}</label>
                  <input type={f.type} value={(editWorker as any)[f.key] || ''}
                    onChange={e => setEditWorker(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
              ))}
              {[
                { label: 'Department', key: 'department', options: DEPARTMENTS.filter(d => d !== 'All') },
                { label: 'Shift', key: 'shift', options: ['Morning', 'Afternoon', 'Night'] },
                { label: 'Status', key: 'status', options: ['On Duty', 'Off Duty', 'On Leave', 'Absent'] },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-neutral-450)' }}>{f.label}</label>
                  <select value={(editWorker as any)[f.key] || ''} onChange={e => setEditWorker(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 cursor-pointer">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-transparent border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer">Cancel</button>
              <button onClick={saveWorker} className="flex-1 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-sm rounded-lg py-2.5 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                {isEditing ? 'Update Worker' : 'Add Worker'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global keyframe for progress bar animation */}
      <style>{`
        @keyframes effFill {
          from { width: 0%; }
        }
      `}</style>
    </div>
  );
}
