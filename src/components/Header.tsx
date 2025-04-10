"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  
  return (
    <header className="bg-white dark:bg-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Marketplace" width={40} height={40} />
            <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">Marketplace</span>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
              Products
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
              Categories
            </Link>
            <Link href="/offers" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
              Offers
            </Link>
            <Link href="/sell" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
              Sell
            </Link>
          </nav>
          
          {/* User actions */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            
            <Link href="/profile" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
              <UserIcon className="h-6 w-6" />
            </Link>
            
            <Link href="/cart" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary relative">
              <ShoppingBagIcon className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/products" 
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/offers" 
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Offers
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 