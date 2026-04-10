'use client';

import React from 'react';
import { Settings, Shield, Bell, Palette, Database } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700 max-w-4xl">
      <div>
        <h2 className="display-sm text-primary tracking-tight mb-1 italic-elegant opacity-90">System Settings</h2>
        <p className="text-on-surface-variant/70 label-md text-[10px] font-black uppercase tracking-[0.2em] leading-none">Customize your atelier operations</p>
      </div>

      <div className="grid gap-10">
        {[
          { icon: Shield, label: 'Security & Access', desc: 'Secure the vault with multi-layered master keys and role permissions.' },
          { icon: Bell, label: 'Audit Alerts', desc: 'Manage your stock thresholds and automated revenue notifications.' },
          { icon: Palette, label: 'Atelier Branding', desc: 'Tailor the visual soul of your inventory system to match your brand.' },
          { icon: Database, label: 'Data Governance', desc: 'Exports, backups, and structural ledger integrity management.' },
        ].map((item) => (
          <section key={item.label} className="p-8 bg-surface-container-lowest rounded-xl ambient-shadow flex items-center gap-8 group hover:translate-x-2 transition-transform">
             <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
               <item.icon className="w-6 h-6" strokeWidth={1} />
             </div>
             <div className="flex-1">
               <h3 className="title-lg text-sm text-primary font-bold mb-1 opacity-90">{item.label}</h3>
               <p className="text-on-surface-variant/70 text-xs font-medium">{item.desc}</p>
             </div>
             <Button variant="tertiary" size="sm">Configure</Button>
          </section>
        ))}
      </div>
    </div>
  );
}
