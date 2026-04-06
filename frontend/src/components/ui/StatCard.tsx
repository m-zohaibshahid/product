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
    <div className={`p-8 rounded-lg flex flex-col justify-between transition-all duration-500
      ${variant === 'lowest' 
        ? 'bg-surface-container-lowest ambient-shadow' 
        : 'bg-surface-container-low shadow-sm'}`}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-secondary label-md text-xs tracking-widest">{label}</p>
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary/70">
            <Icon className="w-5 h-5" strokeWidth={1} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="display-sm font-bold text-primary tracking-tighter leading-none italic-elegant opacity-90">{value}</h3>
        {subValue && (
          <p className="text-on-surface-variant/80 text-xs font-medium uppercase tracking-wider">{subValue}</p>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          {/* Implement trend line or simple indicator if needed */}
        </div>
      )}
    </div>
  );
}
