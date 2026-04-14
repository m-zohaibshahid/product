'use client';
import React from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  CreditCard,
  Banknote,
  ChevronRight,
  TrendingUp,
  Activity,
  Receipt,
  FileText
} from 'lucide-react';

export default function TransactionsPage() {
  const TRANSACTIONS = [
    { id: 'TX-1002', customer: 'Ahmed Malik', type: 'Credit', amount: 'PKR 12,500', date: 'Oct 24, 2023 09:42 AM', status: 'Pending', method: 'Invoice' },
    { id: 'TX-1001', customer: 'Sarah Khan', type: 'Payment', amount: 'PKR 15,000', date: 'Oct 24, 2023 08:30 AM', status: 'Completed', method: 'Cash' },
    { id: 'TX-1000', customer: 'Zohaib Shahid', type: 'Credit', amount: 'PKR 45,000', date: 'Oct 23, 2023 04:15 PM', status: 'Pending', method: 'Invoice' },
    { id: 'TX-0999', customer: 'Ahmed Malik', type: 'Payment', amount: 'PKR 8,000', date: 'Oct 22, 2023 11:20 AM', status: 'Completed', method: 'Bank Transfer' },
    { id: 'TX-0998', customer: 'Mehmood Ali', type: 'Credit', amount: 'PKR 3,200', date: 'Oct 22, 2023 10:05 AM', status: 'Completed', method: 'Cash' },
    { id: 'TX-0997', customer: 'Fatima Zahra', type: 'Payment', amount: 'PKR 10,000', date: 'Oct 21, 2023 02:45 PM', status: 'Completed', method: 'Cheque' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Header Row */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-gray-500/30 pb-10">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">Master Ledger</h1>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time settlement & transaction registry</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-gray-500 text-zinc-600 dark:text-zinc-400 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all font-bold text-xs uppercase tracking-widest">
             <Download className="w-4 h-4" /> Export logs
           </button>
           <button className="bg-zinc-900 dark:bg-blue-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-zinc-200 dark:shadow-black/20 uppercase tracking-widest text-xs">
             <Calendar className="w-5 h-5" /> Filter Date
           </button>
        </div>
      </section>

      {/* Global Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Receivables', val: 'PKR 450,200', icon: ArrowUpRight, color: 'text-red-500' },
          { label: 'Settled Value', val: 'PKR 890,400', icon: ArrowDownLeft, color: 'text-green-500' },
          { label: 'Pending Invoices', val: '22 Items', icon: Receipt, color: 'text-blue-500' },
          { label: 'Velocity Index', val: '+ 440K', icon: TrendingUp, color: 'text-zinc-900 dark:text-white' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-500 p-8 rounded-[32px] border border-zinc-100 dark:border-gray-500/30 shadow-sm hover:shadow-xl transition-all group">
             <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 bg-zinc-50 dark:bg-gray-500 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <stat.icon className="w-5 h-5" />
                </div>
                <div className="px-3 py-1 bg-zinc-50 dark:bg-gray-500 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">Audited</div>
             </div>
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
             <p className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Registry Table Container */}
      <div className="bg-white dark:bg-gray-500 rounded-[48px] border border-zinc-100 dark:border-gray-500/30 shadow-xl overflow-hidden">
         <div className="p-10 border-b border-zinc-50 dark:border-gray-500/30 flex items-center justify-between gap-8">
            <div className="relative flex-1 max-w-xl">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 font-black" />
               <input type="text" placeholder="Search by Client, ID, or Reference..." className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-gray-500 rounded-2xl border-none outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-500 font-bold text-sm dark:text-white" />
            </div>
            <div className="flex gap-4">
              <div className="flex bg-zinc-50 dark:bg-gray-500 p-1.5 rounded-2xl">
                <button className="px-6 py-2.5 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Global Registry</button>
                <button className="px-6 py-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Credits</button>
              </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-zinc-50/50 dark:bg-gray-500/20 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-50 dark:border-gray-500/30">
                  <tr>
                     <th className="px-10 py-6">Event Context</th>
                     <th className="px-10 py-6 text-center">Protocol</th>
                     <th className="px-10 py-6">Instrument</th>
                     <th className="px-10 py-6 text-right">Settlement Sum</th>
                     <th className="px-10 py-6 text-right">Audit Status</th>
                     <th className="px-10 py-6"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {TRANSACTIONS.map((tx) => (
                     <tr key={tx.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all cursor-pointer group">
                        <td className="px-10 py-10">
                           <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{tx.customer}</p>
                           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Ref ID: {tx.id} • {tx.date}</p>
                        </td>
                        <td className="px-10 py-10 text-center">
                           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${tx.type === 'Credit' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20' : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20'}`}>
                              {tx.type === 'Credit' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                              <span className="text-[9px] font-black uppercase tracking-widest">{tx.type}</span>
                           </div>
                        </td>
                        <td className="px-10 py-10">
                           <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-tight">
                              {tx.method === 'Cash' ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                              {tx.method}
                           </div>
                        </td>
                        <td className="px-10 py-10 text-right">
                           <p className={`text-xl font-black ${tx.type === 'Credit' ? 'text-zinc-900 dark:text-white' : 'text-green-500'}`}>{tx.amount}</p>
                        </td>
                        <td className="px-10 py-10 text-right">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${tx.status === 'Completed' ? 'bg-zinc-900 text-white dark:bg-blue-600' : 'bg-zinc-50 dark:bg-gray-500 text-zinc-400'}`}>
                              {tx.status}
                           </span>
                        </td>
                        <td className="px-10 py-10 text-right">
                           <ChevronRight className="w-6 h-6 text-zinc-200 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-white transition-all transform group-hover:translate-x-2" />
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-10 border-t border-zinc-50 dark:border-gray-500/30 flex items-center justify-between bg-zinc-50/30 dark:bg-gray-500/10">
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Registry Display: 1–6 of 1,240 Entries</p>
            <div className="flex gap-4">
              <button className="px-6 py-3 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-zinc-400">Prior Page</button>
              <button className="px-6 py-3 bg-zinc-900 dark:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl dark:shadow-blue-600/20">Next Protocol</button>
            </div>
         </div>
      </div>
    </div>
  );
}
