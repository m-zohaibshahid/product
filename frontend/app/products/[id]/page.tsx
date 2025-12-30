'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { productsApi } from '@/lib/api';
import type { Product } from '@/types';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsApi.getById(productId);
        setProduct(response.data);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImages(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      await productsApi.uploadImages(productId, formData);
      
      // Refresh product data to show new images
      const response = await productsApi.getById(productId);
      setProduct(response.data);
      
      alert('Images uploaded successfully!');
    } catch (err: any) {
      console.error('Error uploading images:', err);
      alert(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const getPrimaryImage = () => {
    if (!product?.images || product.images.length === 0) return null;
    const primary = product.images.find(img => img.is_primary) || product.images[0];
    return primary.image_url || `${API_URL}${primary.image_path}`;
  };

  const getGalleryImages = () => {
    if (!product?.images || product.images.length === 0) return [];
    return product.images.filter(img => !img.is_primary || product.images.length === 1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error || 'Product not found'}
        </div>
        <Link href="/products" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  const primaryImage = getPrimaryImage();
  const galleryImages = getGalleryImages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-gray-600">Product Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button className="btn-secondary text-red-600 hover:text-red-700 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
            <label className="btn-primary flex items-center gap-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              {uploadingImages ? 'Uploading...' : 'Upload Images'}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImages}
                className="hidden"
              />
            </label>
          </div>

          {/* Primary Image */}
          {primaryImage ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="p-2 bg-white border-t border-gray-200">
                <span className="text-xs font-medium text-blue-600">Primary Image</span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 h-96 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No images uploaded</p>
                <p className="text-sm text-gray-500 mt-1">Upload images to display here</p>
              </div>
            </div>
          )}

          {/* Gallery Images */}
          {galleryImages.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Gallery Images</h3>
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.map((image) => {
                  const imageUrl = image.image_url || `${API_URL}${image.image_path}`;
                  return (
                    <div key={image.image_id} className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      <img
                        src={imageUrl}
                        alt={`${product.name} - Image ${image.display_order}`}
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Article Code</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.article_code}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
              </div>
              {product.description && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.description}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Brand</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.brand?.name || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {product.category?.name || 'N/A'}
                  {product.subcategory && ` / ${product.subcategory.name}`}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Default Tax Rate</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.default_tax_rate}%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Variants</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {product.variants?.length || 0} variant{product.variants?.length !== 1 ? 's' : ''}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Images</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {product.images?.length || 0} image{product.images?.length !== 1 ? 's' : ''}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(product.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <ProtectedRoute>
      <ProductDetailContent />
    </ProtectedRoute>
  );
}

