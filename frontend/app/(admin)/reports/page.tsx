'use client';
import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  PieChart as PieIcon,
  ChevronRight,
  DollarSign,
  Briefcase,
  Activity,
  ArrowLeft,
  Search,
  Filter,
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import Toast from '@/components/ui/Toast';

const barData = [
  { name: 'Jan', revenue: 8000, margin: 4500 },
  { name: 'Feb', revenue: 9500, margin: 5200 },
  { name: 'Mar', revenue: 12000, margin: 7000 },
  { name: 'Apr', revenue: 15000, margin: 9000 },
  { name: 'May', revenue: 11000, margin: 6500 },
  { name: 'Jun', revenue: 18000, margin: 10500 },
];

const pieData = [
  { name: 'Bespoke Suits', value: 45 },
  { name: 'Luxury Fabrics', value: 30 },
  { name: 'Accessories', value: 15 },
  { name: 'Services', value: 10 },
];

const COLORS = ['#18181b', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function ReportsPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleExport = () => {
    setToastMsg('Fiscal report generated and downloaded.');
    setShowToast(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-16 animate-fade-in">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 dark:border-gray-500/30 pb-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-gray-500 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 text-blue-500" /> Audited Financials
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">Atelier Intelligence</h1>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Fiscal Year 2024 • Performance & Accounting Analytics</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-gray-500 text-zinc-900 dark:text-white rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all font-bold text-xs uppercase tracking-widest">
             <Calendar className="w-4 h-4 text-zinc-400" /> Quarterly
           </button>
           <button 
             onClick={handleExport}
             className="bg-zinc-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-zinc-200 dark:shadow-black/20 uppercase tracking-widest text-xs"
           >
             <Download className="w-5 h-5" /> Export Ledger
           </button>
        </div>
      </section>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Gross Revenue', val: '$284.5k', change: '+12.4%', up: true, icon: DollarSign },
          { label: 'Net Margin', val: '64.2%', change: '+3.1%', up: true, icon: Activity },
          { label: 'Aquisition Cost', val: '$102.1k', change: '-4.8%', up: false, icon: Briefcase },
          { label: 'Customer LTV', val: '$4.2k', change: '+15.2%', up: true, icon: TrendingUp },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-gray-500 p-8 rounded-[32px] border border-zinc-100 dark:border-gray-500/30 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-6">
               <div className="w-12 h-12 bg-zinc-50 dark:bg-gray-500 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 transition-all">
                  <kpi.icon className="w-6 h-6 group-hover:text-white" />
               </div>
               <div className={`flex items-center gap-1 font-bold text-[10px] uppercase tracking-tighter ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
               </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{kpi.val}</p>
          </div>
        ))}
      </div>

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="lg:col-span-8 bg-white dark:bg-gray-500 rounded-[48px] border border-zinc-100 dark:border-gray-500/30 shadow-xl p-12 flex flex-col gap-10">
           <div className="flex items-center justify-between">
              <div>
                 <h2 className="text-2xl font-black text-zinc-900 dark:text-white italic-elegant uppercase tracking-tighter">Growth Velocity</h2>
                 <p className="text-zinc-400 font-medium text-xs">Bi-annual revenue vs gross margin evaluation.</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-blue-500"></div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Revenue</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Margin</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[400px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={barData}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: '#fff' }}
                       cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="margin" stroke="#a1a1aa" strokeWidth={2} strokeDasharray="10 10" fill="transparent" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </article>

        <article className="lg:col-span-4 bg-zinc-900 rounded-[48px] shadow-2xl p-12 text-white flex flex-col justify-between">
           <div className="space-y-1">
              <h2 className="text-2xl font-black italic-elegant uppercase tracking-tighter leading-none">Category <br /> Concentration</h2>
              <p className="text-zinc-500 font-medium text-xs">Revenue share per asset class.</p>
           </div>
           
           <div className="h-[280px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={pieData}
                       innerRadius={70}
                       outerRadius={90}
                       paddingAngle={8}
                       dataKey="value"
                    >
                       {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>

           <div className="space-y-4 pt-4 border-t border-zinc-800">
              {pieData.map((p, i) => (
                 <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }}></div>
                       <span className="text-zinc-400">{p.name}</span>
                    </div>
                    <span>{p.value}%</span>
                 </div>
              ))}
           </div>
        </article>
      </div>

      {/* Audit Logs */}
      <section className="bg-white dark:bg-gray-500 rounded-[48px] border border-zinc-100 dark:border-gray-500/30 shadow-xl overflow-hidden mt-12 pb-10">
        <div className="p-10 border-b border-zinc-50 dark:border-gray-500/30 flex items-center justify-between">
           <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic-elegant">Master Audit Registry</h3>
              <p className="text-zinc-400 font-medium text-xs">Immutable financial records for H2 2024.</p>
           </div>
           <div className="flex gap-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                 <input type="text" placeholder="Search logs..." className="pl-10 pr-4 py-3 bg-zinc-50 dark:bg-gray-500 rounded-xl text-xs font-bold outline-none border-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-500" />
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-zinc-50/50 dark:bg-gray-500/20 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                 <tr>
                    <th className="px-10 py-6">Transaction Ref</th>
                    <th className="px-10 py-6">Ledger Class</th>
                    <th className="px-10 py-6 text-right">Audit Value</th>
                    <th className="px-10 py-6 text-center">Status</th>
                    <th className="px-10 py-6 text-right"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                 {[
                    { ref: 'AUDIT-8810-X', cat: 'Bespoke Revenue', amt: '+$18,042.00', status: 'Verified', date: 'Oct 24' },
                    { ref: 'AUDIT-2231-Y', cat: 'Inventory Restock', amt: '-$4,550.00', status: 'Pending', date: 'Oct 23' },
                    { ref: 'AUDIT-1102-Z', cat: 'Service Settlement', amt: '+$2,100.00', status: 'Verified', date: 'Oct 22' },
                    { ref: 'AUDIT-4491-M', cat: 'Atelier Utility', amt: '-$890.00', status: 'On-Hold', date: 'Oct 21' },
                 ].map((item, idx) => (
                    <tr key={idx} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all cursor-pointer">
                       <td className="px-10 py-8">
                          <p className="text-xs font-mono font-bold text-zinc-400 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.ref}</p>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{item.date}</p>
                       </td>
                       <td className="px-10 py-8">
                          <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.cat}</p>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <span className={`text-xl font-black ${item.amt.startsWith('-') ? 'text-red-500' : 'text-zinc-900 dark:text-white'}`}>{item.amt}</span>
                       </td>
                       <td className="px-10 py-8 text-center">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${item.status === 'Verified' ? 'bg-zinc-900 text-white dark:bg-blue-600' : 'bg-zinc-100 dark:bg-gray-500 text-zinc-400'}`}>
                             {item.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                             {item.status}
                          </div>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <ChevronRight className="w-6 h-6 text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-all transform group-hover:translate-x-2" />
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </section>

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
        type="success" 
      />
    </div>
  );
}
