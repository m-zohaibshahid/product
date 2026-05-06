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
  Activity,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useGetAlertsQuery, useGetDashboardQuery, useGetKhataDashboardQuery, useGetKhataTransactionsQuery } from '@/store/services/inventoryApi';

export default function DashboardPage() {
  const [dashboardRange, setDashboardRange] = useState<1 | 7 | 30>(1);
  const { data: inventoryDashboard = {} } = useGetDashboardQuery();
  const { data: alertsData = { critical: [], warning: [] } } = useGetAlertsQuery();
  const summaryDays = dashboardRange;
  const { data: dailyKhata = {} } = useGetKhataDashboardQuery({ days: summaryDays });
  const { data: ledgerTransactions = [] } = useGetKhataTransactionsQuery({ page: 1, limit: 100 });

  const dailyPayload = ((dailyKhata as any)?.data ?? dailyKhata) as any;
  const dailySummary = dailyPayload?.periodSummary ?? dailyPayload?.period_summary ?? {};
  const todayRevenue = Number(dailySummary?.netSales ?? dailySummary?.net_sales ?? 0);
  const todayDiscount = Number(dailySummary?.discountGiven ?? dailySummary?.discount_given ?? 0);
  const grossSales = Number(dailySummary?.grossSales ?? dailySummary?.gross_sales ?? 0);
  const ledgerDue = Number(dailySummary?.ledgerDue ?? dailySummary?.ledger_due ?? 0);
  const onlineReceived = Number(dailySummary?.onlineReceived ?? dailySummary?.online_received ?? 0);
  const expectedCashInHand = Number(dailySummary?.expectedCashInHand ?? dailySummary?.expected_cash_in_hand ?? 0);
  const expectedAccountBalance = Number(dailySummary?.expectedAccountBalance ?? dailySummary?.expected_account_balance ?? 0);

  const activeVariantCount = Number((inventoryDashboard as any)?.totalSkus ?? 0);
  const inboundCount = Number((inventoryDashboard as any)?.inboundThisWeek ?? 0);

  const alertRows = [
    ...((alertsData as any)?.critical ?? []),
    ...((alertsData as any)?.warning ?? []),
  ].slice(0, 3);
  const rangeLabel = dashboardRange === 1 ? 'Daily' : dashboardRange === 7 ? 'Weekly' : 'Monthly';

  const chartData = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const dayBuckets = Array.from({ length: 7 }).map((_, index) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - index));
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      return { key, name: days[d.getDay()], revenue: 0 };
    });

    const bucketMap = new Map(dayBuckets.map((d) => [d.key, d]));
    (ledgerTransactions as any[]).forEach((tx) => {
      if (String(tx?.type || '').toUpperCase() !== 'DEBIT') return;
      const amount = Number(tx?.amount ?? 0);
      const date = new Date(tx?.date || tx?.createdAt || '');
      if (!Number.isFinite(amount) || Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const bucket = bucketMap.get(key);
      if (bucket) bucket.revenue += amount;
    });

    return dayBuckets.map(({ name, revenue }) => ({ name, revenue: Math.round(revenue * 100) / 100 }));
  }, [ledgerTransactions]);

  const feedRows = React.useMemo(() => {
    return (ledgerTransactions as any[]).slice(0, 6).map((tx) => {
      const isDebit = String(tx?.type || '').toUpperCase() === 'DEBIT';
      return {
        ref: String(tx?.id || tx?.reference || 'N/A'),
        cat: String(tx?.remarks || (isDebit ? 'Ledger Sale' : 'Payment Received')),
        amt: `${isDebit ? '+' : '-'}Rs ${Number(tx?.amount || 0).toLocaleString()}`,
        status: String(tx?.status || 'Recorded'),
        icon: isDebit ? Briefcase : Activity,
        isNegative: !isDebit,
      };
    });
  }, [ledgerTransactions]);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Row */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-gray-500/30 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">{rangeLabel} Overview</h1>
          <div className="flex items-center gap-3 mt-3 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
            <Clock className="w-4 h-4 text-blue-500" /> Status as of Oct 24, 2023 • 09:42 AM
          </div>
        </div>
        <div className="flex gap-4 items-center">
           <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-gray-500 rounded-xl text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              <Calendar className="w-4 h-4" /> Live Feed
           </div>
           <div className="flex bg-zinc-50 dark:bg-gray-500 p-1 rounded-xl">
             {[
               { id: 1 as const, label: 'Daily' },
               { id: 7 as const, label: 'Weekly' },
               { id: 30 as const, label: 'Monthly' },
             ].map((range) => (
               <button
                 key={range.id}
                 onClick={() => setDashboardRange(range.id)}
                 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                   dashboardRange === range.id
                     ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow'
                     : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-100'
                 }`}
               >
                 {range.label}
               </button>
             ))}
           </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <Link href="/reports" className="block hover:scale-[1.02] transition-transform">
          <StatCard 
            label="Total Sale Target" 
            value={`Rs ${grossSales.toLocaleString()}`}
            subValue={`Last ${summaryDays} days gross sale`}
            icon={DollarSign}
            variant="lowest"
          />
        </Link>
        <Link href="/reports" className="block hover:scale-[1.02] transition-transform">
          <StatCard
            label="Discount Given"
            value={`Rs ${todayDiscount.toLocaleString()}`}
            subValue="Total discount on target sale"
            icon={Activity}
            variant="lowest"
          />
        </Link>
        <Link href="/reports" className="block hover:scale-[1.02] transition-transform">
          <StatCard
            label="Final Net Sale"
            value={`Rs ${todayRevenue.toLocaleString()}`}
            subValue="Gross sale minus discount"
            icon={TrendingUp}
            variant="lowest"
          />
        </Link>
        <Link href="/reports" className="block hover:scale-[1.02] transition-transform">
          <StatCard
            label="Online Collected"
            value={`Rs ${onlineReceived.toLocaleString()}`}
            subValue="Received through online/account"
            icon={PackageCheck}
            variant="lowest"
          />
        </Link>
        <Link href="/khata" className="block hover:scale-[1.02] transition-transform">
          <StatCard
            label="Ledger Due"
            value={`Rs ${ledgerDue.toLocaleString()}`}
            subValue="Remaining receivable on ledger"
            icon={Briefcase}
            variant="lowest"
          />
        </Link>
        <Link href="/inventory" className="block hover:scale-[1.02] transition-transform">
          <StatCard 
            label="Active Stock" 
            value={activeVariantCount.toLocaleString()}
            subValue="Total active variants"
            icon={Package}
            variant="lowest"
          />
        </Link>
        <Link href="/reports" className="block hover:scale-[1.02] transition-transform">
          <StatCard
            label="Expected Cash In Hand"
            value={`Rs ${expectedCashInHand.toLocaleString()}`}
            subValue="Cash that should be physically available"
            icon={DollarSign}
            variant="lowest"
          />
        </Link>
        <Link href="/reports" className="block hover:scale-[1.02] transition-transform">
          <StatCard
            label="Expected Bank Balance"
            value={`Rs ${expectedAccountBalance.toLocaleString()}`}
            subValue="Amount that should be in account"
            icon={Calendar}
            variant="lowest"
          />
        </Link>
        <Link href="/purchase-orders" className="block hover:scale-[1.02] transition-transform">
          <StatCard 
            label="Inbound" 
            value={inboundCount.toLocaleString()}
            subValue="Items recorded this week"
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
              <p className="text-zinc-400 dark:text-white font-bold uppercase tracking-widest text-[10px] mt-1">{rangeLabel} performance across channels</p>
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
            {alertRows.length > 0 ? alertRows.map((alert: any, i: number) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                 <div className="w-10 h-10 rounded-2xl bg-gray-500/20 dark:bg-gray-500 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                    <AlertTriangle className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                      {String(alert.productName ?? alert.sku ?? 'Low Stock Item')}
                    </p>
                    <p className="text-[9px] font-bold text-zinc-500 dark:text-white uppercase tracking-widest mt-0.5">
                      {`${String(alert.sku ?? 'N/A')} • ${Number(alert.stock ?? 0)} units remaining`}
                    </p>
                 </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-white/15 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  No critical alerts right now
                </p>
              </div>
            )}
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
           {feedRows.length > 0 ? feedRows.map((item, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-zinc-50 dark:bg-gray-500 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-white group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900 transition-all">
                       <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 dark:text-white uppercase tracking-widest">{item.ref}</p>
                       <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.cat}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className={`text-lg font-black ${item.isNegative ? 'text-red-500 dark:text-red-400' : 'text-zinc-900 dark:text-white'}`}>{item.amt}</p>
                       <p className="text-[9px] font-bold text-zinc-400 dark:text-white uppercase tracking-widest mt-0.5">{item.status}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-200 dark:text-white/30 group-hover:translate-x-1 group-hover:text-zinc-900 dark:group-hover:text-white transition-all" />
                 </div>
              </div>
           )) : (
             <div className="rounded-2xl border border-zinc-100 dark:border-zinc-700 p-6">
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-300">
                 No live ledger activity available
               </p>
             </div>
           )}
        </div>
      </section>
    </div>
  );
}
