'use client';
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Calendar, 
  Truck, 
  Package, 
  MoreHorizontal, 
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  X,
  ArrowLeft,
  FileText,
  DollarSign,
  TrendingUp,
  History,
  Info
} from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function PurchaseOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'inbound'>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const ORDERS = [
    { 
      id: 'PO-9921', 
      vendor: 'Milan Wool Mill', 
      items: 4, 
      total: '$12,450.00', 
      status: 'In Transit', 
      date: 'Oct 24, 2023',
      delivery: 'Today (EOD)',
      eta: '4:00 PM',
      address: 'Main Atelier, Warehouse A',
      details: [
        { name: 'Navy Virgin Wool', qty: '10m', price: '$850.00' },
        { name: 'Grey Herringbone', qty: '15m', price: '$1,200.00' }
      ]
    },
    { 
      id: 'PO-9918', 
      vendor: 'Heritage Crafters', 
      items: 12, 
      total: '$3,840.00', 
      status: 'Inbound', 
      date: 'Oct 24, 2023',
      delivery: 'Today (EOD)',
      eta: '5:30 PM',
      address: 'Main Atelier, Loading Dock B',
      details: [
        { name: 'Cotton Thread Spools', qty: '100 units', price: '$500.00' },
        { name: 'Tailoring Chalk', qty: '50 units', price: '$150.00' }
      ]
    },
    { 
      id: 'PO-9810', 
      vendor: 'Belfast Linens', 
      items: 2, 
      total: '$5,900.00', 
      status: 'Pending', 
      date: 'Oct 20, 2023',
      delivery: 'Oct 28',
      address: 'Secondary Storage, Unit 4',
      details: []
    },
    { 
      id: 'PO-9721', 
      vendor: 'Silk & Soul Co.', 
      items: 8, 
      total: '$8,200.00', 
      status: 'Completed', 
      date: 'Oct 15, 2023',
      delivery: 'Oct 15',
      address: 'Main Atelier',
      details: []
    },
  ];

  const filteredOrders = activeTab === 'inbound' 
    ? ORDERS.filter(o => o.status === 'In Transit' || o.status === 'Inbound')
    : ORDERS;

  const handleStatusUpdate = () => {
    setToastMsg('Order status updated. Inventory ledger synchronized.');
    setShowToast(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {!selectedOrder ? (
        <div className="space-y-12">
          {/* Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">Procurement Ledger</h1>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">Global Supply Chain & Inbound Logistics</p>
            </div>
            <button className="bg-zinc-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-zinc-200 dark:shadow-black/20 uppercase tracking-widest text-xs">
              <Plus className="w-5 h-5" /> New Purchase Order
            </button>
          </section>

          {/* Logistics Tabs */}
          <div className="flex gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-0 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
             <button 
               onClick={() => setActiveTab('all')}
               className={`pb-4 px-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'all' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
             >
               All Orders
               {activeTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 dark:bg-blue-600 rounded-full" />}
             </button>
             <button 
               onClick={() => setActiveTab('inbound')}
               className={`pb-4 px-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'inbound' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
             >
               Inbound (Today)
               <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[9px] font-black">2</span>
               {activeTab === 'inbound' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900 dark:bg-blue-600 rounded-full" />}
             </button>
          </div>

          {/* Master PO List */}
          <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
             <div className="p-10 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between gap-8">
                <div className="relative flex-1 max-w-xl">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                   <input type="text" placeholder="Find by Vendor, PO# or Item..." className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-none outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-500 font-bold text-sm" />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all font-bold text-xs uppercase tracking-widest">
                   <Filter className="w-4 h-4" /> Filter
                </button>
             </div>

             <table className="w-full text-left">
                <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-50 dark:border-zinc-800">
                   <tr>
                      <th className="px-10 py-6">Order ID & Origin</th>
                      <th className="px-10 py-6 text-center">Arrival Schedule</th>
                      <th className="px-10 py-6 text-right">Commitment</th>
                      <th className="px-10 py-6 text-center">Status</th>
                      <th className="px-10 py-6"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                   {filteredOrders.map((item) => (
                      <tr 
                         key={item.id} 
                         onClick={() => setSelectedOrder(item)}
                         className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all cursor-pointer group"
                      >
                         <td className="px-10 py-10">
                            <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{item.id}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Vendor: {item.vendor}</p>
                         </td>
                         <td className="px-10 py-10 text-center">
                            <div className="flex flex-col items-center">
                               <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{item.delivery}</p>
                               {item.eta && <p className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/10 px-2 py-0.5 rounded-full mt-1">ETA {item.eta}</p>}
                            </div>
                         </td>
                         <td className="px-10 py-10 text-right">
                            <p className="text-xl font-black text-zinc-900 dark:text-white">{item.total}</p>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{item.items} Items Audited</p>
                         </td>
                         <td className="px-10 py-10 text-center">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${item.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:text-green-400' : item.status === 'In Transit' || item.status === 'Inbound' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 animate-pulse' : 'bg-zinc-100 text-zinc-400 border-zinc-100 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                               <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                            </div>
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
        /* ORDER DETAILS VIEW */
        <div className="max-w-[1400px] mx-auto animate-slide-in pb-20 space-y-12">
           <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-xs font-bold uppercase tracking-[0.2em] group"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></div>
                Back to Ledger
              </button>
              <div className="flex gap-4">
                 <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-colors shadow-sm"><FileText className="w-4 h-4 opacity-40" /> PDF Manifest</button>
                 <button onClick={handleStatusUpdate} className="px-8 py-3 bg-zinc-900 dark:bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 transition-colors shadow-xl">Audit & Receive</button>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Main Order Info */}
              <div className="lg:col-span-8 space-y-10">
                 <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
                    <div className="bg-zinc-900 dark:bg-blue-900 p-12 md:p-16 text-white relative group overflow-hidden">
                       <Truck className="absolute -right-12 -bottom-12 w-64 h-64 opacity-5 group-hover:opacity-10 transition-opacity transform -rotate-12" />
                       <div className="relative z-10 space-y-6">
                          <div className="flex flex-wrap gap-3">
                             <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">{selectedOrder.status}</span>
                             <span className="px-4 py-1.5 bg-white/10 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10">PO REFERENCE: {selectedOrder.id}</span>
                          </div>
                          <h2 className="text-5xl md:text-7xl font-black italic-elegant tracking-tighter leading-none">{selectedOrder.vendor}</h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-white/10">
                             <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Issue Date</p>
                                <p className="text-sm font-black">{selectedOrder.date}</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Items Audited</p>
                                <p className="text-sm font-black">{selectedOrder.items} Types</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Total Value</p>
                                <p className="text-2xl font-black text-blue-400">{selectedOrder.total}</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Schedule</p>
                                <p className="text-sm font-black">{selectedOrder.delivery}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-12 space-y-10">
                       <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><Package className="w-4 h-4 text-zinc-900 dark:text-white" /> Manifest Details</h3>
                       <div className="space-y-6">
                          {selectedOrder.details.length > 0 ? selectedOrder.details.map((item: any, i: number) => (
                             <div key={i} className="flex justify-between items-center group">
                                <div>
                                   <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">{item.name}</p>
                                   <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic">{item.qty} units expected</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-lg font-black text-zinc-900 dark:text-white">{item.price}</p>
                                </div>
                             </div>
                          )) : (
                            <div className="py-10 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest">No detailed manifest found.</div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4 space-y-10">
                 <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-xl p-10 space-y-10">
                    <div>
                       <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8 flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><MapPin className="w-4 h-4 text-red-500" /> Delivery Target</h3>
                       <a 
                         href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrder.address)}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] border border-zinc-100 dark:border-zinc-700 flex items-center gap-4 group hover:bg-zinc-900 dark:hover:bg-blue-600 hover:text-white transition-all duration-500"
                      >
                         <Truck className="w-8 h-8 text-zinc-400 group-hover:text-white transition-colors" />
                         <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white/40 opacity-40">Drop-off Point</p>
                            <p className="font-black tracking-tight">{selectedOrder.address}</p>
                            <p className="text-xs font-bold opacity-60">Status: Dock Clear</p>
                         </div>
                      </a>
                    </div>

                    <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400"><Info className="w-5 h-5" /></div>
                          <div>
                             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Supplier Note</p>
                             <p className="text-xs font-bold text-zinc-900 dark:text-white italic">"Fragile fabrics. Immediate refrigeration required."</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-xl p-10 space-y-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><History className="w-4 h-4" /> Transit History</h3>
                    <div className="space-y-8 relative">
                       {[
                          { date: 'Oct 24 - 09:12 AM', action: 'In Transit', loc: 'Milan Int Airport' },
                          { date: 'Oct 23 - 04:00 PM', action: 'Manifested', loc: 'Vendor Mill' },
                       ].map((h, i) => (
                          <div key={i} className="relative pl-10 border-l-2 border-zinc-50 dark:border-zinc-800 pb-8 last:pb-0">
                             <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-zinc-900"></div>
                             <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{h.date}</p>
                             <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{h.action}</p>
                             <p className="text-xs font-bold text-zinc-400 italic">{h.loc}</p>
                          </div>
                       ))}
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
