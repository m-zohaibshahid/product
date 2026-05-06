'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Truck, 
  Calendar, 
  CreditCard, 
  Building2, 
  Plus, 
  Trash2,
  CheckCircle2,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function CreatePOPage() {
  const [formData, setFormData] = useState({
    vendor: 'Milan Wool Mill',
    orderDate: '2023-11-20',
    deliveryDate: '2023-12-15',
    terms: 'Net 30',
    notes: ''
  });

  const vendors = [
    { value: 'Milan Wool Mill', label: 'Milan Wool Mill (Italy)' },
    { value: 'Heritage Silk Co.', label: 'Heritage Silk Co. (China)' },
    { value: 'Cotton Traders Ltd.', label: 'Cotton Traders Ltd. (Egypt)' },
    { value: 'Bespoke Buttons & Trims', label: 'Bespoke Buttons & Trims (France)' }
  ];

  const payTerms = [
    { value: 'Net 30', label: 'Net 30 Days' },
    { value: 'Net 60', label: 'Net 60 Days' },
    { value: 'Due on Receipt', label: 'Due on Receipt' },
    { value: 'Prepaid', label: 'Prepaid (Custom)' }
  ];

  const [items, setItems] = useState([
    { id: 1, material: 'Super 120s Navy Wool', qty: '40 Meters', price: '45.00' },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), material: '', qty: '', price: '' }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/purchase-orders" className="inline-flex items-center gap-2 text-on-surface-variant/40 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest mb-4">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={3} />
            <span>Back to Procurement Ledger</span>
          </Link>
          <h2 className="display-md text-primary tracking-tight italic-elegant opacity-90">Create Purchase Order</h2>
          <p className="text-on-surface-variant/70 text-sm font-medium leading-relaxed max-w-2xl">
            Authorize new material procurement from global vendors. Ensure all payment terms align with the seasonal budget.
          </p>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-12">
          {/* Vendor & General */}
          <section className="bg-surface-container-lowest p-10 rounded-xl ambient-shadow space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60">
                  <Building2 className="w-4 h-4" />
               </div>
               <h3 className="title-md text-primary font-bold opacity-90 underline-offset-8 decoration-outline-variant/20 decoration-1">Vendor & Terms</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Select 
                  label="Select Supplier Mill" 
                  options={vendors}
                  value={formData.vendor}
                  onChange={(e) => setFormData({...formData, vendor: e.target.value})}
               />
               <Select 
                  label="Specified Payment Terms" 
                  options={payTerms}
                  value={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.value})}
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input 
                  label="Order Initiation Date" 
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
               />
               <Input 
                  label="Expected Delivery Date" 
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
               />
            </div>
          </section>

          {/* Items Section */}
          <section className="bg-surface-container-lowest p-10 rounded-xl ambient-shadow space-y-8">
            <div className="flex items-center justify-between gap-4 mb-4">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60">
                     <ShoppingBag className="w-4 h-4" />
                  </div>
                  <h3 className="title-md text-primary font-bold opacity-90 underline-offset-8 decoration-outline-variant/20 decoration-1">Items to Procure</h3>
               </div>
               <button onClick={addItem} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary flex items-center gap-2 transition-colors">
                  <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Add Item
               </button>
            </div>
            
            <div className="space-y-6">
               {items.map((item, idx) => (
                 <div key={item.id} className="flex flex-col md:flex-row gap-6 items-end group p-6 bg-surface-container-low/20 rounded-lg transition-all hover:bg-surface-container-low/40">
                    <div className="flex-1 space-y-4">
                       <Input label="Material / Raw Component" placeholder="e.g., Midnight Herringbone Wool" value={item.material} />
                    </div>
                    <div className="w-full md:w-32">
                       <Input label="Quantity" placeholder="40m" value={item.qty} />
                    </div>
                    <div className="w-full md:w-32">
                       <Input label="Unit Price" placeholder="45.00" value={item.price} />
                    </div>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="pb-4 text-on-surface-variant/30 hover:text-error transition-colors focus:outline-none">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                 </div>
               ))}
            </div>
          </section>

          <Textarea 
             label="Procurement Notes" 
             placeholder="Specify any custom weave requirements or special logistics instructions..." 
             value={formData.notes}
             onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        {/* Action Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
           <section className="bg-surface-container-lowest p-8 rounded-xl ambient-shadow space-y-8">
              <div>
                 <h3 className="text-secondary label-md text-[10px] font-black uppercase tracking-widest leading-none mb-6">Order Summary</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-widest opacity-60">
                       <span>Total Items</span>
                       <span className="text-primary">{items.length} Lines</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-widest opacity-60">
                       <span>Inbound Vol.</span>
                       <span className="text-primary">~180.50 kg</span>
                    </div>
                    <div className="h-[1px] bg-outline-variant/10 my-4" />
                    <div className="flex justify-between items-end">
                       <span className="text-sm font-black text-primary uppercase tracking-[0.2em]">Estimated Total</span>
                       <span className="text-2xl font-bold text-primary italic leading-none">$1,800.00</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Fiscal Approval</p>
                       <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-70">
                         This order falls within the Q3 material allocation budget.
                       </p>
                    </div>
                 </div>
                  <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg">
                    <Truck className="w-5 h-5 text-on-surface-variant/40 shrink-0" strokeWidth={1.5} />
                    <p className="text-xs text-on-surface-variant/70 font-medium leading-relaxed italic">
                      Standard transit from Milan to London (7-10 Business Days).
                    </p>
                 </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                 <Button variant="primary" size="lg" className="w-full tracking-[0.3em]">Authorize Purchase</Button>
                 <Button variant="secondary" size="md" className="w-full tracking-[0.2em]" icon={CreditCard}>Save as Draft</Button>
                 <Link href="/purchase-orders" className="text-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-error transition-colors pt-2">
                    Discard PO
                 </Link>
              </div>
           </section>
           
           <div className="p-8 bg-surface-container-low rounded-xl flex items-start gap-6 group">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                 <Info className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Audit Compliance</h4>
                 <p className="text-xs text-on-surface-variant/60 font-medium leading-relaxed">
                   Authorized Purchase Orders are logged into the permanent master ledger for fiscal auditing.
                 </p>
              </div>
           </div>
        </aside>
      </main>

      {/* Footer Branding */}
      <footer className="pt-20 text-center opacity-30 select-none pointer-events-none">
        <p className="label-md text-[10px] tracking-widest text-primary leading-loose">Precision Procurement Engine • The Digital Tailor Systems v4.2</p>
      </footer>
    </div>
  );
}
