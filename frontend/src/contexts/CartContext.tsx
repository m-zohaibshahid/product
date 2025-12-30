'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, ProductVariant } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (variant: ProductVariant, quantity: number) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addItem = (variant: ProductVariant, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.variant_id === variant.variant_id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.variant_id === variant.variant_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            variant_id: variant.variant_id,
            variant,
            quantity,
            unit_price: variant.selling_price,
            discount: 0,
            tax_rate: variant.product?.default_tax_rate || 18,
          },
        ];
      }
    });
  };

  const removeItem = (variantId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.variant_id !== variantId));
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.variant_id === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => {
      const lineSubtotal = item.unit_price * item.quantity;
      const lineDiscount = item.discount || 0;
      const lineAfterDiscount = lineSubtotal - lineDiscount;
      const lineTax = lineAfterDiscount * ((item.tax_rate || 0) / 100);
      return total + lineAfterDiscount + lineTax;
    }, 0);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}


