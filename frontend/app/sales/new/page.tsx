'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface SaleLine {
  variant_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  discount: number;
  line_total: number;
}

export default function NewSalePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saleLines, setSaleLines] = useState<SaleLine[]>([]);
  const [formData, setFormData] = useState({
    location_id: '',
    customer_id: '',
    payment_method: 'cash',
  });

  const addItem = () => {
    setSaleLines([
      ...saleLines,
      {
        variant_id: 0,
        product_name: '',
        sku: '',
        quantity: 1,
        unit_price: 0,
        discount: 0,
        line_total: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setSaleLines(saleLines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: string, value: any) => {
    const updated = [...saleLines];
    updated[index] = { ...updated[index], [field]: value };
    
    // Calculate line total
    if (field === 'quantity' || field === 'unit_price' || field === 'discount') {
      updated[index].line_total =
        (updated[index].quantity * updated[index].unit_price) - updated[index].discount;
    }
    
    setSaleLines(updated);
  };

  const subtotal = saleLines.reduce((sum, line) => sum + line.line_total, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saleLines.length === 0) {
      alert('Please add at least one item');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        ...formData,
        lines: saleLines,
        subtotal_amount: subtotal,
        tax_amount: tax,
        total_amount: total,
      };
      
      console.log('Sale data:', saleData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/sales');
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Failed to create sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sales" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Sale</h1>
          <p className="mt-2 text-gray-600">Create a new sales invoice</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sale Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sale Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                id="location_id"
                name="location_id"
                required
                value={formData.location_id}
                onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                className="input"
              >
                <option value="">Select Location</option>
                <option value="1">Main Store</option>
                <option value="2">Warehouse</option>
              </select>
            </div>

            <div>
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-2">
                Customer
              </label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="input"
              >
                <option value="">Walk-in Customer</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
              </select>
            </div>

            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="input"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sale Items */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sale Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          {saleLines.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No items added yet</p>
              <button
                type="button"
                onClick={addItem}
                className="btn-primary mt-4"
              >
                Add First Item
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {saleLines.map((line, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={line.product_name}
                          onChange={(e) => updateLine(index, 'product_name', e.target.value)}
                          className="input"
                          placeholder="Search product..."
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={line.sku}
                          onChange={(e) => updateLine(index, 'sku', e.target.value)}
                          className="input"
                          placeholder="SKU"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="input w-20"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unit_price}
                          onChange={(e) => updateLine(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="input w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.discount}
                          onChange={(e) => updateLine(index, 'discount', parseFloat(e.target.value) || 0)}
                          className="input w-24"
                        />
                      </td>
                      <td className="font-medium">₹{line.line_total.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="card max-w-md ml-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Link href="/sales" className="btn-secondary flex-1 text-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || saleLines.length === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              {loading ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}



