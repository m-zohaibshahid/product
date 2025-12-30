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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addItem = (variant: ProductVariant, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.variant_id === variant.variant_id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.variant_id === variant.variant_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            variant_id: variant.variant_id,
            variant,
            quantity,
            unit_price: variant.selling_price,
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
      return total + (item.unit_price * item.quantity);
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


