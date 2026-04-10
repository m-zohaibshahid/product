'use client';
import React, { useEffect } from 'react';
import { CheckCircle2, X, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
  isVisible: boolean;
}

export default function Toast({ message, type = 'success', onClose, isVisible }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: 'bg-zinc-900 border-zinc-800 text-white',
    info: 'bg-blue-600 border-blue-500 text-white',
    error: 'bg-red-600 border-red-500 text-white',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    info: <Info className="w-5 h-5 text-blue-100" />,
    error: <AlertTriangle className="w-5 h-5 text-red-100" />,
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 animate-toast-in">
      <div className={`${styles[type]} border px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] backdrop-blur-xl bg-opacity-90`}>
        <div className="shrink-0">{icons[type]}</div>
        <div className="flex-1 text-sm font-bold tracking-wide">{message}</div>
        <button onClick={onClose} className="hover:opacity-60 transition-opacity">
          <X className="w-4 h-4 opacity-40" />
        </button>
      </div>
    </div>
  );
}
