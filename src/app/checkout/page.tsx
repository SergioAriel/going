"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ChevronLeftIcon,
  // CreditCardIcon,
  WalletIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useSendTransaction, useSolanaWallets } from "@privy-io/react-auth/solana";
import { usePrivy } from "@privy-io/react-auth";
import { useAlert } from "@/context/AlertContext";
import { updateOrder } from "@/lib/ServerActions/orders";
import { AddressForm, CartItem } from "@/interfaces";

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = usePrivy();
  const { items, getTotalItems, totalPrice, clearCart } = useCart();
  const { wallets } = useSolanaWallets();
  const { sendTransaction } = useSendTransaction();
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const { handleAlert } = useAlert()

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // State to track progress within each payment method
  const [paymentStage, setPaymentStage] = useState("initial"); // initial, processing, confirmed
  const [paymentError, setPaymentError] = useState(false);
  // const [transactionId, setTransactionId] = useState("");

  // Check if the cart is empty
  useEffect(() => {
    if (getTotalItems() === 0 && !orderCompleted) {
      router.replace("/cart");
    }
  }, [getTotalItems, router, orderCompleted]);

  // Function to get the current price of Solana using the CoinGecko API
  const getSolanaPrice = async (currency: string): Promise<number> => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=${currency}`);

      if (!response.ok) {
        throw new Error('Failed to fetch Solana price');
      }

      const data = await response.json();
      const solanaPrice = data.solana[currency.toLowerCase()];

      console.log(`Current Solana price: $${solanaPrice} ${currency}`);
      return solanaPrice;
    } catch (error) {
      console.error("Error fetching Solana price:", error);
      return 150; // Default value: 1 SOL = $150 USD
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSelect = (methodId: string) => {
    setSelectedPayment(methodId);
  };

  const isAddressComplete = () => {
    return Object.values(address).every(value => value.trim() !== "");
  };

  const handleSubmitAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isAddressComplete()) {
      setStep(2);
    }
  };


  // Function to complete the checkout process
  const completeCheckout = async (signature: string, orderId: string) => {
    if (!user) {
      handleAlert({
        message: "You need to be logged in to complete the purchase",
        isError: true
      })
      return
    }
    setLoading(true);
    setPaymentStage("confirmed")
    try {
      await updateOrder({
        _id: orderId,
        signature
      })
      setOrderNumber(orderId);
      clearCart();
      setOrderCompleted(true);
      setStep(3);
    } catch (error) {
      console.error("Error completing purchase:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle payment form submission
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      handleAlert({
        message: "You need to be logged in to complete the purchase",
        isError: true
      })
      return
    }

    setLoading(true)
    if (!selectedPayment) {
      handleAlert({
        message: "Wallet not selected",
        isError: true
      })
      setPaymentError(true)
      return
    }

    const wallet = wallets.find((wallet) => wallet.address === selectedPayment)
    if (!wallet) {
      handleAlert({
        message: "Wallet not found",
        isError: true
      })
      setPaymentError(true)
      return;
    }

    try {
      const orderId = await (await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date(),
          buyerId: user?.id,
          encryptedAddress: address,
          status: "processing",
          totalPrice,
          sellers: [...(new Set(items.map((item: CartItem) => item.seller)))],
          items: items.map((item: CartItem) => ({ _id: item._id, price: item.price, quantity: item.quantity, name: item.name, image: item.mainImage, currency: item.currency }))
        })
      })).json();

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const { blockhash: recentBlockhash } = await connection.getLatestBlockhash();
      const objectPayments = items.reduce((acc: { [_: string]: { totalAmount: number, currency: string, price: number } }, item) => {
        const { addressWallet, price, quantity, currency } = item;
        return {
          ...acc,
          [addressWallet]: {
            price,
            totalAmount: acc[addressWallet] ? acc[addressWallet].totalAmount + (price * quantity) : (price * quantity),
            currency,
          }
        }
      }, {});

      const transaction = new Transaction();
      const transferInstructions = await Promise.all(
        Object.entries(objectPayments).map(async ([address, { totalAmount, currency }]) => {
          const solanaPrice = await getSolanaPrice(currency);
          return SystemProgram.transfer({
            fromPubkey: new PublicKey(wallet.address),
            toPubkey: new PublicKey(address),
            lamports: Math.round((totalAmount / solanaPrice) * LAMPORTS_PER_SOL),
          });
        })
      );

      transferInstructions.forEach(instruction => {
        transaction.add(instruction);
      });
      transaction.recentBlockhash = recentBlockhash;

      transaction.feePayer = new PublicKey(wallet.address);
      const transactionReceipt = await sendTransaction({
        transaction,
        connection
      });

      setPaymentStage("confirmed");
      
      if (transactionReceipt) {
        completeCheckout(transactionReceipt.signature, orderId);
        return;
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentError(true)
      handleAlert({
        message: "Error processing payment",
        isError: true
      })
      setLoading(false)
      setPaymentStage("initial")
      setTimeout(() => {
        setPaymentError(false)
      }
        , 1000)
      return;
    }
  };

  useEffect(() => {
    if (paymentError) {
      setLoading(false)
      setPaymentStage("initial")
      setTimeout(() => {
        setPaymentError(false)
      }, 1000)
    }
  }, [loading, paymentError, paymentStage])

  if (orderCompleted) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Order Completed!</h1>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your purchase. Your order {orderNumber} has been successfully processed.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Shipping Details</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We will send a confirmation to <span className="font-medium">{address.fullName}</span> at{" "}
                <span className="font-medium">{address.street}, {address.city}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Status: <span className="text-primary font-medium">Processing</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                Back to Home
              </Link>
              <Link href="/profile" className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors">
                View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}>
                  1
                </div>
                <div className={`hidden sm:block ml-2 text-sm font-medium ${step >= 1 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  }`}>
                  Address
                </div>
              </div>

              <div className={`w-16 sm:w-24 h-1 mx-2 ${step >= 2 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                }`}></div>

              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}>
                  2
                </div>
                <div className={`hidden sm:block ml-2 text-sm font-medium ${step >= 2 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  }`}>
                  Payment
                </div>
              </div>

              <div className={`w-16 sm:w-24 h-1 mx-2 ${step >= 3 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                }`}></div>

              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}>
                  3
                </div>
                <div className={`hidden sm:block ml-2 text-sm font-medium ${step >= 3 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  }`}>
                  Confirmation
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {/* Step 1 - Shipping address */}
                {step === 1 && (
                  <div>
                    <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Shipping Address
                      </h2>
                    </div>

                    <form onSubmit={handleSubmitAddress} className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Full Name
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            value={address.fullName}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Address
                          </label>
                          <input
                            id="street"
                            name="street"
                            type="text"
                            required
                            value={address.street}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            required
                            value={address.city}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            State/Province
                          </label>
                          <input
                            id="state"
                            name="state"
                            type="text"
                            required
                            value={address.state}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Zip Code
                          </label>
                          <input
                            id="zip"
                            name="zip"
                            type="text"
                            required
                            value={address.zip}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Country
                          </label>
                          <input
                            id="country"
                            name="country"
                            type="text"
                            required
                            value={address.country}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contact Phone
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={address.phone}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contact Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={address.email}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between">
                        <Link href="/cart" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <ChevronLeftIcon className="h-5 w-5 mr-1" />
                          Back to Cart
                        </Link>

                        <button
                          type="submit"
                          className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Step 2 - Payment */}
                {step === 2 && (
                  <div>
                    <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Payment Method
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                          Wallets available for this order
                        </p>

                        {
                          wallets
                            // user?.linkedAccounts?
                            .map((wallet) => {

                              // if (wallet.type === "wallet") {
                              return (

                                <div key={wallet.address} className="flex items-center mb-4">
                                  <input
                                    type="radio"
                                    name="paymentMethod"
                                    id={wallet.address}

                                    value={wallet.address}
                                    checked={selectedPayment === wallet.address}
                                    onChange={() => handlePaymentSelect(wallet.address)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                  />
                                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center mr-3">

                                    <WalletIcon
                                      width={40}
                                      height={40}
                                      className="object-contain"
                                    />
                                  </div>
                                  <label htmlFor={wallet.address} className="font-medium text-gray-900 dark:text-white">
                                    {wallet.address}
                                  </label>
                                </div>
                              )
                              // }
                            })
                        }
                      </div>
                      <div className="flex items-start mt-6">
                        <ShieldCheckIcon className="flex-shrink-0 h-5 w-5 text-green-500 mr-3" />
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <p>
                            All your data is protected. Payment information is encrypted.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        disabled={paymentStage === "processing"}
                      >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Back to Address
                      </button>

                      <button
                        onClick={handleSubmitPayment}
                        disabled={loading || paymentError || paymentStage !== "initial"}
                        className={`inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors   ${(loading || paymentStage !== "initial") ? "opacity-50 cursor-not-allowed" : ""} ${paymentError && "error-animation cursor-not-allowed"}`}
                      >
                        {
                          paymentError ?
                            "Payment error"
                            :
                            loading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : paymentStage === "confirmed" ? (
                              "Complete Purchase"
                            ) : (
                              "Proceed to Payment"
                            )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:w-1/3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Order Summary
                  </h2>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item._id} className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <Image
                              src={item.mainImage}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.quantity} x ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Taxes</span>
                      <span className="text-gray-900 dark:text-white">${0}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                        <span className="text-lg font-semibold text-primary">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping address (only in step 2) */}
              {step === 2 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-6">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Shipping Address
                      </h2>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-900 dark:text-white font-medium">{address.fullName}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{address.street}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{address.country}</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{address.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;