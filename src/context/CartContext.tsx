"use client";

import { CartItem, Product } from "@/interfaces";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAlert } from "./AlertContext";

// Definir tipo de producto para evitar uso de 'any'

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  // totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  // const [totalPrice, setTotalPrice] = useState<number>(0);
  const { handleAlert } = useAlert();

  useEffect(() => {
    const storedItems = localStorage.getItem("cart");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = items.find(item => item._id === product._id);

    if (existingItem) {
      const addItem = items.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(addItem));
      setItems(addItem);
    } else {
      const addItem = [...items, {
        _id: product._id.toString(),
        seller: product.seller,
        name: product.name,
        price: product.price,
        priceOffer: product.isOffer && product.offerPercentage ? product.price - (product.price * product.offerPercentage) : undefined,
        mainImage: product.mainImage,
        quantity,
        addressWallet: product.addressWallet,
        currency: product.currency
      }]
      localStorage.setItem("cart", JSON.stringify(addItem));
      setItems(addItem);
    }


    handleAlert({ message: `Added to cart: ${product.name}`, isError: false })
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };


  // const getTotalPrice = async () => {

  //   return await items.reduce(async (acc, item) => {
  //     const total = await acc
  //     const priceToCurrency = await getSolanaPrice(item.currency);

  //     return total + (item.price * item.quantity) * priceToCurrency
  //   }, Promise.resolve(0));
  // };

  // useEffect(() => {
  //   const total = items.reduce((total, item) => total + item.price * item.quantity, 0);
  // }, [items]);


  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      // totalPrice
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