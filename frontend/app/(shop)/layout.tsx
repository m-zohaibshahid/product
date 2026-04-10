import Link from 'next/link';
import { ShoppingBag, Search, User } from 'lucide-react';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-zinc-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            ATELIER
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <Link href="/shop" className="text-zinc-900 hover:opacity-60 transition-opacity">New Arrivals</Link>
            <Link href="#" className="hover:opacity-60 transition-opacity">Collections</Link>
            <Link href="#" className="hover:opacity-60 transition-opacity">About</Link>
          </nav>

          <div className="flex items-center space-x-6">
            <Search className="w-5 h-5 text-zinc-400 cursor-pointer" />
            <div className="relative cursor-pointer">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">0</span>
            </div>
            <Link href="/" className="text-[10px] font-bold border border-zinc-200 px-3 py-1 rounded hover:bg-zinc-50">SWITCH PORTAL</Link>
          </div>
        </div>
      </header>

      <main className="grow">
        {children}
      </main>

      {/* Basic Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-100 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-zinc-400 text-xs tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Atelier Clothiers. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
