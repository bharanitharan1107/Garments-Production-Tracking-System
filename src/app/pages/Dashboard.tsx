import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ShoppingCart, Factory, Users, Truck, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Info, Zap, RefreshCw, ArrowRight,
  Shield, Cpu, ChevronDown, ArrowUpRight, ArrowDownRight, Sparkles, Calendar
} from 'lucide-react';
import {
  orders, productionLines, workers, machines, shipments, qcRecords,
  aiInsights
} from '../data/mockData';

// Donut data for production stages output distribution
const DONUT_DATA = [
  { name: 'Cutting', value: 9200, color: '#ffffff' },
  { name: 'Sewing', value: 7800, color: '#e4e4e7' },
  { name: 'Finishing', value: 6500, color: '#a1a1aa' },
  { name: 'QC', value: 2200, color: '#71717a' },
  { name: 'Packaging', value: 8900, color: '#27272a' }
];

// Mini sparkline data for "Total Profit"
const MINI_CHART_DATA = [
  { value: 90000 },
  { value: 95000 },
  { value: 110000 },
  { value: 105000 },
  { value: 125000 },
  { value: 120000 },
  { value: 136755 }
];

// Sparkline data for Net Revenue card
const REVENUE_SPARKLINE = [
  { v: 780 }, { v: 820 }, { v: 790 }, { v: 850 }, { v: 870 }, { v: 860 }, { v: 903 }
];

// Bar data for Workers On Duty card
const WORKERS_BAR = [
  { v: 8 }, { v: 12 }, { v: 10 }, { v: 14 }, { v: 11 }, { v: 15 }, { v: 15 }
];

