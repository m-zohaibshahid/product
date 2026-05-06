'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-semibold text-xs tracking-widest leading-none";
  
  const variants = {
    primary: "bg-primary text-surface-container-lowest hover:bg-primary/95 shadow-md hover:shadow-lg",
    secondary: "bg-secondary text-surface-container-lowest hover:bg-secondary/95 shadow-sm hover:shadow-md",
    tertiary: "transparent text-primary hover:text-secondary-container transition-colors", // High-end editorial feel
  };

  const sizes = {
    sm: "px-4 py-2",
    md: "px-6 py-4",
    lg: "px-10 py-6 text-sm",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 mr-3" strokeWidth={2} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 ml-3" strokeWidth={2} />}
    </button>
  );
}
