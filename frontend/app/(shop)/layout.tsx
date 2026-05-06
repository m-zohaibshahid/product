"use client";

import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, Heart, Bell } from 'lucide-react';
import { CartProvider, useCart } from '@/context/CartContext';

function ShopHeader() {
  const { cartCount } = useCart();
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1F2E4D]/80 backdrop-blur-xl border-b border-outline-variant/30 dark:border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter flex-shrink-0">
          ATELIER<span className="text-primary tracking-normal font-light">.CONCIERGE</span>
        </Link>
        
        {/* Search Bar - Daraz Style but Premium */}
        <Link href="/shop/search" className="hidden lg:flex flex-grow relative max-w-2xl group cursor-pointer">
          <div className="w-full bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-primary/30 dark:focus:border-white/20 rounded-full py-2.5 px-6 pl-12 text-sm outline-none transition-all flex items-center text-zinc-400">
            Search for bespoke fabrics, suits, and accessories...
          </div>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus:text-primary transition-colors" />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-5 py-1.5 rounded-full hover:opacity-90 transition-opacity flex items-center h-[calc(100%-8px)]">
            SEARCH
          </div>
        </Link>

        {/* Action Icons */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          <Link href="/shop/profile" className="hidden md:flex flex-col items-center group cursor-pointer">
            <User className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
            <span className="text-[9px] font-bold uppercase mt-1 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Profile</span>
          </Link>
          
          <Link href="/shop/search" className="hidden md:flex flex-col items-center group cursor-pointer relative">
            <Heart className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
            <span className="text-[9px] font-bold uppercase mt-1 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Wishlist</span>
            <span className="absolute -top-1 right-0 bg-secondary text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1F2E4D]">2</span>
          </Link>

          <Link href="/shop/cart" className="flex flex-col items-center group cursor-pointer relative">
            <ShoppingBag className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
            <span className="text-[9px] font-bold uppercase mt-1 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Cart</span>
            <span className="absolute -top-1 right-1 bg-primary text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1F2E4D]">{cartCount}</span>
          </Link>

          <Menu className="w-6 h-6 lg:hidden text-zinc-900 dark:text-zinc-100" />
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="max-w-7xl mx-auto mt-4 hidden md:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 overflow-x-auto no-scrollbar pb-1">
        <Link href="/shop" className="hover:text-primary transition-colors whitespace-nowrap">Home</Link>
        <Link href="/shop/search?cat=New Arrivals" className="hover:text-primary transition-colors whitespace-nowrap">New Arrivals</Link>
        <Link href="/shop/search?cat=Bespoke Suits" className="hover:text-primary transition-colors whitespace-nowrap">Bespoke Suits</Link>
        <Link href="/shop/search?cat=Luxury Fabrics" className="hover:text-primary transition-colors whitespace-nowrap">Luxury Fabrics</Link>
        <Link href="/shop/search?cat=Tailored Shirts" className="hover:text-primary transition-colors whitespace-nowrap">Accessories</Link>
        <Link href="/shop/search?cat=Heritage Outerwear" className="hover:text-primary transition-colors whitespace-nowrap">Heritage Series</Link>
        <Link href="/shop/search?cat=Sale" className="hover:text-primary transition-colors whitespace-nowrap text-red-500/80">Sale</Link>
      </nav>
    </header>
  );
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-surface dark:bg-[#1F2E4D] text-on-surface dark:text-zinc-100 flex flex-col font-['Inter']">
        {/* Top Banner / Announcement */}
        <div className="bg-primary text-white text-[11px] py-2 px-6 text-center font-medium tracking-wide uppercase">
          Complimentary Bespoke Consultation on orders above $1500 • Worldwide Shipping
        </div>

        <ShopHeader />

        <main className="grow">
          {children}
        </main>

      {/* Modern Footer */}
      <footer className="bg-zinc-100 dark:bg-black/20 border-t border-outline-variant/30 dark:border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4 md:px-0">
            <div className="space-y-6">
              <h3 className="text-xl font-bold tracking-tighter">ATELIER<span className="text-primary uppercase tracking-normal font-light">.CLOTHIERS</span></h3>
              <p className="text-sm text-zinc-500 leading-relaxed">Defining modern elegance through timeless tailoring and artisan excellence.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Customer Care</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Shipping & Delivery</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Atelier Concierge</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-primary transition-colors">Book a Consultation</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Measurement Guide</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Fabric Selection</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Newsletter</h4>
              <p className="text-xs text-zinc-400 mb-4 italic italic-elegant underline decoration-secondary decoration-2 underline-offset-4">Join our inner circle for exclusive updates.</p>
              <div className="flex">
                <input type="text" placeholder="Email Address" className="bg-white dark:bg-white/5 text-xs p-2.5 outline-none border border-zinc-200 dark:border-white/10 flex-grow" />
                <button className="bg-primary text-white px-4 text-xs font-bold tracking-widest">JOIN</button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-200 dark:border-white/5 text-center text-zinc-400 text-[10px] tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Atelier Global Intelligence. Crafted for the Modern Elite.
          </div>
        </div>
      </footer>
    </div>
    </CartProvider>
  );
}
