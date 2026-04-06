'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export default function Select({
  label,
  options,
  error,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-3 group">
      <label className="text-secondary label-md text-[11px] font-bold tracking-widest uppercase transition-colors group-focus-within:text-primary">
        {label}
      </label>
      
      <div className="relative">
        <select 
          className={`w-full bg-surface-container-high transition-all duration-300 rounded-md
            border-b border-transparent group-focus-within:border-primary/20
            group-focus-within:bg-surface-container-lowest py-5 px-6
            text-sm font-medium text-primary appearance-none
            focus:outline-none
            ${error ? 'border-b-error/40' : ''}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary/70 transition-colors pointer-events-none">
          <ChevronDown className="w-4.5 h-4.5" strokeWidth={1.5} />
        </div>
      </div>
      
      {error && <p className="text-[10px] text-error font-semibold uppercase tracking-wider">{error}</p>}
    </div>
  );
}
