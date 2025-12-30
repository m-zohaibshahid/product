'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { productsApi, stockApi } from '@/lib/api';
import type { Product, Stock, ProductVariant } from '@/types';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

interface StockItem {
  variant_id: number;
  product_name: string;
  sku: string;
  color: string;
  size: string;
  location: string;
  location_id: number;
  quantity_on_hand: number;
  min_stock_level: number;
  status: 'low' | 'normal';
  cost_price?: number;
  selling_price?: number;
}

function StockPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products with variants
        const productsRes = await productsApi.getAll();
        const productsData = productsRes.data || [];
        setProducts(productsData);

        // Try to fetch stock data
        try {
          const stockRes = await stockApi.getAll();
          const stockItems = stockRes.data || [];
          setStockData(stockItems);
          
          // Extract unique locations
          const uniqueLocations = Array.from(
            new Set(stockItems.map((s: Stock) => s.location_id))
          ).map((id) => {
            const stockItem = stockItems.find((s: Stock) => s.location_id === id);
            return {
              id: id as number,
              name: stockItem?.location?.name || `Location ${id}`,
            };
          });
          setLocations(uniqueLocations);
        } catch (stockErr) {
          console.warn('Stock API not available, using variant data:', stockErr);
          // If stock API fails, we'll calculate from variants
          setStockData([]);
        }
      } catch (err: any) {
        console.error('Error fetching stock data:', err);
        setError(err.response?.data?.message || 'Failed to load stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Build stock items from products and stock data
  const stockItems: StockItem[] = useMemo(() => {
    const items: StockItem[] = [];

    products.forEach((product) => {
      if (!product.variants || product.variants.length === 0) return;

      product.variants.forEach((variant: ProductVariant) => {
        // Find stock entries for this variant
        const variantStocks = stockData.filter(
          (s: Stock) => s.variant_id === variant.variant_id
        );

        if (variantStocks.length > 0) {
          // If we have stock data, use it
          variantStocks.forEach((stock: Stock) => {
            if (selectedLocation !== 'all' && stock.location_id !== parseInt(selectedLocation)) {
              return;
            }

            const quantity = stock.quantity_on_hand || 0;
            const minLevel = variant.min_stock_level || 0;
            const status: 'low' | 'normal' = quantity <= minLevel ? 'low' : 'normal';

            items.push({
              variant_id: variant.variant_id,
              product_name: product.name,
              sku: variant.sku,
              color: variant.color?.name || 'N/A',
              size: variant.size?.name || 'N/A',
              location: stock.location?.name || `Location ${stock.location_id}`,
              location_id: stock.location_id,
              quantity_on_hand: quantity,
              min_stock_level: minLevel,
              status,
              cost_price: variant.cost_price,
              selling_price: variant.selling_price,
            });
          });
        } else {
          // If no stock data, create a default entry (quantity 0)
          const minLevel = variant.min_stock_level || 0;
          items.push({
            variant_id: variant.variant_id,
            product_name: product.name,
            sku: variant.sku,
            color: variant.color?.name || 'N/A',
            size: variant.size?.name || 'N/A',
            location: 'No Location',
            location_id: 0,
            quantity_on_hand: 0,
            min_stock_level: minLevel,
            status: 'low',
            cost_price: variant.cost_price,
            selling_price: variant.selling_price,
          });
        }
      });
    });

    return items;
  }, [products, stockData, selectedLocation]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = stockItems.length;
    const lowStockItems = stockItems.filter((item) => item.status === 'low').length;
    
    // Calculate total value (quantity * cost_price)
    const totalValue = stockItems.reduce((sum, item) => {
      const value = (item.quantity_on_hand || 0) * (item.cost_price || 0);
      return sum + value;
    }, 0);

    return {
      totalItems,
      lowStockItems,
      totalValue,
    };
  }, [stockItems]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading stock data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
        <p className="mt-2 text-gray-600">View and manage inventory stock levels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalItems.toLocaleString()}
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {stats.lowStockItems.toLocaleString()}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ₹{stats.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Stock Levels</h2>
          <div className="flex gap-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id.toString()}>
                  {loc.name}
                </option>
              ))}
            </select>
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Color / Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Min Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stockItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-gray-400" />
                      <p className="text-gray-600">No stock data available</p>
                      <p className="text-sm text-gray-500">
                        Create products with variants to see stock levels
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                stockItems.map((item, index) => (
                  <tr key={`${item.variant_id}-${item.location_id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.color} / {item.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {item.quantity_on_hand.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.min_stock_level.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'low' ? (
                        <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function StockPage() {
  return (
    <ProtectedRoute>
      <StockPageContent />
    </ProtectedRoute>
  );
}
