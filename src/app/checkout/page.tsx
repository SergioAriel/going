"use client";

import { useCart } from "@/context/CartContext";
import CheckoutPage from ".";


const Checkout = () => {

  const { items,
    clearCart } = useCart();
  return (
    <CheckoutPage items={items} clearCart={clearCart} />
  );
};

export default Checkout;