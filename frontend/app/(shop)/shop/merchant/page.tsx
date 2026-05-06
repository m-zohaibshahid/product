"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Store, 
  ShieldCheck, 
  Globe, 
  Zap, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Building2,
  Lock,
  PackageCheck
} from 'lucide-react';
import Link from 'next/link';

export default function MerchantOnboarding() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: "Boutique Identity", desc: "Define your brand legacy" },
    { id: 2, title: "Inventory Calibration", desc: "Sync your luxury catalog" },
    { id: 3, title: "Global Authorization", desc: "Verify artisanal standards" }
  ];

  const handleInitialize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(step + 1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-100 selection:bg-primary selection:text-white">
      {/* Header */}
      <nav className="p-8 flex justify-between items-center bg-white dark:bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-100 dark:border-white/5 sticky top-0 z-50">
        <Link href="/shop" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic-elegant">Atelier <span className="text-primary">Merchant</span></span>
        </Link>
        <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors">
          Support Portal
        </button>
      </nav>

      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Progress Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight leading-tight">Forge Your <br />Artisan Legacy.</h2>
              <p className="text-zinc-500 font-medium italic-elegant italic">"The digital gateway for the world's most elite tailors and fabric mills."</p>
            </div>

            <div className="space-y-4">
              {steps.map((s) => (
                <div key={s.id} className={`flex gap-4 items-center p-4 rounded-3xl transition-all ${step === s.id ? 'bg-primary text-white shadow-2xl scale-105' : 'bg-white dark:bg-white/5 border border-zinc-100 dark:border-white/5 opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${step === s.id ? 'bg-white text-primary' : 'bg-zinc-100 dark:bg-white/10'}`}>
                    {s.id}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest">{s.title}</h4>
                    <p className={`text-[10px] ${step === s.id ? 'text-white/70' : 'text-zinc-400'}`}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-zinc-800 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
               <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 -rotate-12" />
               <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h5 className="text-sm font-black uppercase tracking-widest leading-tight">Artisanal Verification</h5>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-bold uppercase">All merchants undergo a 48-hour calibration to ensure Atelier standards.</p>
               </div>
            </div>
          </aside>

          {/* Main Content Areas */}
          <main className="lg:col-span-8">
            {step === 1 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-12 border border-zinc-100 dark:border-white/10 shadow-2xl space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black tracking-tight uppercase">Boutique Identity</h3>
                       <p className="text-sm text-zinc-500 font-medium italic">How will the elite world recognize your craft?</p>
                    </div>
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                  </div>

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-50 dark:border-white/5">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Boutique Name</label>
                       <input type="text" placeholder="e.g. Savile Row Collective" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-5 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Merchant Category</label>
                       <select className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-5 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm cursor-pointer">
                          <option>Master Tailor House</option>
                          <option>Luxury Fabric Mill</option>
                          <option>Artisan Accessory Studio</option>
                          <option>Heritage Workshop</option>
                       </select>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Brand Manifesto (Bio)</label>
                       <textarea rows={4} placeholder="Describe your heritage, techniques, and artisanal philosophy..." className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-5 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm italic-elegant italic resize-none" />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Global Hub Location</label>
                       <div className="flex gap-4 bg-zinc-50 dark:bg-white/5 p-5 rounded-2xl border border-zinc-100 dark:border-white/10 items-center">
                          <Globe className="w-5 h-5 text-primary" />
                          <input type="text" placeholder="City, Country" className="flex-1 bg-transparent outline-none font-bold text-sm" />
                       </div>
                    </div>
                  </form>

                  <button 
                    onClick={handleInitialize}
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin" /> SYNCHRONIZING SECURE NODE...
                      </>
                    ) : (
                      <>
                        INITIALIZE BOUTIQUE <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-12 border border-zinc-100 dark:border-white/10 shadow-2xl space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black tracking-tight uppercase">Inventory Matrix</h3>
                       <p className="text-sm text-zinc-500 font-medium italic italic-elegant underline decoration-primary/20">Linking your Ledger (Inventory) to the Atelier Shop.</p>
                    </div>
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>

                  <div className="space-y-6 pt-8 border-t border-zinc-50 dark:border-white/5">
                     <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-center gap-8 group hover:bg-primary/10 transition-all cursor-pointer">
                        <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                           <PackageCheck className="w-10 h-10 text-primary" />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-lg font-black uppercase tracking-tight">Active Ledger Detected</h4>
                           <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-2 uppercase tracking-widest font-bold">We found <span className="text-primary">12 Heritage Products</span> in your local inventory system. Link them to the global storefront now.</p>
                        </div>
                        <ChevronRight className="w-8 h-8 text-primary opacity-40" />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-zinc-50 dark:bg-white/5 rounded-[2.5rem] border border-zinc-100 dark:border-white/10 space-y-4">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                              <span>Fabric Stock</span>
                              <span className="text-primary">820m Total</span>
                           </div>
                           <p className="text-xs font-bold leading-relaxed">Your "Elite Unstitched" collections will be automatically priced per meter based on your ledger rates.</p>
                        </div>
                        <div className="p-8 bg-zinc-50 dark:bg-white/5 rounded-[2.5rem] border border-zinc-100 dark:border-white/10 space-y-4">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                              <span>Bespoke Units</span>
                              <span className="text-primary">48 Crafted</span>
                           </div>
                           <p className="text-xs font-bold leading-relaxed">Ready-to-wear "Stitched" masterpieces will sync their size grids and real-time availability.</p>
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={handleInitialize}
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" /> MAPPING DATA ARCHITECTURE...
                      </>
                    ) : (
                      <>
                        SYNC LEDGER DATA <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="bg-zinc-900 rounded-[3.5rem] p-16 border border-white/5 shadow-2xl text-center space-y-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                  
                  <div className="relative z-10 space-y-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-bounce">
                       <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    
                    <div className="space-y-4">
                       <h3 className="text-4xl font-black tracking-tight text-white uppercase italic-elegant">Authorization Complete.</h3>
                       <p className="text-zinc-400 max-w-md mx-auto leading-relaxed font-medium italic">"Your artisanal workspace is now live. Every inventory update in your Ledger will now reflect in your global Atelier storefront."</p>
                    </div>

                    <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5">
                       <div>
                          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Store Status</p>
                          <p className="text-sm font-black text-primary uppercase mt-1">Operational</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Sync Heartbeat</p>
                          <p className="text-sm font-black text-emerald-400 uppercase mt-1">Live - 0ms</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Artisan Rank</p>
                          <p className="text-sm font-black text-amber-400 uppercase mt-1">Verified</p>
                       </div>
                    </div>

                    <Link href="/inventory" className="inline-flex items-center gap-4 bg-white text-primary px-12 py-6 rounded-3xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl hover:bg-zinc-100 transition-all active:scale-95">
                       ENTER MERCHANT WORKSPACE <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Trust Badges */}
      <footer className="max-w-6xl mx-auto py-20 px-6 border-t border-zinc-100 dark:border-white/5">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
               <p className="text-lg font-black uppercase tracking-tighter">$14B+</p>
               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Luxury Transacted</p>
            </div>
            <div className="space-y-2">
               <p className="text-lg font-black uppercase tracking-tighter">140+</p>
               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Artisan Hubs</p>
            </div>
            <div className="space-y-2">
               <p className="text-lg font-black uppercase tracking-tighter">0.1%</p>
               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Inventory Variance</p>
            </div>
            <div className="space-y-2">
               <p className="text-lg font-black uppercase tracking-tighter">Global</p>
               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Tax Compliance</p>
            </div>
         </div>
      </footer>
    </div>
  );
}
