'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { ordersApi } from '@/lib/api';
import type { ConfirmOrderRequest } from '@/types';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationId = searchParams.get('location_id');
  
  const { items, getTotalAmount, clearCart } = useCart();
  const { customer, isAuthenticated } = useCustomerAuth();
  
  const [formData, setFormData] = useState<ConfirmOrderRequest>({
    payment_method: 'cod',
    shipping_address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (!locationId) {
      router.push('/shop/cart');
      return;
    }
    if (items.length === 0) {
      router.push('/shop/cart');
      return;
    }
    if (customer?.address) {
      setFormData((prev) => ({ ...prev, shipping_address: customer.address || '' }));
    }
  }, [locationId, items, customer, router]);

  const handleCreateOrder = async () => {
    if (!locationId) {
      setError('Please select a location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        order_date: new Date().toISOString().split('T')[0],
        location_id: Number(locationId),
        customer_id: customer?.customer_id,
        order_type: 'online',
        lines: items.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: item.discount || 0,
          tax_rate: item.tax_rate || 18,
        })),
      };

      const response = await ordersApi.create(orderData);
      setOrderId(response.data.order_id);
      setOrderCreated(true);
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!orderId) return;

    setLoading(true);
    setError('');

    try {
      await ordersApi.confirm(orderId, formData);
      
      // Process payment (for COD, payment is processed immediately)
      if (formData.payment_method === 'cod') {
        await ordersApi.processPayment(orderId, {
          payment_reference: `COD-${orderId}`,
          payment_date: new Date().toISOString().split('T')[0],
        });
      }

      clearCart();
      router.push(`/shop/orders/${orderId}`);
    } catch (err: any) {
      console.error('Error confirming order:', err);
      setError(err.response?.data?.message || 'Failed to confirm order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!orderCreated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/shop" className="text-2xl font-bold text-blue-600">
                Online Shop
              </Link>
              <Link href="/shop/cart" className="flex items-center gap-2 text-gray-700">
                <ArrowLeft className="h-5 w-5" />
                Back to Cart
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
                <p>You're checking out as a guest. <Link href="/shop/login" className="underline">Login</Link> to track your orders.</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Shipping Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <textarea
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your complete shipping address"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <div className="space-y-2">
                  {['cod', 'card', 'upi', 'bank_transfer', 'wallet'].map((method) => (
                    <label key={method} className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment_method"
                        value={method}
                        checked={formData.payment_method === method}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as any })}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-2">
                        {method === 'cod' && <Truck className="h-5 w-5 text-gray-600" />}
                        {method === 'card' && <CreditCard className="h-5 w-5 text-gray-600" />}
                        <span className="capitalize">{method === 'cod' ? 'Cash on Delivery' : method.toUpperCase()}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions..."
                />
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.variant_id} className="flex justify-between text-sm">
                      <span>
                        {item.variant.product?.name} ({item.variant.color?.name}, {item.variant.size?.name}) x {item.quantity}
                      </span>
                      <span>₹{(item.unit_price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={loading || !formData.shipping_address}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Order...' : 'Create Order'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Order Created - Show Confirmation
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Created Successfully!</h1>
          <p className="text-gray-600 mb-6">Your order has been created. Please confirm to proceed.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="text-left bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Payment Method: <span className="font-semibold capitalize">{formData.payment_method === 'cod' ? 'Cash on Delivery' : formData.payment_method.toUpperCase()}</span></p>
              <p className="text-sm text-gray-600 mt-2">Shipping Address:</p>
              <p className="text-sm text-gray-900">{formData.shipping_address}</p>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Confirming Order...' : 'Confirm Order & Reserve Stock'}
            </button>

            <Link
              href="/shop/cart"
              className="block text-center text-blue-600 hover:text-blue-700"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

