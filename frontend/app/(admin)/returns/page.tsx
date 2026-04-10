'use client';
import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search, 
  Barcode, 
  Calendar, 
  ChevronRight, 
  Banknote, 
  RefreshCw, 
  CheckCircle2, 
  X,
  History as HistoryIcon,
  Filter,
  Download,
  ArrowLeft,
  Package,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function ReturnsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [returnType, setReturnType] = useState<'refund' | 'exchange'>('refund');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleConfirmAction = () => {
    setToastMsg(returnType === 'refund' ? 'Cash refund processed successfully!' : 'Item replacement successful!');
    setShowToast(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  const RECENT_ACTIVITY = [
    { id: 'RET-102', product: 'Cotton Oxford White', type: 'Exchange', date: 'Just now', amount: '$120', status: 'Completed' },
    { id: 'RET-099', product: 'Italian Silk Tie', type: 'Refund', date: '2 hours ago', amount: '$45', status: 'Pending' },
    { id: 'RET-085', product: 'Navy Wool Blazer', type: 'Refund', date: 'Yesterday', amount: '$450', status: 'Completed' }
  ];

  const FULL_HISTORY = [
    { id: 'RET-102', product: 'Cotton Oxford White', type: 'Exchange', date: 'Oct 24, 2023', amount: '$120', status: 'Completed', reason: 'Size Mismatch' },
    { id: 'RET-099', product: 'Italian Silk Tie', type: 'Refund', date: 'Oct 23, 2023', amount: '$45', status: 'Pending', reason: 'Damaged' },
    { id: 'RET-085', product: 'Navy Wool Blazer', type: 'Refund', date: 'Oct 20, 2023', amount: '$450', status: 'Completed', reason: 'Change of Mind' },
    { id: 'RET-072', product: 'Linen Trousers', type: 'Refund', date: 'Oct 15, 2023', amount: '$180', status: 'Completed', reason: 'Wrong Item' },
    { id: 'RET-065', product: 'Slim Fit Shirt', type: 'Exchange', date: 'Oct 12, 2023', amount: '$85', status: 'Completed', reason: 'Defective' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 text-purple-500" /> Lifecycle Auditing
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">Product Returns</h1>
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Settlement & Exchange Management Feed</p>
        </div>
        
        {!isProcessing && (
          <div className="flex items-center gap-4">
            <div className="flex bg-zinc-50 dark:bg-zinc-800 p-1.5 rounded-[24px]">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Summary
              </button>
              <button 
                onClick={() => setActiveTab('history')} 
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Logbook
              </button>
            </div>
            <button 
              onClick={() => setIsProcessing(true)}
              className="bg-zinc-900 dark:bg-blue-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-zinc-200 dark:shadow-black/20 uppercase tracking-widest text-xs"
            >
              <RotateCcw className="w-5 h-5" /> Process Return
            </button>
          </div>
        )}
      </header>

      {!isProcessing ? (
        activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
            {/* Activity Hub */}
            <div className="lg:col-span-8 space-y-10">
              <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                <div className="p-10 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic-elegant">Recent Activity</h3>
                  <button onClick={() => setActiveTab('history')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Full Registry</button>
                </div>
                <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                  {RECENT_ACTIVITY.map((ret) => (
                    <div 
                      key={ret.id} 
                      onClick={() => {
                          setReturnType(ret.type.toLowerCase() as 'refund' | 'exchange');
                          setIsProcessing(true);
                      }}
                      className="p-10 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-8">
                        <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {ret.type === 'Refund' ? <Banknote className="w-7 h-7" /> : <RefreshCw className="w-7 h-7" />}
                        </div>
                        <div>
                          <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{ret.product}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Order Ref: {ret.id} • {ret.type} • {ret.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-zinc-900 dark:text-white">{ret.amount}</p>
                        <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mt-1">{ret.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-10">
              <div className="bg-zinc-900 dark:bg-zinc-950 text-white p-12 rounded-[48px] shadow-2xl relative overflow-hidden group">
                <HistoryIcon className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12" />
                <h3 className="text-2xl font-black mb-6 italic-elegant tracking-tighter leading-none">Fiscal Policy</h3>
                <p className="text-zinc-500 text-xs font-medium mb-10 leading-relaxed uppercase tracking-widest">Audited returns accepted within 7 fiscal days. Exchanges prioritized for bespoke fabric classes.</p>
                <div className="flex bg-white/5 rounded-3xl p-6 gap-6 items-center border border-white/5">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400"><RotateCcw className="w-6 h-6" /></div>
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Monthly Volume</p>
                      <p className="text-3xl font-black tracking-tighter italic">14 Assets</p>
                   </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Inventory Health</p>
                    <p className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Settled (98%)</p>
                 </div>
                 <div className="w-12 h-12 bg-green-50 dark:bg-green-900/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
              </div>
            </div>
          </div>
        ) : (
          /* HISTORY TABLE */
          <div className="animate-fade-in space-y-10">
            <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
              <div className="p-10 border-b border-zinc-50 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="relative flex-1 max-w-xl text-xs">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 font-black" />
                  <input 
                    type="text" 
                    placeholder="Search by Registry Ref, Product Identity or Context..."
                    className="w-full pl-14 pr-6 py-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-600 outline-none transition-all font-bold dark:text-white"
                  />
                </div>
                <div className="flex gap-4">
                   <button className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 rounded-xl hover:text-zinc-900 dark:hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest">
                     <Filter className="w-4 h-4" /> Filters
                   </button>
                   <button className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 rounded-xl hover:text-zinc-900 dark:hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest">
                     <Download className="w-4 h-4" /> Export
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/20 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-10 py-6">Ref Identity</th>
                      <th className="px-10 py-6">Portfolio Asset</th>
                      <th className="px-10 py-6">Contextual Reason</th>
                      <th className="px-10 py-6">Protocol</th>
                      <th className="px-10 py-6 text-right">Commitment</th>
                      <th className="px-10 py-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {FULL_HISTORY.map((ret) => (
                      <tr key={ret.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all group cursor-pointer" onClick={() => setIsProcessing(true)}>
                        <td className="px-10 py-8">
                          <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-1 font-mono">{ret.id}</p>
                          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{ret.date}</p>
                        </td>
                        <td className="px-10 py-8 font-black text-zinc-900 dark:text-zinc-100 uppercase text-xs tracking-tight">{ret.product}</td>
                        <td className="px-10 py-8 italic text-zinc-500 font-bold text-xs uppercase tracking-tighter opacity-70">{ret.reason}</td>
                        <td className="px-10 py-8">
                          <div className={`flex items-center gap-2 font-black uppercase text-[9px] tracking-[0.2em] ${ret.type === 'Exchange' ? 'text-purple-600' : 'text-blue-600'}`}>
                            {ret.type === 'Exchange' ? <RefreshCw className="w-3.5 h-3.5" /> : <Banknote className="w-3.5 h-3.5" />}
                            {ret.type}
                          </div>
                        </td>
                        <td className="px-10 py-8 font-black text-zinc-900 dark:text-white text-right text-lg">{ret.amount}</td>
                        <td className="px-10 py-8 text-right">
                          <div className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${ret.status === 'Completed' ? 'bg-zinc-900 text-white dark:bg-blue-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400'}`}>
                            {ret.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      ) : (
        /* PROCESSING STEPPER: Re-envisioned as a Cinematic Form */
        <div className="max-w-5xl mx-auto space-y-12">
           <header className="flex items-center justify-between">
              <button 
                onClick={() => setIsProcessing(false)}
                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></div>
                Cancel Return
              </button>
              <div className="flex gap-4">
                 <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl flex items-center gap-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol: Direct Settlement</p>
                 </div>
              </div>
           </header>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-12">
                 <div className="bg-white dark:bg-zinc-900 rounded-[56px] border border-zinc-100 dark:border-zinc-800 shadow-2xl p-12 md:p-16 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-b border-zinc-50 dark:border-zinc-800 pb-16">
                       {/* Identity Selection */}
                       <div className="space-y-10">
                          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><Barcode className="w-4 h-4 text-zinc-900 dark:text-white" /> Matrix Identity</h3>
                          <div className="space-y-6">
                             <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block ml-2 mb-2">Item Serial / SKU</label>
                                <div className="relative">
                                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 font-black" />
                                   <input type="text" placeholder="Scan Barcode or Type SKU..." className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl font-black text-sm outline-none focus:ring-1 focus:ring-blue-600 transition-all dark:text-white" />
                                </div>
                             </div>
                             <div className="p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] border border-zinc-100 dark:border-zinc-700 flex items-center gap-6 group hover:translate-y-[-4px] transition-all cursor-pointer">
                                <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-200 dark:text-zinc-800 border border-zinc-100 dark:border-zinc-700"><Package className="w-10 h-10" /></div>
                                <div>
                                   <p className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic-elegant">Cotton Oxford White</p>
                                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1 underline underline-offset-4 decoration-blue-500/20">Bespoke Collection • BW-12</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Method Selection */}
                       <div className="space-y-10">
                          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><RefreshCw className="w-4 h-4 text-zinc-900 dark:text-white" /> Settlement Protocol</h3>
                          <div className="grid grid-cols-2 gap-4">
                             <button 
                               onClick={() => setReturnType('refund')}
                               className={`py-12 rounded-[40px] border-2 flex flex-col items-center gap-4 transition-all group scale-100 active:scale-95 ${returnType === 'refund' ? 'border-zinc-900 bg-zinc-900 dark:border-blue-600 dark:bg-blue-600 text-white shadow-2xl' : 'border-zinc-50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:border-zinc-200'}`}
                             >
                                <Banknote className="w-8 h-8 opacity-60 group-hover:opacity-100" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cash Refund</span>
                             </button>
                             <button 
                               onClick={() => setReturnType('exchange')}
                               className={`py-12 rounded-[40px] border-2 flex flex-col items-center gap-4 transition-all group scale-100 active:scale-95 ${returnType === 'exchange' ? 'border-zinc-900 bg-zinc-900 dark:border-blue-600 dark:bg-blue-600 text-white shadow-2xl' : 'border-zinc-50 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:border-zinc-200'}`}
                             >
                                <RefreshCw className="w-8 h-8 opacity-60 group-hover:opacity-100" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Replace Asset</span>
                             </button>
                          </div>
                       </div>
                    </div>

                    {/* Final Actions Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                       <div className="space-y-8">
                          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Audit Context</h3>
                          <div className="grid grid-cols-1 gap-4">
                             <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Registry Value</span>
                                <span className="text-xl font-black text-zinc-900 dark:text-white">$120.00</span>
                             </div>
                             <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Atelier Service Fee</span>
                                <span className="text-xl font-black text-zinc-900 dark:text-white">$0.00</span>
                             </div>
                          </div>
                       </div>
                       <div className="bg-zinc-900 dark:bg-zinc-950 p-10 rounded-[48px] shadow-2xl space-y-8 text-white">
                          <div className="flex justify-between items-end border-b border-white/5 pb-8">
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Settlement Total</p>
                             <p className="text-5xl font-black italic-elegant tracking-tighter text-blue-400">$120.00</p>
                          </div>
                          <button 
                            onClick={handleConfirmAction}
                            className="w-full py-6 bg-white text-zinc-900 rounded-[32px] font-black text-xs uppercase tracking-[0.6em] shadow-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4"
                          >
                             Sign & Process <CheckCircle2 className="w-5 h-5 text-green-500" />
                          </button>
                       </div>
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
