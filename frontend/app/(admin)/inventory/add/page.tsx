'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { 
  Plus, 
  ArrowLeft, 
  Image as ImageIcon, 
  Info, 
  Check, 
  Tag, 
  DollarSign, 
  Package,
  Layers,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fabric',
    sku: '',
    price: '',
    stock: '',
    material: '',
    origin: '',
    weight: '',
    description: ''
  });

  const categories = [
    { value: 'Fabric', label: 'Luxe Fabric' },
    { value: 'Ready-to-Wear', label: 'Ready-to-Wear' },
    { value: 'Accessories', label: 'Bespoke Accessories' },
    { value: 'Trimming', label: 'Finishing & Trimming' }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/inventory" className="inline-flex items-center gap-2 text-on-surface-variant/40 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest mb-4">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={3} />
            <span>Back to Collection</span>
          </Link>
          <h2 className="display-sm text-primary tracking-tight italic-elegant opacity-90">New Stock Entry</h2>
          <p className="text-on-surface-variant/70 text-sm font-medium leading-relaxed max-w-2xl">
            Create a detailed record for new arrivals in the atelier. Fields marked as material specific will activate upon selection.
          </p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Sections */}
        <div className="lg:col-span-8 space-y-12">
          {/* Basic Info */}
          <section className="bg-surface-container-lowest p-10 rounded-xl ambient-shadow space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60">
                  <Tag className="w-4 h-4" />
               </div>
               <h3 className="title-md text-primary font-bold opacity-90 underline-offset-8 decoration-outline-variant/20 decoration-1">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input 
                  label="Product Name" 
                  placeholder="Midnight Herringbone Wool" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
               <Select 
                  label="Category Classification" 
                  options={categories}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
               />
            </div>
            <Textarea 
               label="Crafting Description" 
               placeholder="Detail the weave, texture, and tailored characteristics..." 
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </section>

          {/* Pricing & Stock */}
          <section className="bg-surface-container-lowest p-10 rounded-xl ambient-shadow space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60">
                  <DollarSign className="w-4 h-4" />
               </div>
               <h3 className="title-md text-primary font-bold opacity-90 underline-offset-8 decoration-outline-variant/20 decoration-1">Inventory & Pricing</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <Input 
                  label="Unique SKU" 
                  placeholder="FAB-WOO-0012" 
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
               />
               <Input 
                  label="Retail Price" 
                  placeholder="845.00" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
               />
               <Input 
                  label="Current Stock Count" 
                  placeholder="42.5" 
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
               />
            </div>
          </section>

          {/* Material Specifications */}
          <section className="bg-surface-container-lowest p-10 rounded-xl ambient-shadow space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60">
                  <Layers className="w-4 h-4" />
               </div>
               <h3 className="title-md text-primary font-bold opacity-90 underline-offset-8 decoration-outline-variant/20 decoration-1">Material Specifications</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <Input 
                  label="Fiber Composition" 
                  placeholder="100% Super Wool" 
                  value={formData.material}
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
               />
               <Input 
                  label="Country of Origin" 
                  placeholder="Italy / Biella" 
                  icon={Globe}
                  value={formData.origin}
                  onChange={(e) => setFormData({...formData, origin: e.target.value})}
               />
               <Input 
                  label="GSM / Weight" 
                  placeholder="280 GSM" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
               />
            </div>
          </section>
        </div>

        {/* Sidebar Info / Media */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Media Section */}
          <section className="bg-surface-container-low p-8 rounded-xl space-y-6">
            <h3 className="text-secondary label-md text-[10px] font-black uppercase tracking-widest leading-none">Media & Swatch</h3>
            <div className="aspect-square bg-surface-container-lowest rounded-xl border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-primary/30 transition-all">
               <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant/40 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <ImageIcon className="w-6 h-6" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Upload Swatch Image</p>
            </div>
          </section>

          {/* Availability Section */}
          <section className="bg-surface-container-lowest p-8 rounded-xl ambient-shadow space-y-6">
             <h3 className="text-secondary label-md text-[10px] font-black uppercase tracking-widest leading-none">Availability Status</h3>
             <div className="flex gap-4">
                <button className="flex-1 py-4 bg-primary text-white rounded-md text-[10px] font-bold uppercase tracking-widest">In Stock</button>
                <button className="flex-1 py-4 bg-surface-container-low text-on-surface-variant rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors">Low stock</button>
             </div>
          </section>

          {/* Inventory Forecast Card */}
          <article className="p-8 bg-primary/5 rounded-xl border border-primary/5 space-y-4">
             <div className="flex items-center gap-3 text-primary mb-2">
                <Info className="w-4 h-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Inventory Forecast</h4>
             </div>
             <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
               Adding this product will increase your atelier's asset value by approximately <span className="text-primary font-bold">$12,400.00</span>. Ensure all fabric weights are accurate for shipping cost calculations.
             </p>
          </article>

          <div className="pt-4 flex flex-col gap-4">
             <Button variant="primary" size="lg" className="w-full tracking-[0.3em]">Commit to Inventory</Button>
             <Link href="/inventory" className="text-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-error transition-colors pt-2">
                Cancel & Discard
             </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