export default function Dashboard() {
  const { currentUser } = useAuth();

  // Calculation variables
  const activeOrdersVal = orders.filter(o => ['In Progress', 'QC Review', 'Pending'].includes(o.status)).reduce((sum, o) => sum + o.totalValue, 0);
  const qcPassRate = Math.round((qcRecords.filter(q => q.status === 'Passed').length / qcRecords.length) * 100);
  const workersOnShift = workers.filter(w => w.status === 'On Duty').length;

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">Overview</h2>
        <button className="flex items-center gap-1.5 bg-[var(--card)] border border-[var(--border-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <span>Today</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row 1 - Overview Stat Cards with Mini Charts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {/* Net Revenue - Area Sparkline */}
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 cursor-pointer flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[var(--text-neutral-400)] text-[11px] font-semibold uppercase tracking-wider">Net Revenue</span>
            <ShoppingCart className="w-3.5 h-3.5 text-[var(--text-neutral-400)]" />
          </div>
          <div className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-1">₹9,03,000</div>
          <div className="text-[11px] text-[var(--text-neutral-400)] mb-2">
            <span className="font-semibold text-[var(--text-primary)]">+0.4% Today</span> · Updated just now
          </div>
          <div className="h-10 w-full -mb-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_SPARKLINE} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-primary-stroke)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--chart-primary-stroke)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="var(--chart-primary-stroke)" strokeWidth={1.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ARR Goal - Radial Progress */}
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 cursor-pointer flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[var(--text-neutral-400)] text-[11px] font-semibold uppercase tracking-wider">ARR Goal</span>
            <TrendingUp className="w-3.5 h-3.5 text-[var(--text-neutral-400)]" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-1">89.5%</div>
              <div className="text-[11px] text-[var(--text-neutral-400)]">
                <span className="font-semibold text-[var(--text-primary)]">+3.2% Today</span> · Updated just now
              </div>
            </div>
            <div className="w-14 h-14 relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 89.5 }, { value: 10.5 }]}
                    cx="50%" cy="50%"
                    innerRadius={16} outerRadius={24}
                    startAngle={90} endAngle={-270}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="var(--chart-primary-stroke)" />
                    <Cell fill="var(--bg-input)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-[var(--text-primary)]">89%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quarterly Pass - Donut Progress */}
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 cursor-pointer flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[var(--text-neutral-400)] text-[11px] font-semibold uppercase tracking-wider">Quarterly Pass</span>
            <CheckCircle className="w-3.5 h-3.5 text-[var(--text-neutral-400)]" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-1">50%</div>
              <div className="text-[11px] text-[var(--text-neutral-400)]">
                <span className="font-semibold text-[var(--text-primary)]">Goal: 52%</span> · Updated just now
              </div>
            </div>
            <div className="w-14 h-14 relative flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 50 }, { value: 50 }]}
                    cx="50%" cy="50%"
                    innerRadius={16} outerRadius={24}
                    startAngle={90} endAngle={-270}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="var(--chart-primary-stroke)" />
                    <Cell fill="var(--bg-input)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-[var(--text-primary)]">50%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workers On Duty - Bar Sparkline */}
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 cursor-pointer flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[var(--text-neutral-400)] text-[11px] font-semibold uppercase tracking-wider">Workers On Duty</span>
            <Users className="w-3.5 h-3.5 text-[var(--text-neutral-400)]" />
          </div>
          <div className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-1">15</div>
          <div className="text-[11px] text-[var(--text-neutral-400)] mb-2">
            <span className="font-semibold text-[var(--text-primary)]">+11% Today</span> · Updated just now
          </div>
          <div className="h-10 w-full -mb-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WORKERS_BAR} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Bar dataKey="v" fill="var(--chart-primary-stroke)" radius={[2, 2, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 - Donut distribution & right panel widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sales Overview style -> Production Output Distribution */}
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 lg:col-span-7 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-primary)] font-semibold text-sm">Sales Overview</span>
            <button className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] cursor-pointer transition-colors text-xs font-bold">···</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mt-4">
            {/* Donut Chart representation */}
            <div className="sm:col-span-6 h-[240px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DONUT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {DONUT_DATA.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <div className="text-[32px] font-bold text-[var(--text-primary)] leading-none">34.6k</div>
                <div className="text-[var(--text-neutral-450)] text-[11px] uppercase tracking-wider font-semibold mt-1.5">Total Output</div>
              </div>
            </div>

            {/* Metrics distribution table/lists */}
            <div className="sm:col-span-6 text-left space-y-4 sm:pl-4">
              <div className="flex items-baseline justify-between border-b border-[var(--border-primary)] pb-3">
                <div>
                  <span className="text-[var(--text-neutral-450)] text-[11px] uppercase tracking-wider font-semibold">Total Sales</span>
                  <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">₹5,71,020</div>
                </div>
                <span className="text-[11px] text-[var(--text-primary)] bg-[var(--hover-bg)] border border-[var(--border-primary)] px-2.5 py-1 rounded-md font-semibold">
                  Active Shift
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                {DONUT_DATA.slice(0, 4).map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[var(--text-neutral-450)] font-medium">{item.name}</span>
                    </div>
                    <span className="text-[var(--text-primary)] font-bold">₹{item.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 Right Column widgets (Grayscale Area Chart, Shift Plan) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Multi-stat 1: Live alerts & Mini Efficiency Increase */}
          <div className="space-y-5">
            <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left flex flex-col justify-between min-h-[95px] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <span className="text-[var(--text-neutral-450)] text-[11px] font-semibold uppercase tracking-wider">New customers</span>
              <div>
                <div className="text-xl font-bold text-[var(--text-primary)]">862</div>
                <div className="text-[var(--text-neutral-450)] text-[10px] font-semibold mt-1 bg-[var(--hover-bg)] border border-[var(--border-primary)] w-fit px-1.5 py-0.5 rounded">-8%</div>
              </div>
            </div>
            
            <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left flex flex-col justify-between min-h-[95px] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <span className="text-[var(--text-neutral-450)] text-[11px] font-semibold uppercase tracking-wider">Total profit</span>
              <div>
                <div className="text-xl font-bold text-[var(--text-primary)]">₹2.56L</div>
                <div className="text-[var(--text-neutral-450)] text-[10px] font-semibold mt-1 bg-[var(--hover-bg)] border border-[var(--border-primary)] w-fit px-1.5 py-0.5 rounded">+42%</div>
              </div>
            </div>
          </div>

          {/* Grayscale area chart - Total Profit Card */}
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 text-left flex flex-col justify-between min-h-[210px] relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="z-10">
              <span className="text-[var(--text-neutral-450)] text-[11px] font-semibold uppercase tracking-wider">Total Profit</span>
              <p className="text-[var(--text-neutral-450)] text-[10px] mt-0.5">3 February 2026</p>
              <div className="text-lg font-bold text-[var(--text-primary)] mt-1">₹ 13,67,555</div>
            </div>
            
            {/* Monochrome Area Chart at bottom */}
            <div className="h-20 w-full absolute bottom-0 left-0 right-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MINI_CHART_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="silverAreaGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--profit-chart-stroke)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--profit-chart-stroke)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--profit-chart-stroke)"
                    strokeWidth={2}
                    fill="url(#silverAreaGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Premium Plan Card - Shift schedule active card */}
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-5 sm:col-span-2 text-left flex flex-col justify-between min-h-[170px] relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-semibold text-[var(--text-primary)] bg-[var(--hover-bg)] border border-[var(--border-primary)] px-2.5 py-0.5 rounded-full">
                Active Shift Plan
              </span>
              <button className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] cursor-pointer">···</button>
            </div>

            <div className="my-3 z-10">
              <div className="text-2xl font-bold text-[var(--text-primary)]">₹300 <span className="text-xs text-[var(--text-neutral-450)] font-normal">/ Per Hour Avg</span></div>
              <p className="text-[var(--text-neutral-450)] text-[12px] leading-relaxed mt-1.5">
                Improve your workspace, view and analyze your output efficiency and losses.
              </p>
            </div>

            <div className="z-10">
              <button className="w-full bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-[var(--background)] font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                Get Started
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Row 3 - Grayscale Table */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[var(--text-primary)] font-semibold text-sm">Active Orders Tracking</span>
          <button className="text-[var(--text-neutral-450)] hover:text-[var(--text-primary)] cursor-pointer transition-colors text-xs font-bold">···</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-[var(--text-neutral-450)] border-b border-[var(--border-primary)] text-[13px] font-medium">
                <th className="text-left pb-3 font-medium">Order Name</th>
                <th className="text-left pb-3 font-medium">Progress / Status</th>
                <th className="text-right pb-3 font-medium">Total Deal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)] text-[14px]">
              {orders.slice(0, 3).map((item, i) => {
                const stage = item.status === 'In Progress' ? 'Sewing Stage' : item.status === 'QC Review' ? 'QC Stage' : 'Cutting Stage';
                const progressVal = item.status === 'In Progress' ? 65 : item.status === 'QC Review' ? 90 : 35;
                const managers = ['Sarah Johnson', 'Michael Chen', 'Priya Patel'];
                const managerAvatar = ['SJ', 'MC', 'PP'];
                
                return (
                  <tr key={item.id} className="hover:bg-[var(--hover-bg)] transition-colors duration-150">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-input)] border border-[var(--border-primary)] text-[var(--text-primary)] flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                          {managerAvatar[i]}
                        </div>
                        <div>
                          <div className="text-[var(--text-primary)] font-semibold">{item.orderNumber}</div>
                          <div className="text-[var(--text-neutral-450)] text-[12px]">{item.product}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-left">
                      <div className="max-w-[140px]">
                        <div className="flex items-center justify-between text-[11px] text-[var(--text-neutral-450)] mb-1">
                          <span>{stage}</span>
                          <span className="font-semibold">{progressVal}%</span>
                        </div>
                        <div className="w-full h-1 bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--foreground)] rounded-full" style={{ width: `${progressVal}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-bold text-[var(--text-primary)]">
                      ₹{item.totalValue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
