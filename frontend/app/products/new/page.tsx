'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    article_code: '',
    name: '',
    description: '',
    brand_id: '',
    category_id: '',
    subcategory_id: '',
    default_tax_rate: 0,
    status: 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await productsApi.create(formData);
      console.log('Product data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'default_tax_rate' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-2 text-gray-600">Create a new product in your inventory</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card max-w-3xl">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="article_code" className="block text-sm font-medium text-gray-700 mb-2">
                  Article Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="article_code"
                  name="article_code"
                  required
                  value={formData.article_code}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., MSHIRT101"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Men Slim Fit Shirt"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="input"
                  placeholder="Product description..."
                />
              </div>
            </div>
          </div>

          {/* Category & Brand */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category & Brand</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Brand <span className="text-red-500">*</span>
                </label>
                <select
                  id="brand_id"
                  name="brand_id"
                  required
                  value={formData.brand_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Brand</option>
                  <option value="1">Arrow</option>
                  <option value="2">Zara</option>
                  <option value="3">H&M</option>
                </select>
              </div>

              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Category</option>
                  <option value="1">Men</option>
                  <option value="2">Women</option>
                  <option value="3">Kids</option>
                </select>
              </div>

              <div>
                <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  id="subcategory_id"
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Subcategory</option>
                  <option value="1">Shirts</option>
                  <option value="2">Trousers</option>
                  <option value="3">T-Shirts</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="default_tax_rate" className="block text-sm font-medium text-gray-700 mb-2">
                  Default Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="default_tax_rate"
                  name="default_tax_rate"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.default_tax_rate}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="active">Active</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/products"
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}



