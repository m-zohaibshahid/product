'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import Link from 'next/link';

interface POLine {
  variant_id: number;
  product_name: string;
  sku: string;
  ordered_qty: number;
  unit_cost: number;
  tax_rate: number;
  discount: number;
  line_total: number;
}

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [polines, setPOLines] = useState<POLine[]>([]);
  const [formData, setFormData] = useState({
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    status: 'draft',
  });

  const addLine = () => {
    setPOLines([
      ...polines,
      {
        variant_id: 0,
        product_name: '',
        sku: '',
        ordered_qty: 1,
        unit_cost: 0,
        tax_rate: 18,
        discount: 0,
        line_total: 0,
      },
    ]);
  };

  const removeLine = (index: number) => {
    setPOLines(polines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: string, value: any) => {
    const updated = [...polines];
    updated[index] = { ...updated[index], [field]: value };
    
    // Calculate line total
    if (field === 'ordered_qty' || field === 'unit_cost' || field === 'discount') {
      const subtotal = updated[index].ordered_qty * updated[index].unit_cost;
      updated[index].line_total = subtotal - updated[index].discount;
    }
    
    setPOLines(updated);
  };

  const totalAmount = polines.reduce((sum, line) => sum + line.line_total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (polines.length === 0) {
      alert('Please add at least one item');
      return;
    }

    setLoading(true);
    try {
      const poData = {
        ...formData,
        lines: polines,
        total_amount: totalAmount,
      };
      
      console.log('PO data:', poData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/purchase-orders');
    } catch (error) {
      console.error('Error creating PO:', error);
      alert('Failed to create purchase order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/purchase-orders" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Purchase Order</h1>
          <p className="mt-2 text-gray-600">Create a new purchase order for supplier</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PO Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Purchase Order Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 mb-2">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                id="supplier_id"
                name="supplier_id"
                required
                value={formData.supplier_id}
                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                className="input"
              >
                <option value="">Select Supplier</option>
                <option value="1">Textile Suppliers Inc.</option>
                <option value="2">Fashion Wholesale</option>
                <option value="3">Style Mart</option>
              </select>
            </div>

            <div>
              <label htmlFor="order_date" className="block text-sm font-medium text-gray-700 mb-2">
                Order Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="order_date"
                name="order_date"
                required
                value={formData.order_date}
                onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="expected_delivery_date" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Delivery
              </label>
              <input
                type="date"
                id="expected_delivery_date"
                name="expected_delivery_date"
                value={formData.expected_delivery_date}
                onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* PO Items */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            <button
              type="button"
              onClick={addLine}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          {polines.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No items added yet</p>
              <button type="button" onClick={addLine} className="btn-primary mt-4">
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
                    <th>Unit Cost</th>
                    <th>Tax Rate (%)</th>
                    <th>Discount</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {polines.map((line, index) => (
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
                          value={line.ordered_qty}
                          onChange={(e) => updateLine(index, 'ordered_qty', parseInt(e.target.value) || 1)}
                          className="input w-20"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unit_cost}
                          onChange={(e) => updateLine(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                          className="input w-24"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={line.tax_rate}
                          onChange={(e) => updateLine(index, 'tax_rate', parseFloat(e.target.value) || 18)}
                          className="input w-20"
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
                          onClick={() => removeLine(index)}
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

        {/* Summary */}
        <div className="card max-w-md ml-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Link href="/purchase-orders" className="btn-secondary flex-1 text-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || polines.length === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Create PO'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}



