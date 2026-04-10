'use client';
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown, 
  History, 
  Package, 
  ArrowLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Tag,
  Warehouse,
  Printer,
  Edit3,
  Trash2,
  CheckCircle2,
  QrCode,
  DollarSign,
  Box,
  Truck,
  Layers,
  Info,
  MapPin,
  X,
  Archive as ArchiveIcon,
  ShoppingBag,
  FileText
} from 'lucide-react';
import Toast from '@/components/ui/Toast';

export default function InventoryPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showArchives, setShowArchives] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [inventory, setInventory] = useState([
    { 
      id: 1, 
      name: 'Midnight Herringbone Wool', 
      sku: 'FAB-WOO-0012', 
      quantity: '42.5 M', 
      status: 'In Stock', 
      category: 'Fabric',
      price: { cost: '$32.00', retail: '$85.00', margin: '62%' },
      location: { warehouse: 'Main Atelier', rack: 'A-12', shelf: 'Top' },
      supplier: { name: 'Milan Wool Mill', contact: 'Massimo R.', leadTime: '14 Days' },
      specs: { composition: '100% Virgin Wool', weight: '280 GSM', color: 'Navy #120A', width: '150cm' },
      history: [
        { date: 'Oct 24', action: 'Stock Added', qty: '+10m', ref: 'PO-8821' },
        { date: 'Oct 18', action: 'Sold (Custom Suit)', qty: '-3.5m', ref: 'INV-4421' }
      ]
    },
    { 
      id: 2, 
      name: 'Classic Oxford Button-Down', 
      sku: 'GAR-SHR-4402', 
      quantity: '3 Units', 
      status: 'Low Stock', 
      category: 'Ready-to-Wear',
      price: { cost: '$18.50', retail: '$120.00', margin: '84%' },
      location: { warehouse: 'Retail Branch', rack: 'B-04', shelf: 'Front' },
      supplier: { name: 'Heritage Crafters', contact: 'Emma S.', leadTime: '7 Days' },
      specs: { composition: '100% Pima Cotton', weight: '140 GSM', color: 'Optic White', sizing: 'S/M/L/XL' },
      history: [
        { date: 'Oct 22', action: 'Sold', qty: '-1 unit', ref: 'INV-4410' }
      ]
    },
    { 
      id: 3, 
      name: 'Premium Sand Linen', 
      sku: 'FAB-LIN-9910', 
      quantity: '0.0 M', 
      status: 'Out of Stock', 
      category: 'Fabric',
      price: { cost: '$24.00', retail: '$65.00', margin: '63%' },
      location: { warehouse: 'Main Atelier', rack: 'C-09', shelf: 'Middle' },
      supplier: { name: 'Belfast Linens', contact: 'Liam O.', leadTime: '21 Days' },
      specs: { composition: '100% Irish Linen', weight: '180 GSM', color: 'Sand Beige', width: '145cm' },
      history: []
    },
  ]);

  const [archives, setArchives] = useState([
    { id: 99, name: 'Vintage Silk Twill', sku: 'FAB-SIL-0001', archiveDate: 'Oct 01, 2023', reason: 'Discontinued' }
  ]);

  const handleUpdateStock = () => {
    setToastMsg('Inventory record synchronized successfully!');
    setShowToast(true);
  };

  const handleAddProduct = (e: any) => {
    e.preventDefault();
    setToastMsg('New product added to master collection!');
    setShowToast(true);
    setShowAddModal(false);
  };

  const handleArchive = (id: number) => {
    const product = inventory.find(p => p.id === id);
    if (product) {
      setArchives([...archives, { id: product.id, name: product.name, sku: product.sku, archiveDate: new Date().toLocaleDateString(), reason: 'Manual' }]);
      setInventory(inventory.filter(p => p.id !== id));
      setToastMsg(`${product.name} moved to archives.`);
      setShowToast(true);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {!selectedProduct && !showArchives ? (
        <>
          {/* Header Row */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-10">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">Master Collection</h1>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mt-1">Stock Portfolio • 842 Items Audited</p>
            </div>
            <div className="flex gap-4">
               <button 
                 onClick={() => setShowArchives(true)}
                 className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all font-bold text-xs uppercase tracking-widest"
               >
                 <ArchiveIcon className="w-4 h-4" /> Archives
               </button>
               <button 
                 onClick={() => setShowAddModal(true)}
                 className="bg-zinc-900 dark:bg-blue-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-zinc-200 dark:shadow-black/20 uppercase tracking-widest text-xs"
               >
                 <Plus className="w-5 h-5" /> Add to Stock
               </button>
            </div>
          </section>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { label: 'Total Value', val: '$84,200', icon: DollarSign, trend: '+4%' },
               { label: 'Active Items', val: '842', icon: Layers, trend: 'Stable' },
               { label: 'Low Stock', val: '14', icon: TrendingDown, trend: 'Critical', color: 'text-red-500' },
               { label: 'New Arrivals', val: '+24', icon: Truck, trend: 'This Week' },
             ].map((stat, i) => (
               <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-4">
                     <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <stat.icon className="w-5 h-5" />
                     </div>
                     <span className={`text-[9px] font-black uppercase tracking-tighter ${stat.color || 'text-zinc-400'}`}>{stat.trend}</span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">{stat.val}</p>
               </div>
             ))}
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
             <div className="p-10 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between gap-8">
                <div className="relative flex-1 max-w-xl">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                   <input type="text" placeholder="Search by SKU, Name or Category..." className="w-full pl-14 pr-6 py-5 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-none outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-500 font-bold text-sm" />
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl hover:bg-zinc-100 transition-all font-bold text-xs uppercase tracking-widest">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"><Printer className="w-5 h-5" /></button>
                </div>
             </div>

             <table className="w-full text-left">
                <thead className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-50 dark:border-zinc-800">
                   <tr>
                      <th className="px-10 py-6">Identity & Portfolio</th>
                      <th className="px-10 py-6">Availability</th>
                      <th className="px-10 py-6">Category</th>
                      <th className="px-10 py-6 text-right">Unit Price</th>
                      <th className="px-10 py-6"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                   {inventory.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedProduct(item)}
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-all cursor-pointer group"
                      >
                         <td className="px-10 py-10">
                            <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors">{item.name}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">SKU: {item.sku}</p>
                         </td>
                         <td className="px-10 py-10">
                            <div className="flex flex-col">
                               <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{item.quantity}</span>
                               <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${item.status === 'Low Stock' ? 'text-orange-500' : item.status === 'Out of Stock' ? 'text-red-500' : 'text-green-500'}`}>{item.status}</span>
                            </div>
                         </td>
                         <td className="px-10 py-10">
                            <span className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                         </td>
                         <td className="px-10 py-10 text-right">
                            <p className="text-lg font-black text-zinc-900 dark:text-white tracking-tighter">{item.price.retail}</p>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{item.price.margin} Margin</p>
                         </td>
                         <td className="px-10 py-10 text-right">
                            <ChevronRight className="w-6 h-6 text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-all transform group-hover:translate-x-2" />
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </>
      ) : showArchives ? (
        /* ARCHIVES VIEW */
        <div className="space-y-12 animate-slide-in">
           <header className="flex items-center justify-between">
              <button 
                onClick={() => setShowArchives(false)}
                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Collection
              </button>
              <h2 className="text-3xl font-black italic-elegant uppercase tracking-tighter dark:text-white">Archived Assets</h2>
           </header>

           <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-[40px] border border-zinc-200 dark:border-zinc-800 p-10 min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {archives.map(item => (
                   <div key={item.id} className="bg-white dark:bg-zinc-800 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <ArchiveIcon className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
                      </div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.sku}</p>
                      <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-6 truncate">{item.name}</h3>
                      <div className="space-y-4 border-t border-zinc-50 dark:border-zinc-700 pt-6">
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-zinc-400">Archived On</span>
                            <span className="text-zinc-900 dark:text-zinc-100">{item.archiveDate}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-zinc-400">Reason</span>
                            <span className="text-red-500 font-black">{item.reason}</span>
                         </div>
                      </div>
                      <button className="w-full mt-8 py-4 bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 dark:hover:bg-blue-600 hover:text-white transition-all">Restore Asset</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      ) : (
        /* DETAIL VIEW: Updated for Dark Mode */
        <div className="max-w-[1400px] mx-auto animate-slide-in pb-20 space-y-12">
           <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="flex items-center gap-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] group"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><ArrowLeft className="w-4 h-4" /></div>
                Back to Collection
              </button>
              <div className="flex gap-4">
                 <button onClick={() => handleArchive(selectedProduct.id)} className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /> Archive Asset</button>
                 <button 
                   onClick={handleUpdateStock}
                   className="px-8 py-3 bg-zinc-900 dark:bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-blue-700 transition-colors shadow-2xl"
                 >
                   Save Ledger Edits
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Product Profile */}
              <div className="lg:col-span-8 space-y-10">
                 <div className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
                    <div className="bg-zinc-900 dark:bg-blue-900 p-12 md:p-16 text-white relative group">
                       <Warehouse className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-6" />
                       <div className="relative z-10 space-y-6">
                          <div className="flex flex-wrap gap-3">
                             <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">{selectedProduct.status}</span>
                             <span className="px-4 py-1.5 bg-white/10 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10 uppercase">{selectedProduct.category}</span>
                             <span className="px-4 py-1.5 bg-white/10 text-white/60 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10">{selectedProduct.sku}</span>
                          </div>
                          <h2 className="text-5xl md:text-7xl font-black italic-elegant tracking-tighter leading-none">{selectedProduct.name}</h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-white/10">
                             <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Stock On Hand</p>
                                <p className="text-2xl font-black">{selectedProduct.quantity}</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Unit Value</p>
                                <p className="text-2xl font-black">{selectedProduct.price.retail}</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Margin Profile</p>
                                <p className="text-2xl font-black text-blue-400">{selectedProduct.price.margin}</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">SKU</p>
                                <p className="text-sm font-black opacity-60 uppercase">{selectedProduct.sku}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-16">
                       <section className="space-y-8">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><Tag className="w-4 h-4 text-zinc-900 dark:text-white" /> Technical Matrix</h3>
                          <div className="space-y-6">
                             {Object.entries(selectedProduct.specs).map(([k, v]: any) => (
                               <div key={k} className="flex justify-between items-center group">
                                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">{k}</span>
                                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{v}</span>
                               </div>
                             ))}
                          </div>
                       </section>

                       <section className="space-y-8">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><QrCode className="w-4 h-4 text-zinc-900 dark:text-white" /> Digital Passport</h3>
                          <div className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-[32px] flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition-colors group cursor-crosshair">
                             <div className="text-center space-y-4">
                               <QrCode className="w-24 h-24 text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-all transform group-hover:scale-110" />
                               <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Scan for Verification</p>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <button className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">Print Label</button>
                             <button className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">Digital Key</button>
                          </div>
                       </section>
                    </div>
                 </div>

                 {/* Historical Ledger */}
                 <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-xl p-10 space-y-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><History className="w-4 h-4" /> Activity Ledger</h3>
                    <div className="space-y-8 relative">
                       {selectedProduct.history.length > 0 ? selectedProduct.history.map((h: any, i: number) => (
                          <div key={i} className="relative pl-10 border-l-2 border-zinc-50 dark:border-zinc-800 pb-8 last:pb-0">
                             <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-zinc-900"></div>
                             <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{h.date}</p>
                             <div className="flex justify-between items-start">
                                <div>
                                   <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{h.action}</p>
                                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Ref: {h.ref}</p>
                                </div>
                                <span className={`text-sm font-black ${h.qty.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{h.qty}</span>
                             </div>
                          </div>
                       )) : (
                         <div className="py-10 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest opacity-30">No historical data recorded.</div>
                       )}
                    </div>
                 </div>
              </div>

              {/* Sidebar: Supplier & Location */}
              <div className="lg:col-span-4 space-y-10">
                 <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-xl p-10 space-y-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800 pb-6"><MapPin className="w-4 h-4 text-red-500" /> Physical Placement</h3>
                    <div className="grid grid-cols-1 gap-6">
                       <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] border border-zinc-100 dark:border-zinc-700">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Primary Facility</p>
                          <p className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic-elegant">{selectedProduct.location.warehouse}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] border border-zinc-100 dark:border-zinc-700">
                             <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Section</p>
                             <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">{selectedProduct.location.rack}</p>
                          </div>
                          <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-[32px] border border-zinc-100 dark:border-zinc-700">
                             <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Tier</p>
                             <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">{selectedProduct.location.shelf}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-zinc-900 dark:bg-zinc-950 rounded-[40px] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden group">
                    <Truck className="absolute -right-12 -bottom-12 w-48 h-48 opacity-10 transform scale-x-[-1] transition-transform group-hover:translate-x-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 border-b border-white/5 pb-6">Supply Chain Origin</h3>
                    <div className="space-y-8">
                       <div>
                          <p className="text-2xl font-black italic-elegant tracking-tighter leading-none">{selectedProduct.supplier.name}</p>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2 px-3 py-1 bg-white/5 rounded-full inline-block">Partner Representative: {selectedProduct.supplier.contact}</p>
                       </div>
                       <div className="grid grid-cols-1 gap-4">
                          <div className="p-5 bg-white/5 rounded-[24px] border border-white/5">
                             <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Audited Lead Time</p>
                             <p className="text-lg font-black text-blue-400">{selectedProduct.supplier.leadTime}</p>
                          </div>
                       </div>
                       <button className="w-full py-5 bg-white text-zinc-900 rounded-[28px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all">Issue Purchase Order</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-xl animate-fade-in">
           <div className="bg-white dark:bg-zinc-950 w-full max-w-2xl rounded-[48px] shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden relative animate-scale-in">
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"
              ><X className="w-5 h-5" /></button>
              
              <div className="p-12 space-y-10">
                 <div className="space-y-1">
                    <h2 className="text-3xl font-black italic-elegant uppercase tracking-tighter dark:text-white leading-none">Add to <br /> Master Collection</h2>
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[9px]">Entry to Global Stock Ledger</p>
                 </div>

                 <form onSubmit={handleAddProduct} className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Asset Name</label>
                          <input type="text" placeholder="e.g. Italian Silk" className="w-full bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-600 border-none transition-all dark:text-white" required />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Identification SKU</label>
                          <input type="text" placeholder="e.g. SKU-8821" className="w-full bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold text-sm outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-blue-600 border-none transition-all dark:text-white" required />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Volume</label>
                          <input type="text" placeholder="10.0 M" className="w-full bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold text-sm outline-none border-none dark:text-white" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Asset Class</label>
                          <select className="w-full bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold text-xs outline-none border-none dark:text-white">
                             <option>Fabric</option>
                             <option>Ready-to-Wear</option>
                             <option>Accessories</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block ml-1">Valuation</label>
                          <input type="text" placeholder="$0.00" className="w-full bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl font-bold text-sm outline-none border-none dark:text-white" />
                       </div>
                    </div>

                    <div className="pt-6">
                       <button className="w-full py-6 bg-zinc-900 dark:bg-blue-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-black dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                         Submit Asset <Plus className="w-5 h-5" />
                       </button>
                    </div>
                 </form>
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
