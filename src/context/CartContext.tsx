"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Definir tipo de producto para evitar uso de 'any'
interface Product {
  id: number;
  name: string;
  price: number;
  offerPrice?: number;
  isOffer?: boolean;
  image?: string;
  images?: string[];
  slug: string;
  acceptSolana?: boolean;
  acceptCredit?: boolean;
  acceptGooglePay?: boolean;
  acceptApplePay?: boolean;
  acceptedCryptos?: string[];
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  acceptSolana?: boolean;
  acceptCredit?: boolean;
  acceptGooglePay?: boolean;
  acceptApplePay?: boolean;
  acceptedCryptos?: string[];
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.isOffer ? product.offerPrice! : product.price,
          image: Array.isArray(product.images) ? product.images[0] : (product.image || ''),
          quantity,
          slug: product.slug,
          acceptSolana: product.acceptSolana || false,
          acceptCredit: product.acceptCredit || false,
          acceptGooglePay: product.acceptGooglePay || false,
          acceptApplePay: product.acceptApplePay || false,
          acceptedCryptos: product.acceptedCryptos || []
        }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    console.log(items)
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}; 