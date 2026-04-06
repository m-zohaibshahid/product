'use client';

import React from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import { 
  Package2, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  ArrowUpDown,
  History
} from 'lucide-react';

const inventoryItems = [
  { id: 1, name: 'Midnight Herringbone Wool', sku: 'FAB-WOO-0012', quantity: '42.5 Meters', status: 'In Stock', category: 'Fabric' },
  { id: 2, name: 'Classic Oxford Button-Down', sku: 'GAR-SHR-4402', quantity: '3 Units', status: 'Low Stock', category: 'Ready-to-Wear' },
  { id: 3, name: 'Premium Sand Linen', sku: 'FAB-LIN-9910', quantity: '0.0 Meters', status: 'Out of Stock', category: 'Fabric' },
  { id: 4, name: 'Royal Emerald Mulberry Silk', sku: 'FAB-SIL-2281', quantity: '112.0 Meters', status: 'In Stock', category: 'Specialty Fabric' },
];

export default function InventoryPage() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="display-md text-primary tracking-tight mb-2 italic-elegant opacity-90">Inventory Management</h2>
          <div className="flex items-center gap-2 text-on-surface-variant/70 label-md text-xs font-semibold uppercase tracking-widest leading-none">
            <Package2 className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Manage your seasonal collections with precision.</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="tertiary" size="sm" icon={History}>Archives</Button>
          <Link href="/inventory/add">
            <Button variant="primary" size="md" icon={Plus}>Add to Stock</Button>
          </Link>
        </div>
      </section>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard label="Total Products" value="1,248" variant="lowest" icon={Package2} />
        <StatCard label="Low Stock" value="12" variant="lowest" />
        <StatCard label="Stock Value" value="$842k" variant="lowest" />
        <StatCard label="Categories" value="12" variant="lowest" />
      </div>

      {/* Master List Section */}
      <section className="p-10 bg-surface-container-lowest rounded-xl ambient-shadow space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <h3 className="title-lg text-primary tracking-tight mb-1 opacity-90">Stock Master List</h3>
            <p className="text-on-surface-variant/70 text-xs uppercase tracking-widest font-semibold font-medium leading-none">Precise tracking for the modern atelier</p>
          </div>
          
          <div className="flex flex-1 max-w-2xl gap-4 items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Find a product (SKU, Name, Category)..." 
                className="w-full bg-surface-container-low/50 py-4 pl-14 pr-6 rounded-md hover:bg-surface-container-low transition-colors focus:outline-none focus:bg-surface-container-lowest border border-transparent focus:border-outline-variant/10 text-sm font-medium"
              />
            </div>
            <Button variant="tertiary" size="sm" icon={Filter} className="px-4">Filter</Button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/20">
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-outline-variant/5">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    Product Description <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-outline-variant/5">Category</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-outline-variant/5">SKU</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-outline-variant/5 text-right">Stock Level</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-outline-variant/5">Status</th>
                <th className="px-6 py-6 border-b border-outline-variant/5 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {inventoryItems.map((item, idx) => (
                <tr 
                  key={item.id} 
                  className={`group transition-all duration-300 hover:bg-surface-container-low/30 cursor-pointer
                    ${idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/10'}`}
                >
                  <td className="px-6 py-8">
                    <p className="text-sm font-semibold text-primary mb-1 underline-offset-4 group-hover:underline">{item.name}</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/50">Atelier Standard Collection</p>
                  </td>
                  <td className="px-6 py-8">
                    <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant/80">{item.category}</span>
                  </td>
                  <td className="px-6 py-8">
                    <code className="text-xs font-mono text-secondary px-2 py-1 bg-secondary-container/10 rounded tracking-wider">{item.sku}</code>
                  </td>
                  <td className="px-6 py-8 text-right">
                    <p className="text-sm font-bold text-primary">{item.quantity}</p>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full 
                        ${item.status === 'In Stock' ? 'bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.4)]' : 
                          item.status === 'Low Stock' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 
                          'bg-error shadow-[0_0_8px_rgba(186,26,26,0.4)]'}`} 
                       />
                       <span className="text-[10px] font-black uppercase tracking-[0.1em] text-on-surface-variant">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-right">
                    <div className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant/40 hover:text-primary">
                      <MoreHorizontal className="w-5 h-5" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-10 px-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 leading-none">
            Showing 1-4 of 1,248 items
          </p>
          <div className="flex gap-4">
             <Button variant="tertiary" size="sm" className="px-4 opacity-50 cursor-not-allowed">Previous</Button>
             <Button variant="tertiary" size="sm" className="px-4">Next Page</Button>
          </div>
        </div>
      </section>
      
      {/* Footer Branding */}
      <footer className="pt-20 text-center opacity-30 select-none pointer-events-none">
        <p className="label-md text-[10px] tracking-widest text-primary leading-loose">The Digital Tailor Inventory Systems • Version 4.2.0-Editorial</p>
      </footer>
    </div>
  );
}
