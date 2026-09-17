'use client';

import React, { createContext, useContext, useState } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'abo_hashim_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      let updatedItems: CartItem[];
      if (existingIndex > -1) {
        updatedItems = [...prevItems];
        const newQty = updatedItems[existingIndex].quantity + quantity;
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: Math.min(newQty, product.stock),
        };
      } else {
        updatedItems = [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
      }

      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
      return updatedItems;
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.product.id !== productId);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
      return updatedItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      });

      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear cart in localStorage:', e);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
