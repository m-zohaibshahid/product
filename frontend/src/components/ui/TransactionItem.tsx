'use client';

import React from 'react';
import { ShoppingCart, PackagePlus, AlertTriangle, ArrowRightLeft } from 'lucide-react';

interface TransactionItemProps {
  label: string;
  subLabel: string;
  time: string;
  type: 'sale' | 'restock' | 'return' | 'transfer';
}

export default function TransactionItem({ label, subLabel, time, type }: TransactionItemProps) {
  const iconMap = {
    sale: ShoppingCart,
    restock: PackagePlus,
    return: AlertTriangle,
    transfer: ArrowRightLeft,
  };
  
  const colorMap = {
    sale: 'text-primary bg-surface-container-low',
    restock: 'text-secondary bg-surface-container-high',
    return: 'text-error bg-error-container',
    transfer: 'text-outline bg-surface-container',
  };

  const Icon = iconMap[type];

  return (
    <div className="flex items-center gap-6 group hover:bg-surface-container-low/50 px-4 py-4 rounded-lg transition-all duration-300">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${colorMap[type]}`}>
        <Icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary truncate leading-none mb-2 underline-offset-4 group-hover:underline">
          {label}
        </p>
        <p className="text-xs uppercase tracking-widest text-on-surface-variant font-medium opacity-60 leading-none">
          {subLabel}
        </p>
      </div>

      <div className="text-right flex shrink-0 flex-col items-end">
        <p className="text-xs font-semibold text-primary opacity-80 uppercase tracking-widest mb-1.5">{time}</p>
        <div className="w-4 h-[2px] bg-outline-variant/30 rounded-full" />
      </div>
    </div>
  );
}
