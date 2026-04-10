'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { 
  Search, 
  ShoppingCart, 
  User, 
  ChevronRight, 
  Minus, 
  Plus, 
  Trash2,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';

const categories = ['All', 'Tailored outerwear', 'Accessories', 'Bottoms', 'Seasonal', 'Bespoke Essentials'];

const products = [
  { id: 1, name: 'Classic Oxford Shirt', category: 'Bespoke Essentials', price: 185.00, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c717658?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 2, name: 'Merino Wool Blazer', category: 'Tailored outerwear', price: 845.00, image: 'https://images.unsplash.com/photo-1594932224010-74f43a3bb053?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 3, name: 'Heritage Silk Tie', category: 'Accessories', price: 125.00, image: 'https://images.unsplash.com/photo-1589756823851-4043b23838ae?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 4, name: 'Slim-Fit Chinos', category: 'Bottoms', price: 165.00, image: 'https://images.unsplash.com/photo-1473963456434-51772879567c?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 5, name: 'Pure Cashmere Scarf', category: 'Seasonal', price: 245.00, image: 'https://images.unsplash.com/photo-1520903920243-00d872128e7a?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 6, name: 'Italian Leather Belt', category: 'Accessories', price: 95.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200&h=200' },
];

export default function POSPage() {
  const [cart, setCart] = useState<{id: number, name: string, price: number, qty: number}[]>([
    { id: 1, name: 'Classic Oxford Shirt', price: 185.0, qty: 1 },
    { id: 3, name: 'Heritage Silk Tie', price: 125.0, qty: 1 }
  ]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-12 animate-in fade-in duration-700 overflow-hidden">
      {/* Left Panel: Product Browser */}
      <section className="flex-1 flex flex-col gap-10">
        <header className="flex flex-col gap-6">
          <div>
            <h2 className="display-sm text-primary tracking-tight mb-1 italic-elegant opacity-90">Point of Sale (POS)</h2>
            <p className="text-on-surface-variant/70 label-md text-[10px] font-black uppercase tracking-[0.2em] leading-none">Bespoke Catalog Browser</p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search catalog by name or category..." 
                className="w-full bg-surface-container-low/50 py-4 pl-14 pr-6 rounded-md hover:bg-surface-container-low transition-colors focus:outline-none focus:bg-surface-container-lowest border border-transparent focus:border-outline-variant/10 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300
                  ${cat === 'All' 
                    ? 'bg-primary text-surface-container-lowest shadow-md' 
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-4 scrollbar-minimal">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
            {products.map((product) => (
              <div 
                key={product.id}
                onClick={() => addToCart(product)}
                className="group p-6 bg-surface-container-lowest rounded-xl ambient-shadow cursor-pointer transition-all duration-500 hover:translate-y-[-4px] active:scale-95"
              >
                <div className="aspect-square bg-surface-container-low rounded-lg mb-6 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">{product.category}</p>
                  <p className="text-sm font-semibold text-primary mb-4 truncate">{product.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary italic opacity-80">${product.price.toFixed(2)}</p>
                    <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Right Panel: Current Order */}
      <aside className="w-[420px] h-full flex flex-col bg-surface-container-low rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-primary/5">
        <header className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="title-lg text-primary tracking-tight opacity-90 underline-offset-4 decoration-primary/10 decoration-2">Current Order</h3>
            <div className="relative">
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">{cart.length}</span>
              <ShoppingCart className="w-6 h-6 text-primary/60" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl ambient-shadow cursor-pointer hover:bg-surface transition-colors group">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest leading-none mb-1 opacity-50">Assigned Client</p>
              <p className="text-sm font-semibold text-primary truncate leading-none">Private Collection Account</p>
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:translate-x-1 transition-transform" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-4 scrollbar-hide">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="group flex gap-4 animate-in slide-in-from-right-4 duration-500">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary mb-1 underline-offset-4 group-hover:underline">{item.name}</p>
                  <p className="text-[10px] text-on-surface-variant/50 font-bold uppercase tracking-widest italic">${item.price.toFixed(2)} unit</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-3 bg-surface-container-lowest rounded-full p-1 shadow-sm border border-outline-variant/10">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full hover:bg-surface-container-low flex items-center justify-center text-primary transition-colors focus:outline-none">
                      <Minus className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                    <span className="text-xs font-black min-w-[1.2rem] text-center text-primary">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full hover:bg-surface-container-low flex items-center justify-center text-primary transition-colors focus:outline-none">
                      <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-error uppercase font-black tracking-widest opacity-0 group-hover:opacity-60 hover:opacity-100 transition-all focus:outline-none flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="p-8 bg-surface-container-highest/20 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-medium text-on-surface-variant/70 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-primary font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-on-surface-variant/70 uppercase tracking-widest">
              <span>Tailoring Tax (8.25%)</span>
              <span className="text-primary font-bold">${tax.toFixed(2)}</span>
            </div>
            <div className="h-[1px] bg-outline-variant/20 my-4" />
            <div className="flex justify-between items-end">
              <span className="text-sm font-black text-primary uppercase tracking-[0.25em]">Grand Total</span>
              <span className="text-2xl font-bold text-primary italic leading-none">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <button className="flex flex-col items-center justify-center gap-2 py-4 bg-surface-container-lowest rounded-xl hover:bg-white hover:shadow-lg transition-all text-primary group active:scale-95">
                <Banknote className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Cash</span>
             </button>
             <button className="flex flex-col items-center justify-center gap-2 py-4 bg-surface-container-lowest rounded-xl hover:bg-white hover:shadow-lg transition-all text-primary group active:scale-95">
                <CreditCard className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Card</span>
             </button>
             <button className="flex flex-col items-center justify-center gap-2 py-4 bg-surface-container-lowest rounded-xl hover:bg-white hover:shadow-lg transition-all text-primary group active:scale-95 border-2 border-primary/10 border-dashed">
                <Smartphone className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Split</span>
             </button>
          </div>

          <Button variant="primary" size="lg" className="w-full text-[13px] tracking-[0.4em]">Finalize & Pay</Button>
        </footer>
      </aside>
    </div>
  );
}
