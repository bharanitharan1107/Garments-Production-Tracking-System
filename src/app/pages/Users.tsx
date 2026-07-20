import { useState } from 'react';
import { users as initialUsers, User, UserRole } from '../data/mockData';
import { Plus, Edit, Trash2, X, Shield, UserCheck, UserX, Key, Users as UsersIcon } from 'lucide-react';

const DEPARTMENTS = ['Management', 'Production', 'Sewing', 'Cutting', 'Finishing', 'Quality Control', 'Packaging', 'Embroidery', 'Logistics'];

const emptyUser: Partial<User> = {
  name: '', email: '', password: 'temp123', role: 'Worker',
  status: 'Active', department: 'Production', avatar: ''
};

function RoleBadge({ role }: { role: UserRole }) {
  const isAdmin = role === 'Admin';
  return (
    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
      isAdmin
        ? 'bg-[var(--hover-bg)] border-[var(--border-primary)] text-[var(--text-primary)] font-semibold'
        : 'bg-[var(--hover-bg)] border-[var(--border-primary)] text-[var(--text-neutral-450)]'
    }`}>
      <Shield className="w-2.5 h-2.5" />
      {role}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  return (
    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
      status === 'Active'
        ? 'bg-[var(--hover-bg)] border-[var(--border-primary)] text-[var(--text-primary)] font-medium'
        : 'bg-[var(--hover-bg)] border-[var(--border-primary)] text-[var(--text-neutral-450)]'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${status === 'Active' ? 'bg-[var(--foreground)]' : 'bg-[var(--text-neutral-450)]'}`} />
      {status}
    </span>
  );
}

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roleFilter, setRoleFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<Partial<User>>(emptyUser);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassReset, setShowPassReset] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const filtered = users.filter(u => roleFilter === 'All' || u.role === roleFilter);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    admins: users.filter(u => u.role === 'Admin').length,
    byRole: {
      Admin: users.filter(u => u.role === 'Admin').length,
      'Production Manager': users.filter(u => u.role === 'Production Manager').length,
      Worker: users.filter(u => u.role === 'Worker').length,
      'QC Inspector': users.filter(u => u.role === 'QC Inspector').length,
    }
  };

  const openNew = () => { setEditUser({ ...emptyUser }); setIsEditing(false); setShowForm(true); };
  const openEdit = (u: User) => { setEditUser({ ...u }); setIsEditing(true); setShowForm(true); };

  const saveUser = () => {
    if (!editUser.name || !editUser.email) return;
    const avatar = editUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    if (isEditing) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...editUser, avatar } as User : u));
    } else {
      setUsers(prev => [...prev, { ...editUser as User, id: `u${Date.now()}`, avatar, joinDate: new Date().toISOString().split('T')[0], lastLogin: 'Never' }]);
    }
    setShowForm(false);
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const deleteUser = (id: string) => {
    if (id === 'u1') { alert('Cannot delete the primary admin account'); return; }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const resetPassword = (id: string) => {
    if (!newPassword) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, password: newPassword } : u));
    alert(`Password updated successfully for user ${users.find(u => u.id === id)?.name}`);
    setShowPassReset(null);
    setNewPassword('');
  };

  const formatDate = (d: string) => {
    if (d === 'Never') return 'Never';
    try { return new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  const cardStats = [
    { label: 'Total Users', value: stats.total, icon: UsersIcon },
    { label: 'Active', value: stats.active, icon: UserCheck },
    { label: 'Admins', value: stats.admins, icon: Shield },
    { label: 'Inactive', value: stats.total - stats.active, icon: UserX },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">User Management</h2>
          <p className="text-[var(--text-neutral-450)] text-sm mt-1">Role-based access control</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-xs px-4 py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer border border-[var(--border-primary)]">
          <Plus className="w-4 h-4" /> Add User
        </button>
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

      {/* Role distribution cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        {(Object.entries(stats.byRole) as [UserRole, number][]).map(([role, count]) => (
          <div key={role} className={`bg-[var(--card)] rounded-xl border border-[var(--border-primary)] p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
            roleFilter === role ? 'ring-2 ring-[var(--foreground)]' : ''
          }`}
            onClick={() => setRoleFilter(roleFilter === role ? 'All' : role)}>
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="w-3.5 h-3.5 text-[var(--text-neutral-400)]" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-neutral-450)]">{role}</span>
            </div>
            <div className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight">{count}</div>
          </div>
        ))}
      </div>

      {/* Role filter tabs */}
      <div className="flex gap-1 bg-[var(--bg-input)] p-1 rounded-lg border border-[var(--border-primary)] w-fit">
        {['All', 'Admin', 'Production Manager', 'Worker', 'QC Inspector'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer ${
              roleFilter === r
                ? 'bg-[var(--card)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                : 'text-[var(--text-neutral-450)] hover:text-[var(--text-primary)]'
            }`}>
            {r}
          </button>
        ))}
      </div>

      {/* User table */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl overflow-hidden text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[var(--bg-input)] border-b border-[var(--border-primary)] sticky top-0 z-10">
              <tr className="text-[var(--text-neutral-450)] text-[13px] font-medium">
                {['User', 'Role', 'Department', 'Status', 'Last Login', 'Join Date', 'Actions'].map(h => (
                  <th key={h} className="font-medium px-4 py-3.5 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)] text-[14px]">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-[var(--hover-bg)] transition-colors duration-150">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] flex items-center justify-center text-[12px] font-bold flex-shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-[var(--text-primary)] font-semibold leading-tight">{user.name}</div>
                        <div className="text-[var(--text-neutral-450)] text-[12px]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><RoleBadge role={user.role} /></td>
                  <td className="px-4 py-4 text-[var(--text-neutral-450)]">{user.department}</td>
                  <td className="px-4 py-4"><StatusDot status={user.status} /></td>
                  <td className="px-4 py-4 text-[var(--text-neutral-450)]">{formatDate(user.lastLogin)}</td>
                  <td className="px-4 py-4 text-[var(--text-neutral-450)]">{formatDate(user.joinDate)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(user)} title="Edit" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => toggleStatus(user.id)} title={user.status === 'Active' ? 'Deactivate' : 'Activate'} className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer">
                        {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { setShowPassReset(user.id); setNewPassword(''); }} title="Reset Password" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><Key className="w-4 h-4" /></button>
                      <button onClick={() => deleteUser(user.id)} title="Delete" className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security note */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-4 flex items-start gap-3 text-left shadow-[var(--card-shadow)]">
        <Shield className="w-4 h-4 text-[var(--text-primary)] flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-[var(--text-primary)] text-sm font-semibold mb-1">Security Features</div>
          <div className="text-[var(--text-neutral-450)] text-[13px] leading-normal">
            In production mode: passwords are salted and hashed, sessions employ encrypted JWT authorization tokens, inputs are sanitized against SQL injection, and administrative operations write directly to audit trail logs.
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPassReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-[var(--text-primary)] font-bold text-base mb-1">Reset Password</h3>
            <p className="text-[var(--text-neutral-450)] text-sm mb-4">For: <span className="text-[var(--text-primary)] font-semibold">{users.find(u => u.id === showPassReset)?.name}</span></p>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="New password (min 8 chars)"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-neutral-450)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowPassReset(null)} className="flex-1 bg-transparent border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-lg py-2 text-sm font-semibold transition-all duration-200 cursor-pointer">Cancel</button>
              <button onClick={() => resetPassword(showPassReset)} disabled={newPassword.length < 8}
                className="flex-1 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 disabled:opacity-50 text-[var(--background)] font-bold text-sm rounded-lg py-2 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
              <h3 className="text-[var(--text-primary)] font-bold text-lg">{isEditing ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--hover-bg)] cursor-pointer transition-all duration-200"><X className="w-4.5 h-4.5" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name*', key: 'name', type: 'text', col: 2 },
                { label: 'Email*', key: 'email', type: 'email', col: 2 },
                ...(!isEditing ? [{ label: 'Password*', key: 'password', type: 'password', col: 2 }] : []),
              ].map((f: any) => (
                <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">{f.label}</label>
                  <input type={f.type} value={(editUser as any)[f.key] || ''}
                    onChange={e => setEditUser(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200" />
                </div>
              ))}
              {[
                { label: 'Role', key: 'role', options: ['Admin', 'Production Manager', 'Worker', 'QC Inspector'] },
                { label: 'Status', key: 'status', options: ['Active', 'Inactive'] },
                { label: 'Department', key: 'department', options: DEPARTMENTS },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[var(--text-neutral-450)] text-xs font-semibold mb-1">{f.label}</label>
                  <select value={(editUser as any)[f.key] || ''} onChange={e => setEditUser(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] transition-all duration-200 cursor-pointer">
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-transparent border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer">Cancel</button>
              <button onClick={saveUser} className="flex-1 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 hover:scale-[1.01] active:scale-[0.99] text-[var(--background)] font-bold text-sm rounded-lg py-2.5 transition-all duration-200 cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                {isEditing ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
