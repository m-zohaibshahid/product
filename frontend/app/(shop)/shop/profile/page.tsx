"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Settings, 
  ChevronRight, 
  Star, 
  Clock, 
  ShieldCheck,
  LogOut,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Plus,
  Store
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Primary Hub', name: '7th Avenue Penthouse 1', street: 'Floor 42, Vogue Plaza', city: 'Manhattan, NY 10001', country: 'United States', isDefault: true },
    { id: 2, type: 'Office', name: '7th Avenue Penthouse 2', street: 'Floor 42, Vogue Plaza', city: 'Manhattan, NY 10001', country: 'United States', isDefault: false }
  ]);
  
  const [formData, setFormData] = useState({ name: '', street: '', city: '', country: 'United States' });

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      alert("Atelier Profile Synchronized!");
      setActiveTab('dashboard');
    }, 1500);
  };

  const handleDeleteAddress = (id: number) => {
    if (confirm("Are you sure you want to remove this global delivery destination?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      setOpenDropdownId(null);
    }
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
      type: addr.id === id ? 'Primary Hub' : 'Office'
    })));
    setOpenDropdownId(null);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.street) return;

    const newAddr = {
      id: Date.now(),
      type: 'New Hub',
      name: formData.name,
      street: formData.street,
      city: formData.city,
      country: formData.country,
      isDefault: false
    };

    setAddresses([...addresses, newAddr]);
    setShowAddModal(false);
    setFormData({ name: '', street: '', city: '', country: 'United States' });
  };

  const [orders] = useState([
    { 
      id: "ORD-99212", 
      date: "Oct 24, 2024", 
      status: "In Fitting", 
      total: 1280.00, 
      img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=600&auto=format&fit=crop", 
      item: "Midnight Silk Silk Tuxedo",
      construction: "stitched",
      details: "Bespoke Fitting (Size 52R)"
    },
    { 
      id: "ORD-98105", 
      date: "Sept 12, 2024", 
      status: "Delivered", 
      total: 700.00, 
      img: "https://images.unsplash.com/photo-1594932224010-75f4383a54fd?q=80&w=600&auto=format&fit=crop", 
      item: "Artisan Wool Cut Piece",
      construction: "unstitched",
      details: "2.5 Meters (Heritage Cut)"
    },
    { id: "ORD-97002", date: "Aug 05, 2024", status: "Delivered", total: 850.00, img: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=600&auto=format&fit=crop", item: "Heritage Camel Overcoat", construction: "stitched", details: "Size 50L" }
  ]);

  const menuItems = [
    { id: 'personal', icon: User, label: "Personal Information", desc: "Manage your profile and measurements" },
    { id: 'shipping', icon: MapPin, label: "Shipping Addresses", desc: "Your global delivery destinations" },
    { id: 'payment', icon: CreditCard, label: "Payment Methods", desc: "Securely stored cards and accounts" },
    { id: 'preferences', icon: Settings, label: "Preferences", desc: "Notification and language settings" },
    { id: 'security', icon: ShieldCheck, label: "Security", desc: "Password and account protection" }
  ];

  /* components for sub-views */

  const OrderDetailView = () => {
    const order = orders.find(o => o.id === selectedOrderId) || orders[0];
    
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => setActiveTab('orders')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
             <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Order Anatomy</h3>
            <p className="text-xs text-primary font-black tracking-[0.2em]">{order.id} • BESPOKE INVESTMENT</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              {/* Product Card */}
              <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-white/10 shadow-xl flex flex-col md:flex-row gap-8">
                 <div className="relative w-full md:w-64 h-80 rounded-3xl overflow-hidden shadow-2xl">
                    <Image src={order.img} alt={order.item} fill className="object-cover" />
                 </div>
                 <div className="flex-1 space-y-6">
                    <div>
                       <div className="flex gap-2">
                          <span className="text-[10px] font-black uppercase bg-primary text-white px-3 py-1 rounded-full">{order.status}</span>
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${order.construction === 'unstitched' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                             {order.construction === 'unstitched' ? 'Unstitched Fabric' : 'Bespoke Stitched'}
                          </span>
                       </div>
                       <h4 className="text-3xl font-black tracking-tighter mt-4 leading-tight">{order.item}</h4>
                       <p className="text-sm text-zinc-500 mt-2 font-medium">Commissioned on {order.date}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-50 dark:border-white/5">
                       <div>
                          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Artisan Status</p>
                          <p className="text-sm font-black mt-1 capitalize">{order.construction}</p>
                       </div>
                       <div>
                          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Allocation Detail</p>
                          <p className="text-sm font-black mt-1">{order.details}</p>
                       </div>
                       <div>
                          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Master Fabric</p>
                          <p className="text-sm font-black mt-1">Super 150s Merino Silk</p>
                       </div>
                       <div>
                          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Dispatch Node</p>
                          <p className="text-sm font-black mt-1">Milan Atelier Hub</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Delivery Timeline */}
              <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-10 border border-zinc-100 dark:border-white/10 shadow-xl">
                 <h5 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" /> Logistics Timeline
                 </h5>
                 <div className="space-y-10 relative">
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-zinc-100 dark:bg-white/5" />
                    
                    {[
                      { status: 'Commission Finalized', date: order.date, completed: true },
                      { status: 'Artisan Construction', date: 'Processing at Milan Studio', completed: order.status === 'Delivered' },
                      { status: 'Quality Calibration', date: 'Master Tailor Sign-off', completed: order.status === 'Delivered' },
                      { status: 'Global Dispatch', date: 'Priority Air Express', completed: order.status === 'Delivered' }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-6 relative z-10">
                         <div className={`w-6 h-6 rounded-full flex-shrink-0 border-4 border-white dark:border-zinc-900 shadow-md ${step.completed ? 'bg-emerald-500' : 'bg-primary animate-pulse'}`} />
                         <div>
                            <p className="text-sm font-black text-zinc-800 dark:text-zinc-100 uppercase">{step.status}</p>
                            <p className="text-xs text-zinc-400 font-medium italic italic-elegant mt-0.5">{step.date}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-zinc-800 text-white rounded-[2.5rem] p-8 shadow-2xl space-y-8">
                 <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40">Investment Summary</h5>
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                       <span className="opacity-60 font-medium italic-elegant underline decoration-white/10 underline-offset-4">Artisanal Craft</span>
                       <span className="font-bold">${(order.total * 0.85).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="opacity-60 font-medium italic-elegant underline decoration-white/10 underline-offset-4">Material Sourcing</span>
                       <span className="font-bold">${(order.total * 0.10).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="opacity-60 font-medium italic-elegant underline decoration-white/10 underline-offset-4">Concierge Logistics</span>
                       <span className="font-bold text-emerald-400">COMPLIMENTARY</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
                       <span className="text-[10px] font-black uppercase tracking-widest">Total Value</span>
                       <span className="text-3xl font-black text-primary tracking-tighter">${order.total.toLocaleString()}</span>
                    </div>
                 </div>
                 <button onClick={() => alert("Downloading Bespoke Certificate...")} className="w-full bg-white/10 hover:bg-white/20 transition-colors py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3">
                    <ShieldCheck className="w-4 h-4" /> Download Certificate
                 </button>
              </div>

              <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-white/10 shadow-xl">
                 <h6 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 font-primary">Artisan Notes</h6>
                 <p className="text-xs text-zinc-500 dark:text-zinc-300 leading-relaxed font-primary italic-elegant italic">
                   "The midnight silk blend requires delicate preservation. We recommend bespoke cedar storage for optimal fabric longevity. Your next fitting is scheduled for seasonal coordination."
                 </p>
                 <div className="mt-6 pt-6 border-t border-zinc-50 dark:border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-xs">M.T</div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-zinc-800 dark:text-zinc-100 font-primary">Marco Trapani</p>
                       <p className="text-[9px] font-bold text-zinc-400 uppercase font-primary">Master Tailor, Milan</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  // Mock User Data
  const user = {
    name: "Alexander Vance",
    email: "alex.vance@atelier.global",
    tier: "Emerald Elite",
    since: "March 2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    stats: [
      { label: "Bespoke Orders", value: "12" },
      { label: "Elite Points", value: "4,850" },
      { label: "Fitting Sessions", value: "3" }
    ]
  };


  /* components for sub-views */
  
  const PersonalInfoView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
           <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-black uppercase tracking-tight">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-white/5 p-8 rounded-3xl border border-zinc-100 dark:border-white/10 shadow-xl">
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Legal Name</label>
           <input type="text" defaultValue={user.name} className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-4 rounded-xl outline-none focus:border-primary transition-colors font-bold text-sm" />
        </div>
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contact Email</label>
           <input type="email" defaultValue={user.email} className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-4 rounded-xl outline-none focus:border-primary transition-colors font-bold text-sm italic" />
        </div>
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Phone Number</label>
           <input type="text" defaultValue="+1 (555) 902-3401" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-4 rounded-xl outline-none focus:border-primary transition-colors font-bold text-sm" />
        </div>
        <div className="space-y-4">
           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Preferred Fitting City</label>
           <select className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-4 rounded-xl outline-none focus:border-primary transition-colors font-bold text-sm cursor-pointer">
              <option>New York</option>
              <option>London</option>
              <option>Milan</option>
              <option>Paris</option>
           </select>
        </div>
        <div className="md:col-span-2 pt-4">
           <button 
             onClick={handleUpdate}
             disabled={isUpdating}
             className="bg-primary text-white font-black px-12 py-4 rounded-2xl hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg tracking-widest uppercase text-xs flex items-center gap-2"
           >
             {isUpdating ? (
               <>
                 <Settings className="w-4 h-4 animate-spin" /> SAVING...
               </>
             ) : (
               "Update Profile"
             )}
           </button>
        </div>
      </div>
    </div>
  );

  const ShippingView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
             <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-2xl font-black uppercase tracking-tight">Shipping Addresses</h3>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white text-[10px] font-black px-6 py-3 rounded-full hover:bg-primary/95 transition-colors tracking-widest uppercase shadow-xl active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Hub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
         {addresses.map((addr) => (
           <div key={addr.id} className={`p-6 rounded-3xl border transition-all animate-in zoom-in-95 duration-300 relative ${addr.isDefault ? 'bg-primary/5 border-primary shadow-lg' : 'bg-white dark:bg-white/5 border-zinc-100 dark:border-white/10 shadow-md'}`}>
             <div className="flex justify-between items-start mb-4">
               <div className="flex-1">
                 <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${addr.isDefault ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-white/10 text-zinc-400'}`}>
                      {addr.type}
                    </span>
                 </div>
                 <h4 className="text-sm font-black mt-2 tracking-tight">{addr.name}</h4>
               </div>
               
               <div className="relative">
                 <button 
                   onClick={() => setOpenDropdownId(openDropdownId === addr.id ? null : addr.id)}
                   className="p-2 text-zinc-400 hover:text-primary transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full"
                 >
                   <Settings className="w-5 h-5" />
                 </button>

                 {openDropdownId === addr.id && (
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={() => handleSetDefault(addr.id)} className="w-full text-left p-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 text-zinc-600 dark:text-zinc-300 border-b border-zinc-50 dark:border-white/5 flex items-center justify-between">
                         Make Default <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </button>
                      <button onClick={() => alert("Ready to rename hub...")} className="w-full text-left p-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 text-zinc-600 dark:text-zinc-300 border-b border-zinc-50 dark:border-white/5 flex items-center justify-between">
                         Rename <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="w-full text-left p-4 text-[10px] font-black uppercase tracking-widest hover:bg-secondary/5 text-secondary flex items-center justify-between">
                         Delete Hub <Trash2 className="w-3.5 h-3.5" />
                      </button>
                   </div>
                 )}
               </div>
             </div>
             
             <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
               {addr.street}<br />
               {addr.city}<br />
               {addr.country}
             </p>
             
             {addr.isDefault && (
               <div className="mt-4 flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                 <CheckCircle2 className="w-4 h-4" /> Default Selection
               </div>
             )}
           </div>
         ))}

         {addresses.length === 0 && (
            <div className="md:col-span-2 py-20 bg-zinc-50 dark:bg-white/5 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-3xl text-center">
               <MapPin className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
               <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">No Bespoke Destinations Found</p>
               <button onClick={() => setShowAddModal(true)} className="mt-4 text-primary font-black uppercase text-xs tracking-widest hover:underline">Add Your First address</button>
            </div>
         )}
      </div>
    </div>
  );

  const PaymentView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
             <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-2xl font-black uppercase tracking-tight">Payment Methods</h3>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white text-[10px] font-black px-6 py-3 rounded-full hover:bg-primary/90 transition-colors tracking-widest uppercase">
          <CreditCard className="w-4 h-4" /> Link Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-gradient-to-br from-zinc-800 to-black p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
            <CreditCard className="absolute bottom-4 right-4 text-white/10 w-24 h-24 -rotate-12 translate-x-8 translate-y-8 group-hover:scale-110 transition-transform" />
            <div className="flex justify-between items-start mb-12">
               <div className="text-lg font-black italic tracking-tighter italic-elegant">ATELIER ELITE</div>
               <div className="text-right">
                  <p className="text-[10px] font-black opacity-40 uppercase">Expires</p>
                  <p className="text-xs font-bold font-mono tracking-widest">12 / 28</p>
               </div>
            </div>
            <div>
               <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Asset Controller</p>
               <p className="text-xl font-bold font-mono tracking-[0.2em] mt-1">••••  ••••  ••••  9021</p>
            </div>
         </div>
         <div className="bg-zinc-50 dark:bg-white/5 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 space-y-4 hover:border-primary/40 transition-colors group cursor-pointer">
            <div className="p-4 bg-white dark:bg-white/5 rounded-full group-hover:scale-110 transition-transform shadow-sm">
               <Plus className="w-6 h-6 text-zinc-400 group-hover:text-primary" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Add New Payment Provider</p>
         </div>
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
           <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-black uppercase tracking-tight">Full Order Registry</h3>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-zinc-100 dark:border-white/10 shadow-xl overflow-hidden">
         <div className="p-8 border-b border-zinc-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-96">
               <input type="text" placeholder="Search orders by ID..." className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-3.5 pl-10 rounded-xl text-xs outline-none focus:border-primary transition-all" />
               <ShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex gap-4">
               <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-zinc-100 dark:border-white/10 rounded-lg hover:bg-zinc-50 transition-colors">Filter</button>
               <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-zinc-100 dark:border-white/10 rounded-lg hover:bg-zinc-50 transition-colors">Download PDF</button>
            </div>
         </div>

         <div className="divide-y divide-zinc-50 dark:divide-white/5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => {
                setSelectedOrderId(`ORD-2024-${100 + i}`);
                setActiveTab('order_detail');
              }}>
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <span className="text-lg font-black text-zinc-300 dark:text-white/10 w-8">{i}</span>
                       <div className="relative w-20 h-24 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform">
                          <Image src={`https://images.unsplash.com/photo-${[
                            "1594932224010-75f4383a54fd",
                            "1593032465175-481ac7f401a0",
                            "1598033129183-c4f50c717658"
                          ][i-1] || "1594932224010-75f4383a54fd"}?q=80&w=200&auto=format&fit=crop`} alt="order" fill className="object-cover" />
                       </div>
                       <div>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">ORD-2024-{100 + i}</p>
                          <h5 className="text-base font-black text-zinc-800 dark:text-zinc-100 italic-elegant">Bespoke Heritage Blazer {i}</h5>
                          <div className="flex items-center gap-3 mt-2">
                             <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                                <CheckCircle2 className="w-3 h-3" /> SHIPPED
                             </div>
                             <span className="text-[10px] text-zinc-400 font-medium italic italic-elegant">Delivered in 2024</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-16">
                       <div className="text-right">
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Investment</p>
                          <p className="text-xl font-black text-primary">${(850 + i * 50).toLocaleString()}</p>
                       </div>
                       <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-primary transition-colors" />
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const BenefitsView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
           <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-black uppercase tracking-tight">Elite Benefits Portal</h3>
      </div>

      <div className="bg-primary text-white rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden mb-12">
         <Star className="absolute top-1/2 right-12 -translate-y-1/2 text-white/10 w-64 h-64 -rotate-12 translate-x-32" />
         <div className="relative z-10 max-w-xl">
            <span className="bg-white/20 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{user.tier} STATUS ACTIVE</span>
            <h4 className="text-4xl font-black tracking-tight mt-6 mb-4 leading-tight">Your Artisan Legacy Continues.</h4>
            <p className="text-lg text-white/70 font-medium leading-relaxed italic italic-elegant">Enjoy complimentary preservation and fitting services as part of your membership.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {[
           { icon: ShieldCheck, title: "Artisan Alterations", desc: "Complimentary lifetime minor alterations for all bespoke orders." },
           { icon: Clock, title: "Priority Fitting", desc: "Access the master tailor's calendar 48 hours before general release." }
         ].map((benefit, i) => (
           <div key={i} className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-zinc-100 dark:border-white/10 shadow-xl group hover:border-primary/30 transition-all">
              <div className="bg-zinc-100 dark:bg-white/5 p-4 rounded-2xl w-fit mb-6 group-hover:bg-primary/10 transition-colors">
                 <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h5 className="text-lg font-black uppercase tracking-tight mb-2">{benefit.title}</h5>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">{benefit.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-50 dark:bg-black/20 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Sidebar - Profile Overview (Always Visible) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-zinc-100 dark:border-white/10 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{user.tier}</span>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 p-1 shadow-inner">
                <Image src={user.avatar} alt={user.name} fill className="object-cover rounded-full" />
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">{user.name}</h2>
                <p className="text-sm text-zinc-400 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-100 dark:border-white/10">
              {user.stats.map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <p className="text-sm font-black text-primary group-hover:scale-110 transition-transform">{stat.value}</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter leading-tight mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 flex items-center justify-center gap-2 text-zinc-400 hover:text-secondary text-[11px] font-black transition-colors py-2 group uppercase tracking-widest">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> SIGN OUT
            </button>
          </div>

          <div className="bg-primary text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group border border-primary/20">
            <Star className="absolute top-4 right-4 text-white/20 w-16 h-16 -rotate-12 translate-x-4 -translate-y-4 group-hover:rotate-0 transition-transform duration-700" />
            <h4 className="text-lg font-black tracking-tight mb-2">Emerald Elite Rewards</h4>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">You are 150 points away from Diamond Tier status and exclusive fittings.</p>
            <button 
              onClick={() => setActiveTab('benefits')}
              className="bg-white text-primary text-[11px] font-black px-6 py-3 rounded-full hover:bg-zinc-100 transition-colors uppercase tracking-widest shadow-xl active:scale-95"
            >
              View Benefits
            </button>
          </div>
        </aside>

        {/* Right Content - Full Screen Views */}
        <div className="lg:col-span-8">
          {activeTab === 'dashboard' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Recent Orders Section */}
              <section className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-zinc-100 dark:border-white/10 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                     <Package className="w-5 h-5 text-primary" /> Recent Orders
                   </h3>
                   <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-black text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest"
                   >
                      View All
                   </button>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "ORD-99212", date: "Oct 24, 2024", status: "In Fitting", total: 1280.00, img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=100&auto=format&fit=crop", item: "Midnight Silk Tuxedo" },
                    { id: "ORD-98105", date: "Sept 12, 2024", status: "Delivered", total: 350.00, img: "https://images.unsplash.com/photo-1594932224010-75f4383a54fd?q=80&w=100&auto=format&fit=crop", item: "Italian Wool Trousers" }
                  ].map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setActiveTab('order_detail');
                      }}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border border-zinc-50 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5 hover:border-primary/20 transition-all group cursor-pointer"
                    >
                       <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                             <Image src={order.img} alt={order.item} fill className="object-cover" />
                          </div>
                          <div>
                             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">{order.date}</p>
                             <h5 className="text-sm font-black text-zinc-800 dark:text-zinc-100">{order.item}</h5>
                             <p className="text-[11px] font-black text-primary mt-0.5">{order.id}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between md:justify-end gap-12 mt-4 md:mt-0">
                          <div className="text-right">
                             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Status</p>
                             <div className="flex items-center gap-1.5 justify-end">
                                <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-400 blink'}`} />
                                <p className="text-[11px] font-black text-zinc-800 dark:text-zinc-100 uppercase">{order.status}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Investment</p>
                             <p className="text-sm font-black text-zinc-800 dark:text-zinc-100">${order.total.toLocaleString()}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-primary transition-colors cursor-pointer" />
                       </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Account Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {menuItems.map((item, i) => (
                   <div 
                      key={i} 
                      onClick={() => setActiveTab(item.id)}
                      className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-zinc-100 dark:border-white/10 shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:border-primary/20 active:scale-[0.98]"
                   >
                      <div className="flex items-start gap-4">
                         <div className="bg-zinc-100 dark:bg-white/5 p-3 rounded-2xl group-hover:bg-primary/10 transition-colors">
                            <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">{item.label}</h4>
                            <p className="text-xs text-zinc-400 leading-tight">{item.desc}</p>
                         </div>
                      </div>
                   </div>
                 ))}

                 {/* Merchant Gateway */}
                 <Link 
                   href="/shop/merchant"
                   className="bg-primary p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                 >
                   <div className="absolute -bottom-2 -right-2 w-24 h-24 text-white/10 -rotate-12 group-hover:scale-110 transition-transform">
                     <Store className="w-full h-full" />
                   </div>
                   <div className="flex items-start gap-4 relative z-10">
                      <div className="bg-white/10 p-3 rounded-2xl">
                         <Store className="w-5 h-5 text-white" />
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-sm font-black text-white uppercase tracking-tight">Merchant Hub</h4>
                         <p className="text-xs text-white/60 leading-tight">Create your boutique & sync inventory.</p>
                      </div>
                   </div>
                 </Link>
              </div>
            </div>
          ) : activeTab === 'personal' ? (
            <PersonalInfoView />
          ) : activeTab === 'shipping' ? (
            <ShippingView />
          ) : activeTab === 'payment' ? (
            <PaymentView />
          ) : activeTab === 'orders' ? (
            <OrdersView />
          ) : activeTab === 'benefits' ? (
            <BenefitsView />
          ) : activeTab === 'order_detail' ? (
            <OrderDetailView />
          ) : (
            <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-zinc-200 dark:border-white/10 text-center animate-in zoom-in-95 duration-500">
               <div className="p-6 bg-zinc-50 dark:bg-white/5 rounded-full mb-6">
                  <Settings className="w-12 h-12 text-zinc-300 spin-slow" />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-100 mb-2">{activeTab.toUpperCase()} View Ready</h3>
               <p className="text-sm text-zinc-400 max-w-sm mb-8">This screen is fully connected to our bespoke backend. Our tailors are preparing the interface for your preferences.</p>
               <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Return to Dashboard
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Add New Hub Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300 px-6">
           <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-zinc-100 dark:border-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
              <div className="p-10">
                 <div className="flex justify-between items-center mb-10">
                    <h4 className="text-2xl font-black uppercase tracking-tight">New Bespoke Hub</h4>
                    <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-full transition-colors">
                       <Plus className="w-6 h-6 rotate-45" />
                    </button>
                 </div>

                 <form onSubmit={handleAddNewAddress} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Destination Label</label>
                       <input 
                         required
                         type="text" 
                         placeholder="e.g. Summer Suite, London"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-primary transition-colors font-bold text-sm" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Street / Floor / Unit</label>
                       <input 
                         required
                         type="text" 
                         placeholder="123 Avenue, Penthouse B"
                         value={formData.street}
                         onChange={(e) => setFormData({...formData, street: e.target.value})}
                         className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-primary transition-colors font-bold text-sm" 
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">City / Postal</label>
                          <input 
                            required
                            type="text" 
                            placeholder="Manhattan, NY 10001"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-primary transition-colors font-bold text-sm" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Region</label>
                          <select 
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-primary transition-colors font-bold text-sm"
                          >
                             <option>United States</option>
                             <option>United Kingdom</option>
                             <option>United Arab Emirates</option>
                             <option>Italy</option>
                          </select>
                       </div>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest text-xs mt-4">
                       Initialize Destination
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
