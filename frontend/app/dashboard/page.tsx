'use client';

import React from 'react';
import StatCard from '@/components/ui/StatCard';
import AlertItem from '@/components/ui/AlertItem';
import TransactionItem from '@/components/ui/TransactionItem';
import { 
  TrendingUp, 
  Package, 
  PackageCheck, 
  Clock, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export default function Dashboard() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="display-md text-primary tracking-tight mb-2 italic-elegant opacity-90">Daily Overview</h2>
          <div className="flex items-center gap-2 text-on-surface-variant/70 label-md text-xs font-semibold uppercase tracking-widest leading-none">
            <Clock className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Status as of Oct 24, 2023 • 09:42 AM</span>
          </div>
        </div>
      </section>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatCard 
          label="Today's Revenue" 
          value="$14,842.00" 
          subValue="+12% from yesterday"
          icon={TrendingUp}
          variant="lowest"
        />
        <StatCard 
          label="Active Stock" 
          value="2,410" 
          subValue="Across 12 Categories"
          icon={Package}
          variant="lowest"
        />
        <StatCard 
          label="Inbound" 
          value="18" 
          subValue="Expected by EOD"
          icon={PackageCheck}
          variant="lowest"
        />
      </div>

      {/* Main Grid: Data & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        {/* Sales Velocity Chart Card */}
        <article className="lg:col-span-12 xl:col-span-8 p-10 bg-surface-container-lowest rounded-xl ambient-shadow flex flex-col gap-8 transition-all hover:translate-y-[-4px] group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="title-lg text-primary tracking-tight mb-1 opacity-90">Sales Velocity</h3>
              <p className="text-on-surface-variant/70 text-xs uppercase tracking-widest font-semibold font-medium leading-none">Weekly trend across all channels</p>
            </div>
            <div className="p-3 rounded-full bg-surface-container-low text-primary/70 group-hover:scale-110 transition-transform cursor-pointer">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          
          <div className="h-[320px] w-full pt-4 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004385" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#004385" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#424750', fontSize: 11, fontWeight: 500 }}
                  interval="preserveStartEnd"
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '12px 16px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#002d5d" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Critical Alerts Row or List */}
        <article className="lg:col-span-12 xl:col-span-4 p-10 bg-surface-container-low rounded-xl flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="title-lg text-primary tracking-tight mb-1 opacity-90 underline-offset-8 decoration-outline-variant/30 decoration-2">Critical Alerts</h3>
              <p className="text-on-surface-variant/70 text-xs uppercase tracking-widest font-semibold font-medium leading-none">Stock level attention required</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-10 px-2 py-4">
            <AlertItem label="Navy Wool Blazer" subValue="2 units remaining" />
            <AlertItem label="Classic Oxford White" subValue="5 units remaining" />
            <AlertItem label="Italian Silk Tie - Red" subValue="Restocking soon" />
          </div>
          
          <div className="mt-auto group cursor-pointer pt-6 flex items-center gap-3 text-primary label-md text-xs tracking-widest font-bold">
            <span>View All Stock Alerts</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
          </div>
        </article>
      </div>

      {/* Recent Transactions List Card */}
      <section className="pt-8">
        <div className="p-10 bg-surface-container-lowest rounded-xl ambient-shadow w-full flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="title-lg text-primary tracking-tight mb-1 opacity-90">Recent Transactions</h3>
              <p className="text-on-surface-variant/70 text-xs uppercase tracking-widest font-semibold font-medium leading-none">Seamlessly tracking atelier activity</p>
            </div>
            <button className="text-xs font-bold text-primary opacity-60 hover:opacity-100 transition-opacity uppercase tracking-widest">Clear Log</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <TransactionItem 
              label="Sale #2311 - Julian Reed" 
              subLabel="Navy Wool Blazer x 2, Silk Tie x 1" 
              time="09:42 AM" 
              type="sale"
            />
            <TransactionItem 
              label="Restock - Italian Fabric Source" 
              subLabel="Tweed Wool, 45 Meters" 
              time="08:20 AM" 
              type="restock"
            />
            <TransactionItem 
              label="Return #1982 - Private Collection" 
              subLabel="Classic Oxford White (L), Defective Fit" 
              time="Yesterday" 
              type="return"
            />
            <TransactionItem 
              label="Stock Transfer - Downtown Showroom" 
              subLabel="Formal Socks x 40 Pairs" 
              time="Yesterday" 
              type="transfer"
            />
          </div>
        </div>
      </section>
      
      {/* Footer Branding */}
      <footer className="pt-20 text-center opacity-30 select-none pointer-events-none">
        <p className="label-md text-[10px] tracking-widest text-primary leading-loose">Crafted for Excellence • The Digital Tailor Inventory Systems v4.2</p>
      </footer>
    </div>
  );
}
