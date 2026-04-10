'use client';

import React from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import { ShoppingBag, Truck, Calendar, MoreHorizontal, ArrowRight } from 'lucide-react';

export default function PurchaseOrdersPage() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="display-md text-primary tracking-tight mb-2 italic-elegant opacity-90">Purchase Orders</h2>
          <div className="flex items-center gap-2 text-on-surface-variant/70 label-md text-xs font-semibold uppercase tracking-widest leading-none">
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Procure raw fabrics and materials for the tailor's bench.</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/purchase-orders/create">
            <Button variant="primary" size="md" icon={Truck}>Create PO</Button>
          </Link>
        </div>
      </section>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatCard label="Pending Orders" value="6" variant="lowest" icon={Calendar} />
        <StatCard label="In-Transit" value="12,500m" subValue="Raw Fabric" variant="lowest" />
        <StatCard label="Total Value" value="$28,450" variant="lowest" />
      </div>

      {/* Order List Section */}
      <div className="p-10 bg-surface-container-lowest rounded-xl ambient-shadow space-y-10">
        <div>
          <h3 className="title-lg text-primary tracking-tight mb-1 opacity-90">Procurement Ledger</h3>
          <p className="text-on-surface-variant/70 text-xs uppercase tracking-widest font-semibold font-medium leading-none">Tracking material flow with precision</p>
        </div>

        <div className="space-y-6">
          {[
            { id: 'PO-8821', vendor: 'Milan Wool Mill', material: 'Super 120s Navy Wool', status: 'In Transit', date: 'Expected Feb 24' },
            { id: 'PO-8822', vendor: 'Heritage Silk Co.', material: 'Mulberry Silk Lining', status: 'Pending Approval', date: 'Expected Mar 02' },
            { id: 'PO-8823', vendor: 'Cotton Traders Ltd.', material: 'Giza 45 Cotton', status: 'Delivered', date: 'Received Jan 18' },
          ].map((order) => (
            <div key={order.id} className="p-8 bg-surface-container-low/30 rounded-xl flex items-center justify-between group hover:bg-surface-container-low/60 transition-all border border-transparent hover:border-outline-variant/10">
              <div className="flex gap-8 items-center">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-all duration-700">
                  <ShoppingBag className="w-6 h-6" strokeWidth={1} />
                </div>
                <div>
                   <p className="text-[10px] text-secondary font-black uppercase tracking-widest leading-none mb-2">{order.id} • {order.vendor}</p>
                   <h4 className="text-sm font-semibold text-primary mb-1 underline-offset-4 group-hover:underline">{order.material}</h4>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right">
                   <p className="text-xs font-black text-primary uppercase tracking-widest mb-1.5">{order.status}</p>
                   <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.15em] opacity-40">{order.date}</p>
                </div>
                <div className="p-2 text-on-surface-variant/30 group-hover:text-primary transition-colors cursor-pointer">
                   <MoreHorizontal className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 flex justify-center">
           <Button variant="tertiary" size="sm" icon={ArrowRight} iconPosition="right">View Archived Procurement</Button>
        </div>
      </div>
    </div>
  );
}
