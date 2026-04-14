"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, subtotal } = useCart();
  
  const shipping = cart.length > 0 ? 50.00 : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-zinc-50 dark:bg-black/20 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items List */}
          <div className="flex-grow space-y-8">
            <div className="flex justify-between items-center text-zinc-400 dark:text-zinc-500 text-xs font-black uppercase tracking-[.2em] pb-6 border-b border-zinc-200 dark:border-white/10">
               <span>Your Curated Selection ({cart.length})</span>
               <Link href="/shop" className="text-primary hover:underline underline-offset-4 tracking-normal font-bold">CONTINUE SHOPPING</Link>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="group relative flex gap-8 bg-white dark:bg-white/5 p-8 rounded-3xl shadow-xl border border-zinc-100 dark:border-white/10 transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className="relative w-32 h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <Image src={item.img} alt={item.name} fill className="object-cover" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between py-2">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight leading-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-300 hover:text-red-500 transition-colors p-2 bg-zinc-50 dark:bg-white/5 rounded-xl cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                      <span className={`px-2 py-0.5 rounded ${item.construction === 'unstitched' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                        {item.construction === 'unstitched' ? 'Unstitched Fabric' : 'Bespoke Stitched'}
                      </span>
                      {item.construction === 'unstitched' ? (
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-white/10 text-zinc-500 rounded">
                          {item.fabricType === 'cut' ? `${item.meters} Meters` : 'Full Suit (4.5m)'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-white/10 text-zinc-500 rounded">Size: {item.size || 'STD'}</span>
                      )}
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded italic">In Stock</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/10 px-4 py-2 gap-6 shadow-sm">
                      <button 
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="text-zinc-400 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-black text-zinc-700 dark:text-zinc-200 w-4 text-center">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="text-zinc-400 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right space-y-1">
                       <p className="text-xs text-zinc-400 font-bold">Price per unit: ${item.price}</p>
                       <p className="text-2xl font-black text-primary dark:text-white tracking-tighter">${item.price * item.qty}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State Mockup Prompt */}
            {cart.length === 0 && (
              <div className="text-center py-20 px-8 bg-white dark:bg-white/5 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/10 space-y-6">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-zinc-300"><Trash2 className="w-8 h-8" /></div>
                <h3 className="text-2xl font-black text-zinc-800 dark:text-zinc-100">Your selection is empty</h3>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto">Explore our Bespoke collection and add timeless elegance to your wardrobe.</p>
                <Link href="/shop" className="inline-block bg-primary text-white font-black px-12 py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-sm tracking-widest">START SHOPPING</Link>
              </div>
            )}
          </div>

          {/* Checkout Summary Sidebar */}
          <div className="lg:w-96 space-y-6">
            <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border border-zinc-100 dark:border-white/10 space-y-8 sticky top-32">
               <h2 className="text-xl font-black uppercase tracking-tighter pb-4 border-b border-zinc-100 dark:border-white/10 text-primary">Atelier Summary</h2>
               
               <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 font-medium">Subtotal</span>
                    <span className="font-black text-zinc-800 dark:text-zinc-200">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 font-medium">Bespoke Shipping</span>
                    <span className="font-black text-zinc-800 dark:text-zinc-200">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 font-medium">Duties & Taxes</span>
                    <span className="font-black text-emerald-500">INCLUSIVE</span>
                  </div>
               </div>

               <div className="pt-6 border-t border-zinc-100 dark:border-white/10">
                  <div className="flex justify-between items-baseline mb-8">
                    <span className="text-xs font-black uppercase tracking-[.2em] text-zinc-400">Total Investment</span>
                    <span className="text-4xl font-black text-primary dark:text-white tracking-tighter">${total.toFixed(2)}</span>
                  </div>
                  
                  <Link href="/shop/checkout" className={`block w-full bg-primary text-white text-center font-black py-5 rounded-2xl shadow-2xl hover:bg-primary-container active:scale-95 transition-all text-sm tracking-widest flex items-center justify-center gap-3 group ${cart.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                    PROCEED TO CHECKOUT
                  </Link>
               </div>

               <div className="space-y-4 pt-4">
                 <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-black uppercase tracking-tight">
                   <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure Checkout Guaranteed
                 </div>
                 <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-black uppercase tracking-tight">
                   <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Atelier Official Protection
                 </div>
               </div>
            </div>

            {/* Promo Code Box */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-lg border border-zinc-100 dark:border-white/10">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Promotional Privilege</h4>
               <div className="flex gap-2">
                 <input type="text" placeholder="Access Code" className="flex-grow bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary transition-all uppercase font-bold tracking-widest placeholder:normal-case placeholder:font-normal placeholder:tracking-normal" />
                 <button className="bg-zinc-800 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-black transition-all">APPLY</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
