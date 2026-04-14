'use client';
import Link from 'next/link';
import { ShoppingBag, Settings, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function EntryPortal() {
  const { theme } = useTheme();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background transition-colors duration-500">
      <div className="max-w-4xl w-full text-center mb-16 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tighter italic-elegant">
          Atelier Global
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">
          Signature Fashion Management Portal
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl animate-slide-in">
        <Link 
          href="/shop"
          className="group relative bg-gray-300 dark:bg-gray-500 border border-zinc-100 dark:border-gray-500 rounded-[40px] p-12 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center shadow-sm"
        >
          <div className="w-24 h-24 bg-white dark:bg-gray-200 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500">
            <ShoppingBag className="w-10 h-10 text-zinc-400 group-hover:text-white transition-colors" />
          </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tighter">Concierge Store</h2>
        <p className="text-zinc-500 dark:text-zinc-300 font-medium leading-relaxed mb-10 text-sm">
          Experience the bespoke collection as a client. Browse high-fidelity assets and manage personal commissions.
        </p>
        <div className="mt-auto flex items-center text-blue-600 dark:text-white font-black uppercase tracking-widest text-[10px]">
          Enter Concierge <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </Link>

        {/* Inventory/Admin Card */}
        <Link 
          href="/dashboard"
          className="group relative bg-gray-300 dark:bg-gray-200 border border-zinc-100 dark:border-gray-500 rounded-[40px] p-12 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center shadow-sm"
        >
          <div className="w-24 h-24 bg-white dark:bg-gray-200 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-zinc-900 dark:group-hover:bg-blue-600 group-hover:-rotate-12 transition-all duration-500 text-zinc-500 group-hover:text-white">
            <Settings className="w-10 h-10 transition-colors" />
          </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-4 uppercase tracking-tighter">Atelier Ledger</h2>
        <p className="text-zinc-500 dark:text-zinc-200 font-medium leading-relaxed mb-10 text-sm">
          Operational dashboard for master tailors. Control stock levels, inventory audits, and financial registries.
        </p>
        <div className="mt-auto flex items-center text-zinc-900 dark:text-white font-black uppercase tracking-widest text-[10px]">
          Open Ledger <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </Link>
      </div>

      <footer className="mt-20 text-zinc-400 text-[9px] font-black tracking-[0.5em] uppercase border-t border-zinc-100 dark:border-zinc-800 pt-8 w-full max-w-xs text-center">
        © 2024 Atelier Intelligence
      </footer>
    </main>
  );
}
