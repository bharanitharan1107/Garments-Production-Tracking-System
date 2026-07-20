import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { Download, FileText, FileSpreadsheet, Printer, TrendingUp, Calendar, Filter } from 'lucide-react';
import {
  productionTrendData, orderStatusData, qualityTrendData, departmentOutputData, orders, workers
} from '../data/mockData';

const revenueData = [
  { month: 'Sep', revenue: 18375000, orders: 18, target: 18750000 },
  { month: 'Oct', revenue: 23400000, orders: 24, target: 21000000 },
  { month: 'Nov', revenue: 20850000, orders: 21, target: 21000000 },
  { month: 'Dec', revenue: 29625000, orders: 31, target: 24000000 },
  { month: 'Jan', revenue: 20025000, orders: 19, target: 22500000 },
  { month: 'Feb', revenue: 25575000, orders: 26, target: 24000000 },
  { month: 'Mar', revenue: 14850000, orders: 14, target: 26250000 },
];

const defectByType = [
  { type: 'Stitching', count: 45 }, { type: 'Sizing', count: 28 },
  { type: 'Fabric', count: 22 }, { type: 'Print', count: 18 },
  { type: 'Zipper', count: 12 }, { type: 'Button', count: 9 },
];

const workerPerformanceData = workers.slice(0, 8).map(w => ({
  name: w.name.split(' ')[0], efficiency: w.efficiency, tasks: w.tasksCompleted
}));

// Grayscale colors for customer revenue split chart
const customerRevenueData = [
  { name: 'Lakshmi Silks', value: 81000000, color: 'var(--chart-primary-stroke)' },
  { name: 'Coimbatore Textile Hub', value: 66750000, color: 'var(--text-neutral-350)' },
  { name: 'Salem Garment Exports', value: 57000000, color: 'var(--text-neutral-450)' },
  { name: 'Tirupur Export House', value: 46500000, color: 'var(--text-neutral-500)' },
  { name: 'Chennai Garment Mall', value: 43500000, color: 'var(--text-neutral-555)' },
  { name: 'Others', value: 80250000, color: 'var(--border-primary)' },
];

const radarData = [
  { subject: 'Production', A: 85, fullMark: 100 },
  { subject: 'Quality', A: 94, fullMark: 100 },
  { subject: 'Delivery', A: 91, fullMark: 100 },
  { subject: 'Efficiency', A: 89, fullMark: 100 },
  { subject: 'Inventory', A: 78, fullMark: 100 },
  { subject: 'Safety', A: 97, fullMark: 100 },
];

const REPORT_TYPES = [
  { id: 'production', label: 'Production Report', description: 'Output, efficiency & stage analysis' },
  { id: 'quality', label: 'QC Report', description: 'Defects, pass rates & trends' },
  { id: 'inventory', label: 'Inventory Report', description: 'Stock levels & reorder alerts' },
  { id: 'workers', label: 'Worker Performance', description: 'Efficiency & attendance data' },
  { id: 'financial', label: 'Revenue Report', description: 'Orders, revenue & targets' },
  { id: 'shipment', label: 'Shipment Report', description: 'Dispatch & delivery tracking' },
];

function toast(msg: string) { alert(msg); }

const ALL_MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

