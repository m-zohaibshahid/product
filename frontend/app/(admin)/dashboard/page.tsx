'use client';
import React, { useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  ArrowRight, 
  AlertTriangle,
  PackageCheck,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingDown,
  Box,
  Activity,
  History,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

const chartData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5500 },
  { name: 'Thu', revenue: 4500 },
  { name: 'Fri', revenue: 7000 },
  { name: 'Sat', revenue: 6000 },
  { name: 'Sun', revenue: 8500 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Row */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-gray-500/30 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">Daily Overview</h1>
          <div className="flex items-center gap-3 mt-3 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
            <Clock className="w-4 h-4 text-blue-500" /> Status as of Oct 24, 2023 • 09:42 AM
          </div>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-gray-500 rounded-xl text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              <Calendar className="w-4 h-4" /> Live Feed
           </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link href="/reports" className="block hover:scale-[1.02] transition-transform">
          <StatCard 
            label="Today's Revenue" 
            value="$14,842.00" 
            subValue="+12% from yesterday"
            icon={DollarSign}
            variant="lowest"
          />
        </Link>
        <Link href="/inventory" className="block hover:scale-[1.02] transition-transform">
          <StatCard 
            label="Active Stock" 
            value="2,410" 
            subValue="Across 12 Categories"
            icon={Package}
            variant="lowest"
          />
        </Link>
        <Link href="/purchase-orders" className="block hover:scale-[1.02] transition-transform">
          <StatCard 
            label="Inbound" 
            value="18" 
            subValue="Expected by EOD"
            icon={PackageCheck}
            variant="lowest"
          />
        </Link>
      </div>

      {/* Analytics & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sales Velocity Chart */}
        <article className="lg:col-span-8 bg-white dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500 p-10 shadow-xl space-y-8 flex flex-col transition-colors duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic-elegant">Sales Velocity</h3>
              <p className="text-zinc-400 dark:text-white font-bold uppercase tracking-widest text-[10px] mt-1">Weekly performance across channels</p>
            </div>
            <div className="w-12 h-12 bg-zinc-50 dark:bg-gray-500 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          
          <div className="h-[340px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
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
                   contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                   cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Critical Alerts */}
        <article className="lg:col-span-4 bg-zinc-900 dark:bg-gray-500 rounded-[40px] p-10 shadow-2xl space-y-10 flex flex-col justify-between border border-transparent dark:border-gray-500 transition-colors duration-500">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic-elegant">Critical Alerts</h3>
            <p className="text-zinc-500 dark:text-white font-bold uppercase tracking-widest text-[9px]">Inventory attention required</p>
          </div>
          
          <div className="space-y-8">
            {[
              { label: 'Navy Wool Blazer', sub: '2 units remaining' },
              { label: 'Oxford White Shirt', sub: '5 units remaining' },
              { label: 'Italian Silk Tie', sub: 'Restocking soon' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                 <div className="w-10 h-10 rounded-2xl bg-gray-500/20 dark:bg-gray-500 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                    <AlertTriangle className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{alert.label}</p>
                    <p className="text-[9px] font-bold text-zinc-500 dark:text-white uppercase tracking-widest mt-0.5">{alert.sub}</p>
                 </div>
              </div>
            ))}
          </div>
          
          <Link href="/inventory" className="flex items-center justify-between group pt-8 border-t border-gray-500/20">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white transition-colors">View All Lifecycle Alerts</span>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
          </Link>
        </article>
      </div>

      {/* Transaction Feed */}
      <section className="bg-white dark:bg-gray-500 rounded-[40px] border border-zinc-100 dark:border-gray-500 shadow-xl overflow-hidden p-10 transition-colors duration-500">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-zinc-50 dark:border-gray-500/30">
           <div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic-elegant leading-none">Global Ledger Feed</h3>
              <p className="text-zinc-400 dark:text-white font-bold uppercase tracking-widest text-[10px] mt-1">Real-time settlement activity</p>
           </div>
           <button className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-white hover:text-zinc-900 dark:hover:text-white transition-all">Export Logs</button>
        </div>
        
        <div className="space-y-8">
           {[
             { ref: 'TRX-9821-A', cat: 'Bespoke Revenue', amt: '+$14,842.00', status: 'Settled', icon: Briefcase },
             { ref: 'EXP-4402-B', cat: 'Atelier Rent', amt: '-$2,100.00', status: 'Pending', icon: Activity },
             { ref: 'TRX-9710-C', cat: 'Fabric Order', amt: '-$8,450.00', status: 'Audited', icon: Package },
           ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-zinc-50 dark:bg-gray-500 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-white group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900 transition-all">
                       <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-zinc-400 dark:text-white uppercase tracking-widest font-black">{item.ref}</p>
                       <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.cat}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-12">
                    <div className="text-right">
                       <p className={`text-lg font-black ${item.amt.startsWith('-') ? 'text-red-500 dark:text-red-400' : 'text-zinc-900 dark:text-white'}`}>{item.amt}</p>
                       <p className="text-[9px] font-bold text-zinc-400 dark:text-white uppercase tracking-widest mt-0.5">{item.status}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-200 dark:text-white/30 group-hover:translate-x-1 group-hover:text-zinc-900 dark:group-hover:text-white transition-all" />
                 </div>
              </div>
           ))}
        </div>
      </section>
    </div>
  );
}
