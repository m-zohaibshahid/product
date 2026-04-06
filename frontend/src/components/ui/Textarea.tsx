'use client';

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-3 group">
      <label className="text-secondary label-md text-[11px] font-bold tracking-widest uppercase transition-colors group-focus-within:text-primary">
        {label}
      </label>
      
      <div className="relative">
        <textarea 
          className={`w-full bg-surface-container-high transition-all duration-300 rounded-md
            border-b border-transparent group-focus-within:border-primary/20
            group-focus-within:bg-surface-container-lowest py-5 px-6
            text-sm font-medium text-primary
            placeholder:text-on-surface-variant/30 focus:outline-none min-h-[120px]
            ${error ? 'border-b-error/40' : ''}
          `}
          {...props}
        />
      </div>
      
      {error && <p className="text-[10px] text-error font-semibold uppercase tracking-wider">{error}</p>}
    </div>
  );
}
