'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertItemProps {
  label: string;
  subValue: string;
}

export default function AlertItem({ label, subValue }: AlertItemProps) {
  return (
    <div className="flex items-center gap-6 group hover:translate-x-1 transition-transform duration-300">
      <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
        <AlertCircle className="w-5 h-5 shrink-0" strokeWidth={1.5} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary truncate leading-none mb-1.5">{label}</p>
        <p className="text-xs uppercase tracking-widest text-on-surface-variant font-medium opacity-70 leading-none">{subValue}</p>
      </div>
    </div>
  );
}
