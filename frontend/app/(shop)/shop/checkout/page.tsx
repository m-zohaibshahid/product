"use client";

import { useCart } from '@/context/CartContext';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Lock, ShieldCheck, Truck, CreditCard, Landmark, Wallet } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, subtotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = cart.length > 0 ? 50.00 : 0;
  const total = subtotal + shipping;

  const handleFinalize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Order Successful! Your bespoke journey has begun. Our master tailors will contact you shortly for your confirmation.");
    }, 2500);
  };

  return (
    <div className="bg-zinc-50 dark:bg-black/20 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Checkout Main Column (Shipping & Payment) */}
        <div className="flex-grow space-y-8">
          <Link href="/shop/cart" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors mb-4 group">
             <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Selection
          </Link>

          <div className="bg-white dark:bg-white/5 rounded-3xl p-10 shadow-xl border border-zinc-100 dark:border-white/10 space-y-12">
            
            {/* Shipping Details */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">1</div>
                <h2 className="text-2xl font-black tracking-tighter uppercase text-primary">Shipping Credentials</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Full Identity</label>
                   <input type="text" placeholder="Johnathan Doe" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Contact Matrix (Phone)</label>
                   <input type="text" placeholder="+1 (234) 567-890" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all shadow-sm" />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Primary Residence (Address)</label>
                   <input type="text" placeholder="Avenue des Champs-Élysées, Suite 101" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">City / Prefecture</label>
                   <input type="text" placeholder="Paris" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Zip / Postal Core</label>
                   <input type="text" placeholder="75008" className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all shadow-sm" />
                </div>
              </div>
            </div>

            <hr className="border-zinc-100 dark:border-white/10" />

            {/* Payment Method Selection */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">2</div>
                <h2 className="text-2xl font-black tracking-tighter uppercase text-primary">Payment Allocation</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'card', name: "Credit/Debit Card", icon: CreditCard, subtitle: "Secure Processing" },
                  { id: 'bank', name: "Bank Transfer", icon: Landmark, subtitle: "Bespoke Direct" },
                  { id: 'wallet', name: "Digital Wallet", icon: Wallet, subtitle: "Instant Gateway" }
                ].map((p) => (
                  <div 
                    key={p.id} 
                    onClick={() => setPaymentMethod(p.id)}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all space-y-4 group shadow-lg ${paymentMethod === p.id ? 'border-primary ring-2 ring-primary/10 bg-primary/5' : 'border-zinc-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary/50'}`}
                  >
                    <p.icon className={`w-8 h-8 ${paymentMethod === p.id ? 'text-primary' : 'text-zinc-400 group-hover:text-primary transition-colors'}`} />
                    <div className="space-y-1">
                       <h4 className="text-xs font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-100">{p.name}</h4>
                       <p className="text-[9px] text-zinc-500 font-bold uppercase">{p.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Form Mockup */}
              {paymentMethod === 'card' && (
                <div className="p-8 bg-zinc-100 dark:bg-white/5 rounded-3xl border border-zinc-200 dark:border-white/10 mt-6 space-y-6 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Card Membership Identity</label>
                     <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input type="text" placeholder="Cardholder Name" className="w-full bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 pl-12 text-sm outline-none focus:border-primary transition-all" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Account Numerical Code</label>
                     <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all font-mono tracking-widest" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Expiry Matrix (MM/YY)</label>
                        <input type="text" placeholder="04 / 28" className="w-full bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">CVC Code (CVV)</label>
                        <input type="text" placeholder="123" className="w-full bg-white dark:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-primary transition-all" />
                     </div>
                  </div>
                </div>
              )}

              {paymentMethod !== 'card' && (
                <div className="p-8 bg-zinc-100 dark:bg-white/5 rounded-3xl border border-zinc-200 dark:border-white/10 mt-6 text-center space-y-4 animate-in fade-in slide-in-from-top-4">
                   <h3 className="text-sm font-black uppercase tracking-widest text-primary">Instructions Prepared</h3>
                   <p className="text-xs text-zinc-500 max-w-xs mx-auto">Specialized payment instructions will be dispatched to your contact matrix upon final order authorization.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Checkout Sidebar Summary */}
        <div className="lg:w-96 space-y-8">
           <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border border-zinc-100 dark:border-white/10 space-y-8 sticky top-32">
              <h3 className="text-xl font-black uppercase tracking-tighter pb-4 border-b border-zinc-100 dark:border-white/10 text-primary">Atelier Order Brief</h3>
              
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                 {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                          <img src={item.img} alt={item.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex flex-col justify-center">
                          <h5 className="text-[11px] font-black tracking-tight text-zinc-800 dark:text-zinc-100 leading-tight">{item.name}</h5>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                             <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${item.construction === 'unstitched' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                {item.construction === 'unstitched' ? 'Unstitched' : 'Stitched'}
                             </span>
                             <span className="text-[9px] text-zinc-500 font-bold uppercase">
                                QTY: {item.qty} • {item.construction === 'unstitched' ? (item.fabricType === 'cut' ? `${item.meters}m` : '4.5m Suit') : `SIZE: ${item.size || 'STD'}`}
                             </span>
                          </div>
                          <p className="text-xs font-black text-primary mt-1">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                 ))}
                 {cart.length === 0 && <p className="text-[10px] text-zinc-400 font-black uppercase text-center py-4 italic">No items in selection</p>}
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-white/10 space-y-4">
                 <div className="flex justify-between text-xs font-black tracking-widest text-zinc-400 uppercase">
                    <span>Selection Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-xs font-black tracking-widest text-zinc-400 uppercase">
                    <span>Bespoke Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-baseline pt-6 border-t border-zinc-100 dark:border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Final Investment</span>
                    <span className="text-3xl font-black text-primary dark:text-white tracking-tighter">${total.toFixed(2)}</span>
                 </div>
              </div>

              <button 
                onClick={handleFinalize}
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-2xl hover:bg-primary-container active:scale-95 transition-all text-sm tracking-widest flex items-center justify-center gap-3 group disabled:opacity-50 pointer-events-auto"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    AUTHORIZING...
                  </>
                ) : (
                  <>FINALIZE ORDER <Lock className="w-4 h-4 ml-2" /></>
                )}
              </button>

              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-white/10">
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase text-emerald-500 tracking-tighter">
                   <ShieldCheck className="w-4 h-4" /> SSL ENCRYPTED GATEWAY
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-400 tracking-tighter">
                   <Truck className="w-4 h-4" /> TRACKED BESPOKE SHIPMENT
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
