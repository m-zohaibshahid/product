'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export default function Input({
  label,
  icon: Icon,
  error,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-3 group">
      <label className="text-secondary label-md text-[11px] font-bold tracking-widest uppercase transition-colors group-focus-within:text-primary">
        {label}
      </label>
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary/70 transition-colors">
            <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
          </div>
        )}
        
        <input 
          className={`w-full bg-surface-container-high transition-all duration-300 rounded-md
            border-b border-transparent group-focus-within:border-primary/20
            group-focus-within:bg-surface-container-lowest py-5 
            ${Icon ? 'pl-14' : 'px-6'} pr-6 text-sm font-medium text-primary
            placeholder:text-on-surface-variant/30 focus:outline-none
            ${error ? 'border-b-error/40' : ''}
          `}
          {...props}
        />
      </div>
      
      {error && <p className="text-[10px] text-error font-semibold uppercase tracking-wider">{error}</p>}
    </div>
  );
}
