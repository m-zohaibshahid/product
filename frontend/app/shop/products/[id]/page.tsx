'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi, variantsApi, stockApi } from '@/lib/api';
import type { Product, ProductVariant, Stock } from '@/types';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchVariants();
    }
  }, [productId]);

  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const variant = variants.find(
        (v) => v.color_id === selectedColor && v.size_id === selectedSize
      );
      if (variant) {
        setSelectedVariant(variant);
        fetchStock(variant.variant_id);
      }
    }
  }, [selectedColor, selectedSize, variants]);

  const fetchProduct = async () => {
    try {
      const response = await productsApi.getById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchVariants = async () => {
    try {
      const response = await variantsApi.getByProduct(productId);
      setVariants(response.data || []);
      
      // Auto-select first variant if available
      if (response.data && response.data.length > 0) {
        const firstVariant = response.data[0];
        setSelectedColor(firstVariant.color_id);
        setSelectedSize(firstVariant.size_id);
        setSelectedVariant(firstVariant);
        fetchStock(firstVariant.variant_id);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStock = async (variantId: number) => {
    try {
      const response = await stockApi.getByVariant(variantId);
      setStock(response.data || []);
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };

  const getAvailableQuantity = () => {
    if (!selectedVariant || stock.length === 0) return 0;
    return stock.reduce((total, s) => {
      return total + (s.quantity_on_hand - s.quantity_reserved);
    }, 0);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a color and size');
      return;
    }

    if (quantity > getAvailableQuantity()) {
      alert(`Only ${getAvailableQuantity()} items available`);
      return;
    }

    addItem(selectedVariant, quantity);
    alert('Item added to cart!');
  };

  const getPrimaryImage = () => {
    if (product?.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
      return primaryImage.image_url || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500'}${primaryImage.image_path}`;
    }
    return '/placeholder-product.jpg';
  };

  const getGalleryImages = () => {
    if (!product?.images) return [];
    return product.images.filter((img) => !img.is_primary).slice(0, 4);
  };

  const uniqueColors = Array.from(
    new Map(variants.map((v) => [v.color_id, v.color])).values()
  );

  const uniqueSizes = Array.from(
    new Map(variants.map((v) => [v.size_id, v.size])).values()
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Product not found</p>
          <Link href="/shop" className="text-blue-600 mt-4 inline-block">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/shop" className="text-2xl font-bold text-blue-600">
              Online Shop
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Shop
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={getPrimaryImage()}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {getGalleryImages().length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {getGalleryImages().map((img, idx) => (
                  <div key={idx} className="aspect-square bg-gray-100 rounded overflow-hidden">
                    <img
                      src={img.image_url || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500'}${img.image_path}`}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">
              {product.brand?.name} • {product.category?.name}
            </p>
            
            {selectedVariant && (
              <div className="mb-6">
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  ₹{selectedVariant.selling_price.toFixed(2)}
                </p>
                {selectedVariant.mrp && selectedVariant.mrp > selectedVariant.selling_price && (
                  <p className="text-lg text-gray-500 line-through">
                    ₹{selectedVariant.mrp.toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {product.description && (
              <p className="text-gray-700 mb-6">{product.description}</p>
            )}

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {uniqueColors.map((color) => (
                    <button
                      key={color.color_id}
                      onClick={() => setSelectedColor(color.color_id)}
                      className={`px-4 py-2 border-2 rounded ${
                        selectedColor === color.color_id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {uniqueSizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="flex gap-2">
                  {uniqueSizes.map((size) => (
                    <button
                      key={size.size_id}
                      onClick={() => setSelectedSize(size.size_id)}
                      className={`px-4 py-2 border-2 rounded ${
                        selectedSize === size.size_id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {selectedVariant && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={getAvailableQuantity()}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(getAvailableQuantity(), parseInt(e.target.value) || 1)))}
                    className="w-20 text-center border border-gray-300 rounded py-2"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(getAvailableQuantity(), quantity + 1))}
                    className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    {getAvailableQuantity()} available
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            {selectedVariant ? (
              <button
                onClick={handleAddToCart}
                disabled={getAvailableQuantity() === 0}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {getAvailableQuantity() === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
              >
                Please select color and size
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

