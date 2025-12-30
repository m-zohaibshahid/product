'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/types';
import { ArrowLeft, Package, CheckCircle } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await ordersApi.getById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Order not found</p>
          <Link href="/shop/orders" className="text-blue-600 mt-4 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/shop" className="text-2xl font-bold text-blue-600">
              Online Shop
            </Link>
            <Link href="/shop/orders" className="flex items-center gap-2 text-gray-700">
              <ArrowLeft className="h-5 w-5" />
              Back to Orders
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600">Order #{order.order_number}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {order.payment_status === 'paid' && (
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-semibold">Payment Received</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">{new Date(order.order_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-semibold capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method?.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className="font-semibold capitalize">{order.payment_status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold">{order.location?.name}</p>
            </div>
          </div>

          {order.shipping_address && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
              <p className="text-gray-900">{order.shipping_address}</p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.lines?.map((line) => (
              <div key={line.order_line_id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    {line.variant?.product?.images?.[0] && (
                      <img
                        src={line.variant.product.images[0].image_url || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500'}${line.variant.product.images[0].image_path}`}
                        alt={line.variant.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{line.variant?.product?.name}</h3>
                    <p className="text-sm text-gray-600">
                      {line.variant?.color?.name} • {line.variant?.size?.name} • Qty: {line.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{(line.unit_price * line.quantity).toFixed(2)}</p>
                  {line.discount > 0 && (
                    <p className="text-sm text-gray-500">Discount: ₹{line.discount.toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>₹{order.subtotal_amount.toFixed(2)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Discount</span>
                <span>-₹{order.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tax</span>
              <span>₹{order.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 mt-4">
              <span>Total</span>
              <span>₹{order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {order.sale && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Invoice:</strong> {order.sale.invoice_number}
            </p>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/shop/orders"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    </div>
  );
}


