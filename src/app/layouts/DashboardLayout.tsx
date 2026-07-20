import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShoppingCart, Package, Factory, Users, Shield,
  Cpu, BarChart3, Truck, UserCog, Scissors, Bell, ChevronLeft,
  Menu, X, LogOut, ChevronDown, Search, HelpCircle, Moon, Sun, RefreshCw, Globe
} from 'lucide-react';

interface NavItem {
  path: string; label: string; icon: React.ElementType;
  roles: string[]; badge?: number;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Production Manager'] },
  { path: '/orders', label: 'Orders', icon: ShoppingCart, roles: ['Admin', 'Production Manager', 'Worker', 'QC Inspector'], badge: 3 },
  { path: '/inventory', label: 'Inventory', icon: Package, roles: ['Admin', 'Production Manager'], badge: 4 },
  { path: '/production', label: 'Production', icon: Factory, roles: ['Admin', 'Production Manager', 'Worker'] },
  { path: '/quality-control', label: 'Quality Control', icon: Shield, roles: ['Admin', 'Production Manager', 'QC Inspector'], badge: 2 },
  { path: '/shipping', label: 'Shipping & Dispatch', icon: Truck, roles: ['Admin', 'Production Manager'] },
  { path: '/workers', label: 'Workers', icon: Users, roles: ['Admin', 'Production Manager'] },
  { path: '/machines', label: 'Machines', icon: Cpu, roles: ['Admin', 'Production Manager'], badge: 1 },
  { path: '/reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['Admin', 'Production Manager'] },
  { path: '/users', label: 'User Management', icon: UserCog, roles: ['Admin'] },
];

export default function DashboardLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('akashgarments-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('akashgarments-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const filteredNav = navItems.filter(item =>
    currentUser ? item.roles.includes(currentUser.role) : false
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPage = navItems.find(n => location.pathname === n.path)?.label || 'Dashboard';

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full bg-[var(--bg-sidebar)]">
      {/* Brand & User Profile at Top */}
      <div className="p-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--hover-bg)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] font-black text-sm flex-shrink-0">
              {currentUser?.avatar || 'A'}
            </div>
            {(sidebarOpen || onClose) && (
              <div className="text-left min-w-0">
                <div className="text-[var(--text-primary)] text-sm font-extrabold truncate leading-tight">{currentUser?.name || 'Guy Hawkins'}</div>
                <div className="text-[var(--text-neutral-450)] text-xs mt-0.5 truncate leading-none">{currentUser?.role || 'Administrator'}</div>
              </div>
            )}
          </div>
          {(sidebarOpen || onClose) && (
            <ChevronDown className="w-4 h-4 text-[var(--text-neutral-450)] cursor-pointer hover:text-[var(--text-primary)]" />
          )}
        </div>

        {/* Search bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-neutral-450)]" />
          <input
            type="text"
            placeholder={sidebarOpen || onClose ? "Search...  ⌘K" : ""}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-neutral-450)] rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[var(--text-neutral-400)] transition-all"
            disabled={!sidebarOpen && !onClose}
          />
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
        {/* DASHBOARDS GROUP */}
        <div>
          {(sidebarOpen || onClose) && (
            <div className="text-[var(--text-neutral-450)] text-[10.5px] uppercase tracking-wider font-extrabold px-3.5 mb-2.5">
              Dashboards & Ops
            </div>
          )}
          <nav className="space-y-1">
            {filteredNav.slice(0, 6).map(item => (
              <NavLink key={item.path} to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative text-[13px] ${
                    isActive
                      ? 'bg-[var(--foreground)] text-[var(--background)] font-medium shadow-sm'
                      : 'text-[var(--text-neutral-400)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                  }`
                }>
                {({ isActive }) => (
                  <>
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {(sidebarOpen || onClose) && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 border ${
                            isActive
                              ? 'bg-[var(--background)] text-[var(--foreground)] border-[var(--background)]'
                              : 'bg-[var(--hover-bg)] text-[var(--text-neutral-450)] border-[var(--border-primary)]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {!sidebarOpen && !onClose && item.badge && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--text-primary)] rounded-full border border-[var(--bg-sidebar)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* SETTINGS GROUP */}
        <div>
          {(sidebarOpen || onClose) && (
            <div className="text-[var(--text-neutral-450)] text-[10.5px] uppercase tracking-wider font-extrabold px-3.5 mb-2.5">
              Management & Plan
            </div>
          )}
          <nav className="space-y-1">
            {filteredNav.slice(6).map(item => (
              <NavLink key={item.path} to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative text-[13px] ${
                    isActive
                      ? 'bg-[var(--foreground)] text-[var(--background)] font-medium shadow-sm'
                      : 'text-[var(--text-neutral-400)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                  }`
                }>
                {({ isActive }) => (
                  <>
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {(sidebarOpen || onClose) && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 border ${
                            isActive
                              ? 'bg-[var(--background)] text-[var(--foreground)] border-[var(--background)]'
                              : 'bg-[var(--hover-bg)] text-[var(--text-neutral-450)] border-[var(--border-primary)]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {!sidebarOpen && !onClose && item.badge && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--text-primary)] rounded-full border border-[var(--bg-sidebar)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Brand logo at bottom */}
      <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-sidebar)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--text-primary)] flex-shrink-0" />
            {(sidebarOpen || onClose) && (
              <span className="text-[var(--text-primary)] text-xs font-black tracking-widest font-sans">AKASH GARMENTS</span>
            )}
          </div>
          {(sidebarOpen || onClose) && (
            <span className="text-[var(--text-neutral-450)] text-[8px] uppercase tracking-wider font-bold">v1.2.0</span>
          )}
        </div>
      </div>
    </div>
  );



  return (
    <div className="flex h-screen bg-[var(--bg-main)] text-[var(--text-primary)] overflow-hidden font-sans">
      {/* Left sidebar - Column 1 */}
      <aside className={`hidden lg:flex flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--bg-sidebar)] flex flex-col border-r border-[var(--border-primary)]">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main & Right column container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-[var(--bg-sidebar)] border-b border-[var(--border-primary)] px-6 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-[var(--text-neutral-400)] hover:text-[var(--text-primary)] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => setSidebarOpen(prev => !prev)} className="hidden lg:flex text-[var(--text-neutral-400)] hover:text-[var(--text-primary)] transition-colors">
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div className="flex items-center gap-1.5 text-[var(--text-neutral-450)] text-[11px] font-medium select-none">
              <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Dashboards</span>
              <span className="text-[var(--text-neutral-450)]">/</span>
              <span className="text-[var(--text-primary)] font-semibold">{currentPage}</span>
            </div>
          </div>
          {/* Action icons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme} 
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-400)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 focus:outline-none cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-400)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 focus:outline-none cursor-pointer">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-400)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 focus:outline-none cursor-pointer relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[var(--text-primary)] rounded-full border border-[var(--bg-sidebar)]" />
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-neutral-400)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 focus:outline-none cursor-pointer">
              <Globe className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-l border-[var(--border-primary)] pl-3 ml-1">
              <button onClick={handleLogout} className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] flex items-center gap-1.5 text-xs transition-all duration-200 cursor-pointer h-8 px-2.5 rounded-lg hover:bg-[var(--hover-bg)]">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content & Right Column Wrapper */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main page content area - Column 2 */}
          <main className="flex-1 overflow-auto bg-[var(--bg-main)] p-6 text-[var(--text-primary)]">
            <Outlet />
          </main>


        </div>
      </div>
    </div>
  );
}