const FILTER_MAP: Record<string, { months: string[]; qualityWeeks: number; label: string }> = {
  'last-7-months': { months: ALL_MONTHS, qualityWeeks: 8, label: 'Last 7 Months' },
  'last-30-days':   { months: ['Feb', 'Mar'], qualityWeeks: 4, label: 'Last 30 Days' },
  'this-year':      { months: ['Jan', 'Feb', 'Mar'], qualityWeeks: 8, label: 'This Year' },
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last-7-months');
  const [exporting, setExporting] = useState(false);

  const filter = FILTER_MAP[dateRange] || FILTER_MAP['last-7-months'];

  const filteredRevenueData = revenueData.filter(d => filter.months.includes(d.month));
  const filteredProductionData = productionTrendData.filter(d => filter.months.includes(d.month));
  const filteredQualityData = qualityTrendData.slice(-filter.qualityWeeks);

  const totalRevenue = filteredRevenueData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = filteredRevenueData.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const handleExport = (format: string) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert(`Report exported as ${format.toUpperCase()}!\n\nIn a production environment, this would generate a real ${format.toUpperCase()} file with current data.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="text-left">
          <h2 className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-tight">Reports & Analytics</h2>
          <p className="text-[var(--text-neutral-400)] text-sm mt-1">Comprehensive production intelligence & insights</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="h-10 bg-[var(--card)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg px-3 text-[14px] focus:outline-none focus:border-[var(--text-primary)] cursor-pointer transition-all duration-200">
            <option value="last-7-months">Last 7 Months</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="this-year">This Year</option>
          </select>
          <div className="flex gap-2">
            {[
              { label: 'PDF', icon: FileText },
              { label: 'CSV', icon: FileSpreadsheet },
              { label: 'Excel', icon: FileSpreadsheet },
              { label: 'Print', icon: Printer },
            ].map(btn => (
              <button key={btn.label} onClick={() => handleExport(btn.label)} disabled={exporting}
                className="flex items-center gap-1.5 text-[12px] uppercase font-bold px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--card)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <btn.icon className="w-3.5 h-3.5" />
                {exporting ? '...' : btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-input)] p-1 rounded-full border border-[var(--border-primary)] w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'production', label: 'Production' },
          { id: 'quality', label: 'Quality' },
          { id: 'financial', label: 'Financial' },
          { id: 'workers', label: 'Workforce' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[var(--card)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                : 'text-[var(--text-neutral-400)] hover:text-[var(--text-primary)]'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 text-left">
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue / 10000000).toFixed(2)}Cr`, sub: filter.label },
          { label: 'Orders Completed', value: totalOrders, sub: `${filter.months.length} months` },
          { label: 'Avg Order Value', value: `₹${avgOrderValue.toLocaleString('en-IN')}`, sub: 'Per order' },
          { label: 'On-Time Delivery', value: '91.8%', sub: '+2.3% vs last month' },
        ].map(s => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250">
            <div className="text-[36px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-2">{s.value}</div>
            <div className="text-[var(--text-primary)] text-sm font-semibold mb-0.5">{s.label}</div>
            <div className="text-[var(--text-neutral-400)] text-[12px]">{s.sub}</div>
          </div>
        ))}
      </div>

      {(activeTab === 'overview' || activeTab === 'financial') && (
        <>
          {/* Revenue Chart */}
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 text-left shadow-[var(--card-shadow)]">
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">Revenue vs Target</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={filteredRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="monochromeRevenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-primary-stroke)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--chart-primary-stroke)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-primary)" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis dataKey="month" stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }}
                  formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                <Legend wrapperStyle={{ color: 'var(--text-neutral-400)', fontSize: 11 }} />
                <Area type="monotone" dataKey="target" stroke="var(--text-neutral-555)" fill="none" strokeDasharray="4 4" name="Target" />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-primary-stroke)" fill="url(#monochromeRevenueGlow)" strokeWidth={2} name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Revenue Split */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-left">
            <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
              <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">Revenue by Customer</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={customerRevenueData} cx="50%" cy="50%" outerRadius={85}
                    dataKey="value" paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false} fontSize={9} stroke="var(--bg-card)" strokeWidth={2}>
                    {customerRevenueData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }}
                  formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Overall Performance Radar */}
            <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 flex flex-col justify-between shadow-[var(--card-shadow)]">
              <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">Factory Performance Score</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border-primary)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} />
                  <Radar name="Score" dataKey="A" stroke="var(--chart-primary-stroke)" fill="var(--chart-primary-stroke)" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }}
                    formatter={(v: number) => [`${v}%`, '']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {(activeTab === 'overview' || activeTab === 'production') && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 shadow-[var(--card-shadow)]">
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">Production Volume Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={filteredProductionData} barSize={16} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} opacity={0.5} />
                <XAxis dataKey="month" stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Legend wrapperStyle={{ color: 'var(--text-neutral-400)', fontSize: 11 }} />
                <Bar dataKey="target" fill="var(--text-neutral-555)" radius={[3, 3, 0, 0]} name="Target" />
                <Bar dataKey="units" fill="var(--chart-primary-stroke)" radius={[3, 3, 0, 0]} name="Actual Output" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 shadow-[var(--card-shadow)]">
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">Department Output vs Capacity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={departmentOutputData} layout="vertical" barSize={10} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" horizontal={false} opacity={0.5} />
                <XAxis type="number" stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <YAxis dataKey="dept" type="category" stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} width={70} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Legend wrapperStyle={{ color: 'var(--text-neutral-400)', fontSize: 11 }} />
                <Bar dataKey="capacity" fill="var(--text-neutral-555)" radius={[0, 3, 3, 0]} name="Capacity" />
                <Bar dataKey="output" fill="var(--text-neutral-350)" radius={[0, 3, 3, 0]} name="Output" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {(activeTab === 'overview' || activeTab === 'quality') && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-left">
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 shadow-[var(--card-shadow)]">
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">Quality Pass Rate Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={filteredQualityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} opacity={0.5} />
                <XAxis dataKey="week" stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} domain={[85, 100]} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }}
                  formatter={(v: number) => [`${v}%`, '']} />
                <Legend wrapperStyle={{ color: 'var(--text-neutral-400)', fontSize: 11 }} />
                <Line type="monotone" dataKey="passRate" stroke="var(--chart-primary-stroke)" strokeWidth={2} dot={{ fill: 'var(--chart-primary-stroke)', r: 3 }} name="Pass Rate" />
                <Line type="monotone" dataKey="defectRate" stroke="var(--text-neutral-450)" strokeWidth={2} dot={{ fill: 'var(--text-neutral-450)', r: 3 }} name="Defect Rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 shadow-[var(--card-shadow)]">
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">Defects by Type</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={defectByType} layout="vertical" barSize={10} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" horizontal={false} opacity={0.5} />
                <XAxis type="number" stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="type" type="category" stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} width={70} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Bar dataKey="count" fill="var(--text-neutral-350)" radius={[0, 3, 3, 0]} name="Defect Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {(activeTab === 'workers') && (
        <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 text-left shadow-[var(--card-shadow)]">
          <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">Worker Efficiency Scores</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={workerPerformanceData} barSize={20} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} opacity={0.5} />
              <XAxis dataKey="name" stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis stroke="var(--border-primary)" tick={{ fill: 'var(--text-neutral-400)', fontSize: 10 }} domain={[70, 100]} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, color: 'var(--text-primary)' }} />
              <Bar dataKey="efficiency" radius={[4, 4, 0, 0]} name="Efficiency %" fill="var(--chart-primary-stroke)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Available Reports */}
      <div className="bg-[var(--card)] border border-[var(--border-primary)] rounded-xl p-6 text-left shadow-[var(--card-shadow)]">
        <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">Generate Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPORT_TYPES.map(report => (
            <div key={report.id} className="bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl p-4 flex items-start justify-between hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.07)] transition-all duration-250 group shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div>
                <div className="text-[var(--text-primary)] text-sm font-semibold">{report.label}</div>
                <div className="text-[var(--text-neutral-400)] text-[12px] mt-0.5 leading-normal">{report.description}</div>
              </div>
              <div className="flex gap-1.5 ml-2 flex-shrink-0">
                {['PDF', 'CSV'].map(fmt => (
                  <button key={fmt} onClick={() => handleExport(fmt)}
                    className="text-[11px] bg-[var(--card)] border border-[var(--border-primary)] hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)] text-[var(--text-primary)] px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-bold uppercase shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
