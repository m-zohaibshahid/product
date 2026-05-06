'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down';
  icon?: LucideIcon;
  variant?: 'surface' | 'lowest';
}

export default function StatCard({
  label,
  value,
  subValue,
  trend,
  icon: Icon,
  variant = 'lowest',
}: StatCardProps) {
  return (
      <div className={`p-8 rounded-[32px] flex flex-col justify-between transition-all duration-500 border
      ${variant === 'lowest' 
        ? 'bg-gray-300 dark:bg-gray-500 border-zinc-100 dark:border-gray-500 shadow-sm' 
        : 'bg-gray-200 dark:bg-gray-500 border-transparent shadow-none'}`}
    >
      <div className="flex items-center justify-between gap-4 mb-8">
        <p className="text-zinc-500 dark:text-zinc-50 font-bold uppercase tracking-widest text-[10px]">{label}</p>
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-500 flex items-center justify-center text-zinc-500 dark:text-white transition-colors">
            <Icon className="w-6 h-6" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none italic-elegant">{value}</h3>
        {subValue && (
          <p className="text-zinc-500 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest">{subValue}</p>
        )}
      </div>
    </div>
  );
}
