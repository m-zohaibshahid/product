'use client';

import React from 'react';
import { HelpCircle, Book, MessageSquare, Lightbulb } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700 max-w-4xl">
      <div>
        <h2 className="display-sm text-primary tracking-tight mb-1 italic-elegant opacity-90">Atelier Assistance</h2>
        <p className="text-on-surface-variant/70 label-md text-[10px] font-black uppercase tracking-[0.2em] leading-none">Mastering the Digital Tailor system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[
          { icon: Book, label: 'The Master Guide', desc: 'Learn the principles of digital tailoring and inventory management.' },
          { icon: MessageSquare, label: 'Contact Support', desc: 'Direct access to senior craftsmen for technical assistance.' },
          { icon: Lightbulb, label: 'Bespoke Strategies', desc: 'Tips and tricks to optimize your stock velocity and profit margins.' },
          { icon: HelpCircle, label: 'System FAQ', desc: 'Frequently asked questions about ledger integrity and billing.' },
        ].map((item) => (
          <article key={item.label} className="p-10 bg-surface-container-low rounded-xl flex flex-col gap-6 cursor-pointer hover:bg-surface-container-high transition-colors group">
             <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" strokeWidth={1} />
             <div>
               <h3 className="text-primary font-black uppercase tracking-widest text-[11px] mb-2">{item.label}</h3>
               <p className="text-on-surface-variant/70 text-xs font-medium leading-relaxed">{item.desc}</p>
             </div>
          </article>
        ))}
      </div>
    </div>
  );
}
