'use client';

import React from 'react';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const barData = [
  { name: 'Apr', revenue: 12000, expense: 8000 },
  { name: 'May', revenue: 15000, expense: 9000 },
  { name: 'Jun', revenue: 11000, expense: 7500 },
  { name: 'Jul', revenue: 18000, expense: 10000 },
  { name: 'Aug', revenue: 22000, expense: 11500 },
  { name: 'Sep', revenue: 24580, expense: 12210 },
];

const pieData = [
  { name: 'Tailored Suits', value: 45 },
  { name: 'Fine Fabrics', value: 30 },
  { name: 'Accessories', value: 15 },
  { name: 'Bespoke Services', value: 10 },
];

const COLORS = ['#002d5d', '#7c5071', '#3d2539', '#85b2fb'];

export default function ReportsPage() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="display-md text-primary tracking-tight mb-2 italic-elegant opacity-90">Accounting & Reports</h2>
          <div className="flex items-center gap-2 text-on-surface-variant/70 label-md text-xs font-semibold uppercase tracking-widest leading-none">
            <BarChart3 className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Fiscal Year 2024 • Q3 Performance Overview</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="tertiary" size="sm" icon={Calendar}>Quarterly</Button>
          <Button variant="primary" size="md" icon={Download}>Export Report</Button>
        </div>
      </section>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatCard 
          label="Total Revenue" 
          value="$124,580.00" 
          subValue="+18.4% YoY"
          icon={ArrowUpRight}
          variant="lowest"
        />
        <StatCard 
          label="Total Expenses" 
          value="$45,210.00" 
          subValue="-2.1% from Q2"
          icon={ArrowDownRight}
          variant="lowest"
        />
        <StatCard 
          label="Net Profit" 
          value="$79,370.00" 
          subValue="63.7% Margin"
          icon={TrendingUp}
          variant="lowest"
        />
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        {/* Growth Analysis */}
        <article className="lg:col-span-8 p-10 bg-surface-container-lowest rounded-xl ambient-shadow flex flex-col gap-8 transition-all hover:translate-y-[-4px] group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="title-lg text-primary tracking-tight mb-1 opacity-90">Monthly Growth Analysis</h3>
              <p className="text-on-surface-variant/70 text-xs uppercase tracking-widest font-semibold font-medium leading-none">Sales performance comparison (6 Months)</p>
            </div>
          </div>
          
          <div className="h-[340px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#424750', fontSize: 11, fontWeight: 500 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                <Bar dataKey="revenue" fill="#002d5d" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="expense" fill="#7c5071" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Category Breakdown */}
        <article className="lg:col-span-4 p-10 bg-surface-container-low rounded-xl flex flex-col gap-10">
          <div>
            <h3 className="title-lg text-primary tracking-tight mb-1 opacity-90">Sales by Category</h3>
            <p className="text-on-surface-variant/70 text-xs uppercase tracking-widest font-semibold font-medium leading-none">Revenue share per fabric class</p>
          </div>
          
          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      {/* Financial Table */}
      <section className="pt-8">
        <div className="p-10 bg-surface-container-lowest rounded-xl ambient-shadow w-full flex flex-col gap-10">
          <div>
            <h3 className="title-lg text-primary tracking-tight mb-1 opacity-90">Recent Financial Activity</h3>
            <p className="text-on-surface-variant/70 text-xs uppercase tracking-widest font-semibold font-medium leading-none">Audited records from the master ledger</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-primary/40 border-b border-outline-variant/10">Reference</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-primary/40 border-b border-outline-variant/10">Category</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-primary/40 border-b border-outline-variant/10 text-right">Amount</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-primary/40 border-b border-outline-variant/10 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {[
                  { ref: 'TRX-9821-A', cat: 'Sales Revenue', amt: '$14,842.00', status: 'Cleared' },
                  { ref: 'EXP-4402-B', cat: 'Utility & Rent', amt: '-$2,100.00', status: 'Pending' },
                  { ref: 'TRX-9710-C', cat: 'Inventory Purchase', amt: '-$8,450.00', status: 'Audited' },
                  { ref: 'TRX-9621-D', cat: 'Service Fee', amt: '$1,200.00', status: 'Cleared' },
                ].map((item) => (
                  <tr key={item.ref} className="group hover:bg-surface-container-low/20 transition-colors">
                    <td className="py-6">
                      <span className="text-xs font-mono font-bold text-secondary">{item.ref}</span>
                    </td>
                    <td className="py-6">
                      <span className="text-sm font-semibold text-primary">{item.cat}</span>
                    </td>
                    <td className="py-6 text-right">
                      <span className={`text-sm font-bold ${item.amt.startsWith('-') ? 'text-error' : 'text-primary'}`}>{item.amt}</span>
                    </td>
                    <td className="py-6 text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-surface-container-low rounded-full opacity-60">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="pt-20 text-center opacity-30 select-none pointer-events-none">
        <p className="label-md text-[10px] tracking-widest text-primary leading-loose">© 2024 The Digital Tailor • Precision Accounting Engine v2.4-Audited</p>
      </footer>
    </div>
  );
}
