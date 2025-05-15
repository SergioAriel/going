"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useCurrencies } from "@/context/CurrenciesContext";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotalItems, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const { listCurrencies, userCurrency } = useCurrencies();

  // Check if cart is empty
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              It looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Link href="/products" className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="hidden md:grid md:grid-cols-6 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4">
                <div className="col-span-3">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => {
                  const priceCurrencyUSD = listCurrencies.find((currency) => currency.symbol === item.currency);

                  console.log(priceCurrencyUSD, item.currency, item.price, userCurrency.price);

                  return (
                    <div key={item._id} className="p-4 md:grid md:grid-cols-6 md:items-center">
                      {/* Product info */}
                      <div className="flex items-center md:col-span-3 mb-4 md:mb-0">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                          <Image
                            src={item.mainImage}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            <Link href={`/products/${item._id}`} className="hover:text-primary">
                              {item.name}
                            </Link>
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="mt-1 text-sm font-medium text-primary hover:text-primary-dark flex items-center"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col md:text-center mb-4 md:mb-0">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {userCurrency?.currency} {((item.price * (priceCurrencyUSD?.price || 0)) / userCurrency.price ).toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="md:text-center mb-4 md:mb-0">
                        <div className="inline-flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="md:text-right">
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {userCurrency?.currency} {((item.price * item.quantity * (priceCurrencyUSD?.price || 0)) / userCurrency.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Link href="/products" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    items.forEach(item => removeFromCart(item._id));
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({getTotalItems()} items)</span>
                  {/* <span className="text-gray-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span> */}
                </div>

                {/* <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div> */}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Discount Code</span>
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                      <button
                        type="button"
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Including taxes and fees
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="block w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg text-center transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Need Help?</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href="/shipping-policy" className="hover:text-primary">Shipping Policy</Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-primary">Returns & Exchanges</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">Contact Support</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 