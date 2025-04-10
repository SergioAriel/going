"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();
  
  // Effect to detect scroll and change header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md" 
        : "bg-white dark:bg-gray-800"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with SVG */}
          <Link href="/" className="flex items-center">
            <div className="w-auto h-8 relative">
              <Image 
                src="/goingLogo.svg" 
                alt="Going Marketplace" 
                width={120} 
                height={40} 
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/products" 
              className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary relative group"
            >
              <span>Products</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary relative group"
            >
              <span>Categories</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/offers" 
              className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary relative group"
            >
              <span>Offers</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/sell" 
              className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary relative group"
            >
              <span>Sell</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          
          {/* User actions */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-300">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            
            <Link href="/profile" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-300">
              <UserIcon className="h-6 w-6" />
            </Link>
            
            <Link href="/cart" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-300 relative">
              <ShoppingBagIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/categories"
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/offers"
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Offers
              </Link>
              <Link
                href="/sell"
                className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;