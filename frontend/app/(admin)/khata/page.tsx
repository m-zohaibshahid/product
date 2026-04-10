'use client';
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  UserPlus, 
  Filter, 
  Download, 
  ArrowLeft, 
  Wallet, 
  ShoppingCart, 
  History,
  CheckCircle2,
  X,
  User as UserIcon,
  LifeBuoy,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Banknote,
  Receipt,
  MapPin,
  Phone,
  ChevronRight,
  TrendingDown,
  Activity
} from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function KhataPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'customers' | 'transactions'>('customers');
  const [actionType, setActionType] = useState<'payment' | 'credit'>('payment');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleSave = () => {
    setToastMsg(actionType === 'payment' ? 'Payment recorded successfully!' : 'Credit assigned to customer!');
    setShowToast(true);
  };

  const CUSTOMERS = [
    { 
      id: 'CUST-8821', 
      name: 'Ahmed Malik', 
      balance: 12400, 
      lastActive: '2 hours ago', 
      status: 'Payable',
      address: 'House #42, Street 7, Gulberg III, Lahore',
      phone: '+92 321 4455667'
    },
    { 
      id: 'CUST-9012', 
      name: 'Sarah Khan', 
      balance: 0, 
      lastActive: 'Yesterday', 
      status: 'Clear',
      address: 'Apartment 4B, Elite Heights, DHA Phase 5, Karachi',
      phone: '+92 300 1122334'
    },
    { 
      id: 'CUST-3342', 
      name: 'Zohaib Shahid', 
      balance: 45000, 
      lastActive: '3 days ago', 
      status: 'Payable',
      address: 'Plot 18, Sector F-7/2, Islamabad',
      phone: '+92 333 9988776'
    },
  ];

  const ALL_TRANSACTIONS = [
    { id: 'TX-1002', customer: 'Ahmed Malik', type: 'Credit', amount: 'PKR 12,500', date: 'Oct 24, 09:42 AM', status: 'Pending', method: 'Invoice' },
    { id: 'TX-1001', customer: 'Sarah Khan', type: 'Payment', amount: 'PKR 15,000', date: 'Oct 24, 08:30 AM', status: 'Completed', method: 'Cash' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      {!selectedUser ? (
        <div className="space-y-12">
          {/* Header Row */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-10">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">Khata Ledger</h1>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">Personal Collection & Credit Management</p>
            </div>
            <div className="flex bg-zinc-50 dark:bg-zinc-800 p-1.5 rounded-[24px]">
              <button 
                onClick={() => setActiveTab('customers')} 
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'customers' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                <Users className="w-4 h-4" /> Clients
              </button>
              <button 
                onClick={() => setActiveTab('transactions')} 
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                <Activity className="w-4 h-4" /> Registry
              </button>
            </div>
          </section>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Total Receivables', val: 'PKR 124,500', icon: TrendingDown, color: 'text-red-500' },
              { label: 'Settled Today', val: 'PKR 15,000', icon: Wallet, color: 'text-green-500' },
              { label: 'Risk Factor', val: 'Low (2%)', icon: LifeBuoy, color: 'text-blue-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between mb-8">
                   <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <div className="px-3 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">Audited</div>
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
             <div className="p-10 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between gap-8">
                <div className="relative flex-1 max-w-xl">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                   <input type="text" placeholder="Search by Client Name or ID..." className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-none outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-500 font-bold text-sm" />
                </div>
                <button className="bg-zinc-900 dark:bg-blue-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-zinc-200 dark:shadow-black/20 uppercase tracking-widest text-xs">
                   <UserPlus className="w-4 h-4" /> New Account
                </button>
             </div>

             <table className="w-full text-left">
                <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-50 dark:border-zinc-800">
                   <tr>
                      <th className="px-10 py-6">Client Identity</th>
                      <th className="px-10 py-6 text-center">Status Matrix</th>
                      <th className="px-10 py-6 text-right">Commitment Value</th>
                      <th className="px-10 py-6"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                   {(activeTab === 'customers' ? CUSTOMERS : ALL_TRANSACTIONS).map((item: any, idx) => (
                      <tr key={idx} onClick={() => setSelectedUser(item)} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all cursor-pointer group">
                         <td className="px-10 py-10">
                            <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                               {activeTab === 'customers' ? item.name : item.customer}
                            </p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">REF-ID: {item.id}</p>
                         </td>
                         <td className="px-10 py-10 text-center">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${activeTab === 'customers' && item.balance > 0 ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-400' : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:text-green-400'}`}>
                               <span className="text-[10px] font-black uppercase tracking-widest">{activeTab === 'customers' ? item.status : item.type}</span>
                            </div>
                         </td>
                         <td className="px-10 py-10 text-right">
                            <p className={`text-xl font-black ${activeTab === 'customers' && item.balance > 0 ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                               {activeTab === 'customers' ? `PKR ${item.balance.toLocaleString()}` : item.amount}
                            </p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{item.lastActive || item.date}</p>
                         </td>
                         <td className="px-10 py-10 text-right">
                            <ChevronRight className="w-6 h-6 text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-all transform group-hover:translate-x-2" />
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      ) : (
        /* ACCOUNT DETAIL VIEW */
        <div className="max-w-[1400px] mx-auto animate-slide-in pb-20 space-y-12">
           <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedUser(null)}
                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></div>
                Back to Ledger
              </button>
              <div className="flex bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-100 dark:border-zinc-800 px-6 py-3 items-center gap-4 group cursor-pointer hover:border-blue-600 transition-all">
                 <div className="text-right">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Outstanding Commitment</p>
                    <p className="text-xl font-black text-red-500 tracking-tighter italic-elegant">PKR {selectedUser.balance?.toLocaleString() || '0'}</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Account Profile Header */}
              <div className="lg:col-span-12">
                 <div className="bg-zinc-900 dark:bg-blue-900 rounded-[56px] p-12 md:p-16 text-white relative overflow-hidden group shadow-2xl">
                    <History className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                       <div className="space-y-6">
                          <div className="flex gap-3">
                             <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">VIP Client</span>
                             <span className="px-4 py-1.5 bg-white/10 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10">{selectedUser.id}</span>
                          </div>
                          <h2 className="text-6xl md:text-8xl font-black italic-elegant tracking-tighter leading-none">{selectedUser.name}</h2>
                          <div className="flex flex-wrap gap-6 pt-6 border-t border-white/10">
                             <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                <Phone className="w-5 h-5 text-blue-400" />
                                <span className="text-sm font-black">{selectedUser.phone}</span>
                             </div>
                             <a 
                               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedUser.address)}`}
                               target="_blank"
                               className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 hover:bg-white/10 transition-all font-black text-sm"
                             >
                                <MapPin className="w-5 h-5 text-red-400" /> {selectedUser.address}
                             </a>
                          </div>
                       </div>
                       <div className="text-right space-y-4">
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Audit Health Color</p>
                          <div className="flex gap-2 justify-end">
                             <div className="w-12 h-2 bg-blue-500 rounded-full" />
                             <div className="w-12 h-2 bg-white/20 rounded-full" />
                             <div className="w-12 h-2 bg-white/20 rounded-full" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Transactions Form */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-10">
                 <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-xl p-12 space-y-12">
                    <div className="space-y-8">
                       <h3 className="text-xs font-black uppercase tracking-tighter text-zinc-400 italic flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><Activity className="w-4 h-4 text-zinc-900 dark:text-white" /> Action Protocol</h3>
                       <div className="grid grid-cols-2 gap-4">
                          <button 
                             onClick={() => setActionType('payment')}
                             className={`py-10 rounded-[40px] border-2 font-black text-xs uppercase tracking-[0.2em] flex flex-col items-center gap-4 transition-all ${actionType === 'payment' ? 'border-zinc-900 bg-zinc-900 text-white dark:border-blue-600 dark:bg-blue-600 shadow-2xl' : 'border-zinc-50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:border-zinc-200'}`}
                          >
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${actionType === 'payment' ? 'bg-white/20' : 'bg-white dark:bg-zinc-700'}`}><Wallet className="w-6 h-6" /></div>
                             Receive Cash
                          </button>
                          <button 
                             onClick={() => setActionType('credit')}
                             className={`py-10 rounded-[40px] border-2 font-black text-xs uppercase tracking-[0.2em] flex flex-col items-center gap-4 transition-all ${actionType === 'credit' ? 'border-zinc-900 bg-zinc-900 text-white dark:border-blue-600 dark:bg-blue-600 shadow-2xl' : 'border-zinc-50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:border-zinc-200'}`}
                          >
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${actionType === 'credit' ? 'bg-white/20' : 'bg-white dark:bg-zinc-700'}`}><ShoppingCart className="w-6 h-6" /> Assign Credit</div>
                          </button>
                       </div>
                    </div>

                    <div className="space-y-8">
                        {actionType === 'credit' ? (
                          <div className="animate-fade-in space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Product Attribution</label>
                            <div className="relative">
                               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 font-black" />
                               <input type="text" placeholder="Select Bespoke Product..." className="w-full pl-14 pr-6 py-6 bg-zinc-50 dark:bg-zinc-800 border-none rounded-[28px] focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-600 outline-none text-sm font-bold dark:text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="animate-fade-in space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-2">Settlement Value</label>
                            <div className="relative">
                               <span className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-300 font-black text-2xl tracking-tighter">PKR</span>
                               <input type="number" placeholder="00.00" className="w-full pl-24 pr-8 py-8 bg-zinc-50 dark:bg-zinc-800 text-5xl font-black text-zinc-900 dark:text-white tracking-tighter border-none rounded-[40px] focus:ring-2 focus:ring-blue-600 outline-none placeholder:text-zinc-200 dark:placeholder:text-zinc-700" />
                            </div>
                          </div>
                        )}
                    </div>

                    <button 
                       onClick={handleSave}
                       className="w-full py-8 bg-zinc-900 dark:bg-blue-600 text-white rounded-[40px] font-black uppercase tracking-[0.5em] text-xs transition-all shadow-2xl hover:bg-black dark:hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4"
                    >
                       Confirm Settlement <CheckCircle2 className="w-6 h-6" />
                    </button>
                 </div>
              </div>

              {/* Personal Activity Ledger Table */}
              <div className="lg:col-span-12 xl:col-span-7">
                 <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
                    <div className="p-10 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                       <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-[0.3em] italic-elegant">Chronological Ledger</h3>
                       <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all"><Download className="w-4 h-4" /> PDF Registry</button>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                       <table className="w-full text-left">
                          <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-50 dark:border-zinc-800">
                             <tr>
                                <th className="px-10 py-6">Event Stamp</th>
                                <th className="px-10 py-6">Attribute</th>
                                <th className="px-10 py-6 text-right">Value Delta</th>
                                <th className="px-10 py-6 text-right">Ledger Sum</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                             {[
                                { date: '24 Oct, 23', desc: 'Silk Drape (2m)', type: 'Credit', amount: '+12,500', balance: '12,500', up: false },
                                { date: '18 Oct, 23', desc: 'Cash Collection', type: 'Payment', amount: '-15,000', balance: '0', up: true },
                                { date: '12 Oct, 23', desc: 'Suit Lining #INV', type: 'Credit', amount: '+8,200', balance: '15,000', up: false },
                                { date: '05 Oct, 23', desc: 'Manual Entry', type: 'Credit', amount: '+6,800', balance: '6,800', up: false },
                             ].map((h, i) => (
                                <tr key={i} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all cursor-pointer">
                                   <td className="px-10 py-8">
                                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">{h.date}</p>
                                   </td>
                                   <td className="px-10 py-8">
                                      <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{h.desc}</p>
                                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Status: Verified</p>
                                   </td>
                                   <td className="px-10 py-8 text-right">
                                      <span className={`text-lg font-black ${h.up ? 'text-green-500' : 'text-red-500'}`}>{h.amount}</span>
                                   </td>
                                   <td className="px-10 py-8 text-right font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic text-lg">
                                      {h.balance}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    <div className="p-8 bg-zinc-50/50 dark:bg-zinc-800/10 text-center border-t border-zinc-50 dark:border-zinc-800">
                       <button className="text-[10px] font-black text-zinc-300 hover:text-zinc-900 transition-colors uppercase tracking-[0.5em]">Audit Registry Complete</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
        type="success" 
      />
    </div>
  );
}
