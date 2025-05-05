

import ProductCard from "@/components/products/ProductCard";
import HeroSlider from "@/components/layout/HeroSlider";
import Link from "next/link";
import { getProducts } from "@/lib/products";


export default async function Home() {

  const dbFeaturedProducts = await getProducts({ isFeatured: true })

  return (
    <main className="min-h-screen">
      {/* Hero Section with Slider */}
      <HeroSlider />
      {/* Featured Products */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors relative group"
            >
              <span>View All</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
              dbFeaturedProducts?.map((product) => (
                <ProductCard key={product._id.toString()} product={{ ...product, _id: product._id.toString() }} />
              ))
            }
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-16 bg-gradient-brand text-white relative overflow-hidden">
        {/* Decorative elements inspired by the logo */}
        <div className="absolute top-0 left-0 w-full h-full dot-pattern opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Shop with Cryptocurrency</h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Experience the future of online shopping with our Solana integration.
              Fast, secure, and eco-friendly transactions for the modern shopper.
            </p>
            <div className="flex justify-center">
              <a href="/crypto-guide" className="btn-white">
                Learn How It Works
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Going Marketplace
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Secure Transactions</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All transactions are encrypted and secure, whether using traditional payment methods or cryptocurrency.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-secondary rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quick processing and shipping to get your products to you as soon as possible.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-brand rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Multiple Payment Options</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from credit cards, digital wallets, or cryptocurrencies like Solana for your purchases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8">
              Subscribe to our newsletter to receive updates on new products, special offers, and more.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 flex-grow max-w-md"
                required
              />
              <button
                type="submit"
                className="btn-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section> */}
    </main>
  );
}
