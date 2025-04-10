"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ChevronLeftIcon,
  CreditCardIcon,
  WalletIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { useCustomWallet } from "@/context/WalletContext";
import { usePayment } from "@/context/PaymentContext";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { CloverWalletAdapter, Coin98WalletAdapter, LedgerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Interfaces for database data
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  slug: string;
  stock: number;
  sellerId: number;
  acceptedCryptos?: string[];
  acceptSolana?: boolean;
  acceptCredit?: boolean;
  acceptGooglePay?: boolean;
  acceptApplePay?: boolean;
}

interface Seller {
  id: number;
  name: string;
  wallet: string;
}

interface DbData {
  products: Product[];
  sellers: Seller[];
}

interface AddressForm {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { connected, publicKey, connect, disconnect, sendTransaction } = useCustomWallet();
  const {
    isGooglePayAvailable,
    isApplePayAvailable,
    processGooglePayment,
    processApplePayment,
    isProcessing
  } = usePayment();
  const [step, setStep] = useState(1);
  const paymentMethods = [
    { id: "solana", name: "Solana Wallet", icon: "SOL" },
    { id: "credit", name: "Credit/Debit Card", icon: "CARD" },
    { id: "google", name: "Google Pay", icon: "GP" },
    { id: "apple", name: "Apple Pay", icon: "AP" }
  ];
  const [selectedPayment, setSelectedPayment] = useState("");
  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // State to track progress within each payment method
  const [paymentStage, setPaymentStage] = useState("initial"); // initial, processing, confirmed
  const [paymentError, setPaymentError] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Example - Calculate costs
  const subtotal = getTotalPrice();
  const shipping = subtotal >= 100 ? 0 : 10;
  const taxes = Math.round(subtotal * 0.16 * 100) / 100; // 16% VAT
  const total = subtotal + shipping + taxes;

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CloverWalletAdapter(),
      new Coin98WalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter()
    ],
    []
  );

  // Check if the cart is empty
  useEffect(() => {
    if (getTotalItems() === 0 && !orderCompleted) {
      router.replace("/cart");
    }
  }, [getTotalItems, router, orderCompleted]);

  // Function to get the current price of Solana using the CoinGecko API
  const getSolanaPrice = async (): Promise<number> => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      
      if (!response.ok) {
        throw new Error('Failed to fetch Solana price');
      }
      
      const data = await response.json();
      const solanaPrice = data.solana.usd;
      
      console.log(`Current Solana price: $${solanaPrice} USD`);
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

  // Functions to process payments based on the method

  // Solana payment
  const processSolanaPayment = async () => {
    setPaymentStage("processing");
    setPaymentError("");

    try {
      if (!connected) {
        await connect();
        await new Promise(resolve => setTimeout(resolve, 500));

        if (!connected || !publicKey) {
          throw new Error("Failed to connect to wallet");
        }
      }

      const amountUSD = getTotalPrice();
      const solanaPrice = await getSolanaPrice();
      const amountSOL = amountUSD / solanaPrice;
      
      console.log(`Amount to pay: $${amountUSD} USD = ${amountSOL} SOL`);
      
      let recipientWallet = "";
      
      try {
        const response = await fetch('/db.json');
        if (!response.ok) {
          throw new Error('Failed to load database');
        }
        const dbData: DbData = await response.json();
        
        if (items.length > 0) {
          const productId = items[0].id;
          const product = dbData.products.find(p => p.id === productId);
          if (product) {
            const seller = dbData.sellers.find(s => s.id === product.sellerId);
            if (seller) {
              recipientWallet = seller.wallet;
            }
          }
        }
      } catch (error) {
        console.error("Error loading database:", error);
      }

      if (!recipientWallet) {
        throw new Error("Failed to find seller's wallet");
      }

      console.log(`Paying to seller's wallet: ${recipientWallet}`);

      if (!publicKey) {
        throw new Error("Failed to get wallet's public key");
      }

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      
      const confirmPayment = window.confirm(
        `Do you confirm the payment of ${amountSOL.toFixed(4)} SOL (approximately $${amountUSD.toFixed(2)} USD) to wallet ${recipientWallet.substring(0, 6)}...${recipientWallet.substring(recipientWallet.length - 4)}?`
      );
      
      if (!confirmPayment) {
        throw new Error("Payment canceled by user");
      }

      const transaction = new Transaction();
      
      console.log(`Sending ${amountSOL} SOL (${Math.round(amountSOL * LAMPORTS_PER_SOL)} lamports) to ${recipientWallet}`);
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipientWallet),
        lamports: Math.round(amountSOL * LAMPORTS_PER_SOL)
      });
      
      transaction.add(instruction);
      
      const transactionId = await sendTransaction(transaction, connection);

      if (!transactionId) {
        throw new Error("Transaction failed");
      }

      setTransactionId(transactionId);
      setPaymentStage("confirmed");

      setTimeout(() => {
        completeCheckout(transactionId);
      }, 1500);

    } catch (error) {
      console.error("Error processing Solana payment:", error);
      setPaymentError("Failed to process Solana payment. Please try again.");
      setPaymentStage("initial");
    }
  };

  // Google Pay payment
  const handleGooglePayment = async () => {
    setPaymentStage("processing");
    setPaymentError("");

    try {
      const amount = getTotalPrice();
      const transactionId = await processGooglePayment(amount);

      if (!transactionId) {
        throw new Error("Transaction failed");
      }

      setTransactionId(transactionId);
      setPaymentStage("confirmed");

      setTimeout(() => {
        completeCheckout(transactionId);
      }, 1500);

    } catch (error) {
      console.error("Error processing Google Pay payment:", error);
      setPaymentError("Failed to process Google Pay payment. Please try again.");
      setPaymentStage("initial");
    }
  };

  // Apple Pay payment
  const handleApplePayment = async () => {
    setPaymentStage("processing");
    setPaymentError("");

    try {
      const amount = getTotalPrice();
      const transactionId = await processApplePayment(amount);

      if (!transactionId) {
        throw new Error("Transaction failed");
      }

      setTransactionId(transactionId);
      setPaymentStage("confirmed");

      setTimeout(() => {
        completeCheckout(transactionId);
      }, 1500);

    } catch (error) {
      console.error("Error processing Apple Pay payment:", error);
      setPaymentError("Failed to process Apple Pay payment. Please try again.");
      setPaymentStage("initial");
    }
  };

  // Credit card payment
  const processCreditCardPayment = async () => {
    setPaymentStage("processing");
    setPaymentError("");

    const cardNumber = (document.getElementById("cardNumber") as HTMLInputElement)?.value;
    const expiry = (document.getElementById("expiry") as HTMLInputElement)?.value;
    const cvc = (document.getElementById("cvc") as HTMLInputElement)?.value;
    const cardName = (document.getElementById("cardName") as HTMLInputElement)?.value;

    if (!cardNumber || !expiry || !cvc || !cardName) {
      setPaymentError("Please complete all card fields.");
      setPaymentStage("initial");
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const fakeTransactionId = "CC" + Math.random().toString(36).substring(2, 10).toUpperCase();
      setTransactionId(fakeTransactionId);
      setPaymentStage("confirmed");

      setTimeout(() => {
        completeCheckout(fakeTransactionId);
      }, 1500);

    } catch (error) {
      console.error("Error processing card payment:", error);
      setPaymentError("Failed to process card payment. Please try again.");
      setPaymentStage("initial");
    }
  };

  // Function to complete the checkout process
  const completeCheckout = async (paymentId: string) => {
    setLoading(true);

    try {
      const randomOrderId = "ORD-" + Math.floor(Math.random() * 1000000);
      setOrderNumber(randomOrderId);

      let sellerInfo = null;
      
      try {
        const response = await fetch('/db.json');
        if (!response.ok) {
          throw new Error('Failed to load database');
        }
        const dbData: DbData = await response.json();
        
        if (items.length > 0) {
          const productId = items[0].id;
          const product = dbData.products.find(p => p.id === productId);
          if (product) {
            const seller = dbData.sellers.find(s => s.id === product.sellerId);
            if (seller) {
              sellerInfo = {
                id: seller.id,
                name: seller.name,
                wallet: seller.wallet
              };
            }
          }
        }
      } catch (error) {
        console.error("Error loading database:", error);
      }

      console.log("Purchase completed:", {
        orderId: randomOrderId,
        paymentId: paymentId,
        items: items,
        total: total,
        address: address,
        seller: sellerInfo
      });

      clearCart();
      setOrderCompleted(true);
      setStep(3);
    } catch (error) {
      console.error("Error completing purchase:", error);
      setPaymentError("There was an error completing your purchase. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle payment form submission
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentStage === "processing") return;

    if (paymentStage === "confirmed") {
      completeCheckout(transactionId);
      return;
    }

    switch (selectedPayment) {
      case "solana":
        processSolanaPayment();
        break;
      case "credit":
        processCreditCardPayment();
        break;
      case "google":
        handleGooglePayment();
        break;
      case "apple":
        handleApplePayment();
        break;
      default:
        setPaymentError("Please select a valid payment method.");
    }
  };

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
              Thank you for your purchase. Your order #{orderNumber} has been successfully processed.
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
                          Payment methods available for this order
                        </p>

                        <div className="space-y-4">
                          {paymentMethods.map((method) => (
                            <div key={method.id}>
                              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${selectedPayment === method.id
                                  ? "border-primary bg-primary-50 dark:bg-primary-900/20"
                                  : "border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/10"
                                }`}>
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value={method.id}
                                  checked={selectedPayment === method.id}
                                  onChange={() => handlePaymentSelect(method.id)}
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <div className="ml-3">
                                  <div className="flex items-center">
                                    <div className="h-10 w-16 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center font-medium text-gray-800 dark:text-gray-200 mr-3">
                                      {method.icon}
                                    </div>
                                    <span className={`font-medium text-gray-900 dark:text-white`}>
                                      {method.name}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedPayment === "solana" && (

                        <ConnectionProvider endpoint={endpoint}>
                          <WalletProvider wallets={wallets} autoConnect>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                <WalletIcon className="h-5 w-5 mr-2" />
                                Solana Payment
                              </h3>

                              <div className="mb-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {items.length > 0 && items[0].acceptedCryptos && Array.isArray(items[0].acceptedCryptos) && (
                                    <>
                                      {items[0].acceptedCryptos.includes("SOL") && (
                                        <div className="flex items-center p-2 bg-primary/10 dark:bg-primary-900/20 border border-primary rounded-lg">
                                          <div className="w-6 h-6 mr-2 relative">
                                            <Image
                                              src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=024"
                                              alt="Solana"
                                              width={24}
                                              height={24}
                                              className="object-contain"
                                            />
                                          </div>
                                          <span className="font-medium text-sm">SOL</span>
                                        </div>
                                      )}
                                      {items[0].acceptedCryptos.includes("USDC") && (
                                        <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                                          <div className="w-6 h-6 mr-2 relative">
                                            <Image
                                              src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=024"
                                              alt="USDC"
                                              width={24}
                                              height={24}
                                              className="object-contain"
                                            />
                                          </div>
                                          <span className="font-medium text-sm">USDC</span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>

                                <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-4 mb-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">Total Price:</span>
                                    <span className="font-medium">{total.toFixed(2)} USD</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">Equivalent in SOL:</span>
                                    <span className="font-medium">~{(total / 140).toFixed(4)} SOL</span>
                                  </div>
                                </div>

                                {paymentStage === "initial" && (
                                  <>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                                      To complete your payment with Solana, follow these steps:
                                    </p>

                                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                      <li>Connect your Solana wallet</li>
                                      <li>Review the amount to transfer</li>
                                      <li>Confirm the transaction in your wallet</li>
                                    </ol>

                                    <div className="flex flex-col space-y-4">
                                      {!connected && (

                                        <WalletMultiButton
                                          className="!w-full !bg-primary !hover:bg-primary-dark !text-white !py-3 !px-4 !rounded-lg !font-medium !transition-colors !flex !items-center !justify-center"
                                        />

                                      )}

                                      {connected && (
                                        <>
                                          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
                                            <div className="flex items-center">
                                              <div className="w-8 h-8 bg-primary/10 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-3">
                                                <WalletIcon className="h-4 w-4 text-primary dark:text-primary-300" />
                                              </div>
                                              <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                  {publicKey?.toString()?.substring(0, 4)}...{publicKey?.toString()?.substring(publicKey?.toString().length - 4)}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Wallet connected</p>
                                              </div>
                                            </div>
                                            <button
                                              onClick={disconnect}
                                              className="text-sm text-red-600 dark:text-red-400 hover:underline"
                                            >
                                              Disconnect
                                            </button>
                                          </div>

                                          <button
                                            type="button"
                                            onClick={processSolanaPayment}
                                            className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                          >
                                            Pay with Solana
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </>
                                )}

                                {paymentStage === "processing" && (
                                  <div className="text-center py-6">
                                    <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">Processing payment...</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Please do not close this window</p>
                                  </div>
                                )}

                                {paymentStage === "confirmed" && (
                                  <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                      <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                    <p className="text-green-600 dark:text-green-400 font-medium mb-1">Payment confirmed!</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Transaction ID: {transactionId}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">Processing your order...</p>
                                  </div>
                                )}

                                {paymentError && (
                                  <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-red-600 dark:text-red-400 text-sm">{paymentError}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </WalletProvider>
                        </ConnectionProvider>
                      )}

                      {selectedPayment === "credit" && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <CreditCardIcon className="h-5 w-5 mr-2" />
                            Card Details
                          </h3>

                          {paymentStage === "initial" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Card Number
                                </label>
                                <input
                                  id="cardNumber"
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                />
                              </div>

                              <div>
                                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Expiration Date
                                </label>
                                <input
                                  id="expiry"
                                  type="text"
                                  placeholder="MM/YY"
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                />
                              </div>

                              <div>
                                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  CVC
                                </label>
                                <input
                                  id="cvc"
                                  type="text"
                                  placeholder="123"
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Name on Card
                                </label>
                                <input
                                  id="cardName"
                                  type="text"
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>
                          )}

                          {paymentStage === "processing" && (
                            <div className="text-center py-6">
                              <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <p className="text-gray-700 dark:text-gray-300 font-medium">Processing payment...</p>
                              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Verifying card information</p>
                            </div>
                          )}

                          {paymentStage === "confirmed" && (
                            <div className="text-center py-6">
                              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="text-green-600 dark:text-green-400 font-medium mb-1">Payment confirmed!</p>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">Transaction ID: {transactionId}</p>
                              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">Processing your order...</p>
                            </div>
                          )}

                          {paymentError && (
                            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                              <p className="text-red-600 dark:text-red-400 text-sm">{paymentError}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedPayment === "google" && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <Image
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Google_Pay_icon.svg/2560px-Google_Pay_icon.svg.png"
                              alt="Google Pay"
                              width={20}
                              height={20}
                              className="mr-2"
                            />
                            Google Pay Payment
                          </h3>

                          <div className="text-center py-8">
                            {paymentStage === "initial" && (
                              <>
                                <div className="mb-4">
                                  <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Google_Pay_icon.svg/2560px-Google_Pay_icon.svg.png"
                                    alt="Google Pay"
                                    width={80}
                                    height={80}
                                    className="mx-auto"
                                  />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                  By clicking the button, you will proceed to the Google Pay payment processor to complete your purchase securely.
                                </p>

                                <button
                                  type="button"
                                  onClick={handleGooglePayment}
                                  disabled={isProcessing || !isGooglePayAvailable}
                                  className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isGooglePayAvailable ? 'Pay with Google Pay' : 'Google Pay not available'}
                                </button>

                                {!isGooglePayAvailable && (
                                  <p className="mt-3 text-sm text-red-500">
                                    Google Pay is not available on this device or browser.
                                  </p>
                                )}
                              </>
                            )}

                            {paymentStage === "processing" && (
                              <div className="py-6">
                                <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">Processing payment...</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">You will be redirected to Google Pay</p>
                              </div>
                            )}

                            {paymentStage === "confirmed" && (
                              <div className="py-6">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <p className="text-green-600 dark:text-green-400 font-medium mb-1">Payment confirmed!</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Transaction ID: {transactionId}</p>
                              </div>
                            )}

                            {paymentError && (
                              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <p className="text-red-600 dark:text-red-400 text-sm">{paymentError}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedPayment === "apple" && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <Image
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png"
                              alt="Apple Pay"
                              width={50}
                              height={20}
                              className="mr-2"
                            />
                            Apple Pay Payment
                          </h3>

                          <div className="text-center py-8">
                            {paymentStage === "initial" && (
                              <>
                                <div className="mb-4">
                                  <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png"
                                    alt="Apple Pay"
                                    width={100}
                                    height={40}
                                    className="mx-auto"
                                  />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                  By clicking the button, you will proceed to the Apple Pay payment processor to complete your purchase securely.
                                </p>

                                <button
                                  type="button"
                                  onClick={handleApplePayment}
                                  disabled={isProcessing || !isApplePayAvailable}
                                  className="inline-flex items-center justify-center px-6 py-3 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isApplePayAvailable ? 'Pay with Apple Pay' : 'Apple Pay not available'}
                                </button>

                                {!isApplePayAvailable && (
                                  <p className="mt-3 text-sm text-red-500">
                                    Apple Pay is not available on this device or browser.
                                  </p>
                                )}
                              </>
                            )}

                            {paymentStage === "processing" && (
                              <div className="py-6">
                                <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">Processing payment...</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">You will be redirected to Apple Pay</p>
                              </div>
                            )}

                            {paymentStage === "confirmed" && (
                              <div className="py-6">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <p className="text-green-600 dark:text-green-400 font-medium mb-1">Payment confirmed!</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Transaction ID: {transactionId}</p>
                              </div>
                            )}

                            {paymentError && (
                              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <p className="text-red-600 dark:text-red-400 text-sm">{paymentError}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

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
                        disabled={!selectedPayment || loading || paymentStage === "processing"}
                        className={`inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors ${(!selectedPayment || loading || paymentStage === "processing") ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      >
                        {loading ? (
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
                        <div key={item.id} className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <Image
                              src={item.image}
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
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className="text-gray-900 dark:text-white">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Taxes</span>
                      <span className="text-gray-900 dark:text-white">${taxes.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                        <span className="text-lg font-semibold text-primary">${total.toFixed(2)}</span>
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