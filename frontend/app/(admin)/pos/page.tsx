'use client';
import React, { useState } from 'react';
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
  Smartphone,
  CheckCircle2,
  Package,
  ArrowRight,
  TrendingDown,
  Info,
  X,
  CreditCard as CardIcon,
  Tag
} from 'lucide-react';
import Toast from '@/components/ui/Toast';

const categories = ['All', 'Tailored Outerwear', 'Accessories', 'Bottoms', 'Seasonal', 'Bespoke Essentials'];

const products = [
  { id: 1, name: 'Classic Oxford Shirt', category: 'Bespoke Essentials', price: 185.00, sku: 'SKU-7721', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c717658?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 2, name: 'Merino Wool Blazer', category: 'Tailored Outerwear', price: 845.00, sku: 'SKU-8812', image: 'https://images.unsplash.com/photo-1594932224010-74f43a3bb053?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 3, name: 'Heritage Silk Tie', category: 'Accessories', price: 125.00, sku: 'SKU-4402', image: 'https://images.unsplash.com/photo-1589756823851-4043b23838ae?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 4, name: 'Slim-Fit Chinos', category: 'Bottoms', price: 165.00, sku: 'SKU-1192', image: 'https://images.unsplash.com/photo-1473963456434-51772879567c?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 5, name: 'Pure Cashmere Scarf', category: 'Seasonal', price: 245.00, sku: 'SKU-0031', image: 'https://images.unsplash.com/photo-1520903920243-00d872128e7a?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 6, name: 'Italian Leather Belt', category: 'Accessories', price: 95.00, sku: 'SKU-5521', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=300&h=300' },
];

export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{id: number, name: string, price: number, qty: number}[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      setToastMsg(`${product.name} added to draft order.`);
      setShowToast(true);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
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

  const handleCheckout = () => {
    setToastMsg('Order finalized. Transaction ledger synchronized.');
    setShowToast(true);
    setCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.15; // 15% Atelier VAT
  const total = subtotal + tax;

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-10 animate-fade-in pb-10">
      {/* Left Panel: Catalog */}
      <section className="flex-1 flex flex-col gap-10 overflow-hidden">
        <header className="space-y-8">
          <div className="flex items-center justify-between">
             <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter italic-elegant">Bespoke POS</h1>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Direct Client Engagement Module</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                   <input type="text" placeholder="Search product or SKU..." className="pl-10 pr-6 py-3 bg-zinc-50 dark:bg-gray-500 rounded-xl text-xs font-bold outline-none border-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white w-64 transition-all dark:text-white" />
                </div>
                <button className="p-3 bg-white dark:bg-gray-500 rounded-xl border border-zinc-100 dark:border-gray-500 hover:bg-zinc-50 dark:hover:bg-gray-500/80 transition-all">
                  <Info className="w-5 h-5 text-zinc-400" />
                </button>
             </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
             {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all
                    ${selectedCategory === cat 
                      ? 'bg-zinc-900 text-white dark:bg-blue-600 shadow-xl shadow-zinc-200 dark:shadow-black/30' 
                      : 'bg-zinc-50 dark:bg-gray-500 text-zinc-400 dark:text-white/60 hover:bg-zinc-100 dark:hover:bg-gray-500'}`}
                >
                  {cat}
                </button>
             ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {products.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map((product) => (
                <div 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group bg-white dark:bg-gray-500 rounded-[32px] border border-zinc-100 dark:border-gray-500 p-6 cursor-pointer hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 active:scale-95"
                >
                   <div className="aspect-square rounded-[24px] overflow-hidden mb-6 relative">
                      <img src={product.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter text-zinc-900 dark:text-white border border-white/20">
                         {product.sku}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div>
                         <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3 h-3" /> {product.category}</p>
                         <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase">{product.name}</h3>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-gray-500">
                         <span className="text-xl font-bold text-zinc-900 dark:text-white">${product.price.toFixed(2)}</span>
                         <div className="w-10 h-10 bg-zinc-50 dark:bg-gray-500 rounded-full flex items-center justify-center text-zinc-400 dark:text-white group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-90">
                            <Plus className="w-5 h-5" />
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Right Panel: Order Drawer */}
      <aside className="w-[420px] bg-white dark:bg-gray-500 rounded-[48px] shadow-2xl overflow-hidden flex flex-col border border-zinc-100 dark:border-gray-500">
         <header className="p-10 pb-6 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-zinc-900 dark:text-white italic-elegant uppercase tracking-tighter">Current Order</h3>
               <div className="w-12 h-12 bg-zinc-100 dark:bg-gray-500 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">{cart.length}</span>
                  )}
               </div>
            </div>

            <div className="p-5 bg-zinc-50 dark:bg-gray-500 border border-zinc-100 dark:border-gray-500/30 rounded-[28px] flex items-center gap-4 group cursor-pointer hover:bg-zinc-100 dark:hover:bg-gray-500/50 transition-all">
               <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <User className="w-6 h-6" />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-white/40 uppercase tracking-widest mb-0.5">Assigned Client</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight">VIP Private Account</p>
               </div>
               <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-white/20 group-hover:translate-x-1 transition-transform" />
            </div>
         </header>

         <div className="flex-1 overflow-y-auto px-10 py-6 space-y-8 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center space-y-4">
                 <Package className="w-12 h-12 opacity-20" />
                 <p className="text-xs font-bold uppercase tracking-widest">Bag is currently empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="group flex items-start gap-4">
                   <div className="flex-1 space-y-1">
                      <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-bold text-zinc-500 dark:text-white/40 uppercase tracking-widest italic">${item.price.toFixed(2)} unit</p>
                   </div>
                   <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-4 bg-gray-500/20 p-1.5 rounded-full border border-gray-500/30 scale-90 origin-right">
                         <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full hover:bg-gray-500/30 flex items-center justify-center text-white transition-all"><Minus className="w-3.5 h-3.5" /></button>
                         <span className="text-xs font-black text-white min-w-[1rem] text-center">{item.qty}</span>
                         <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full hover:bg-gray-500/30 flex items-center justify-center text-white transition-all"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[9px] font-black text-red-500/60 uppercase tracking-widest hover:text-red-500 transition-all flex items-center gap-1 opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /> Remove Item</button>
                   </div>
                </div>
              ))
            )}
         </div>

         <footer className="p-10 pt-6 bg-gray-500/20 space-y-10 border-t border-gray-500/20">
            <div className="space-y-4">
               <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                  <span>Subtotal Matrix</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                  <span>Atelier Fee (15%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
               </div>
               <div className="h-[1px] bg-gray-500/30" />
               <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-[0.4em]">Total Commitment</span>
                  <span className="text-3xl font-black text-zinc-900 dark:text-white italic-elegant leading-none uppercase">${total.toFixed(2)}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-3 py-5 bg-gray-500/20 rounded-[24px] hover:bg-gray-500/30 transition-all group border border-gray-500/30">
                  <CreditCard className="w-5 h-5 text-zinc-500 group-hover:text-blue-400" />
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Card</span>
               </button>
               <button className="flex items-center justify-center gap-3 py-5 bg-gray-500/20 rounded-[24px] hover:bg-gray-500/30 transition-all group border border-gray-500/30">
                  <Banknote className="w-5 h-5 text-zinc-500 group-hover:text-green-500" />
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Cash</span>
               </button>
            </div>

            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={`w-full py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.5em] shadow-2xl transition-all flex items-center justify-center gap-4
                ${cart.length > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-500/20 text-white/20 cursor-not-allowed'}`}
            >
              Sign & Pay <ArrowRight className="w-5 h-5" />
            </button>
         </footer>
      </aside>

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
        type="success" 
      />
    </div>
  );
}
