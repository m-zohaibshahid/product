'use client';
import React from 'react';
import { Search, Bell, User, Settings } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="h-20 bg-white dark:bg-gray-500 border-b border-zinc-100 dark:border-gray-500/30 flex items-center justify-between px-10 sticky top-0 z-40 transition-colors">
      <div className="flex-1 max-w-xl relative hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Global search..." 
          className="w-full pl-11 pr-6 py-2.5 bg-zinc-50 dark:bg-gray-500/20 rounded-xl text-xs font-bold outline-none border-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white dark:text-zinc-900"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2.5 bg-zinc-50 dark:bg-gray-500/20 rounded-xl text-zinc-400 dark:text-zinc-900 hover:bg-zinc-100 transition-all">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2.5 bg-zinc-50 dark:bg-gray-500/20 rounded-xl text-zinc-400 dark:text-zinc-900 hover:bg-zinc-100 transition-all">
          <Settings className="w-5 h-5" />
        </button>
        <div className="h-8 w-[1px] bg-zinc-100 dark:bg-gray-500/30" />
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
             <User className="w-5 h-5" />
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-black text-zinc-900 dark:text-zinc-950 tracking-tight uppercase">Atelier Admin</p>
            <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-900/60 uppercase tracking-widest">Master Level</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
