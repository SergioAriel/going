"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

// Define Product interface
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
  isOffer?: boolean;
  offerPrice?: number;
  acceptSolana?: boolean;
  acceptCredit?: boolean;
  acceptGooglePay?: boolean;
  acceptApplePay?: boolean;
  acceptedCryptos?: string[];
}

// Categories for filtering
const categories = [
  "All", 
  "Electronics", 
  "Sports", 
  "Home", 
  "Accessories", 
  "Fashion"
];

// Sort options
const sortOptions = [
  { name: "Most Relevant", value: "relevance" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
  { name: "Best Rated", value: "rating" },
  { name: "Newest", value: "newest" },
];

// Product Card Component with Add to Cart functionality
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    // Optional: Add feedback
    alert(`Added to cart: ${product.name}`);
  };

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {product.isOffer && (
            <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
              Sale
            </div>
          )}
          
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              Limited stock!
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Sold Out</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-2">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) =>
                  i < Math.floor(product.rating) ? (
                    <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <StarIcon key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                  )
                )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({product.reviews})
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              {product.isOffer ? (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-secondary ml-2">
                    ${product.offerPrice?.toFixed(2) || product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart}
              className={`p-2 rounded-full ${
                product.stock > 0 
                  ? 'bg-primary text-white hover:bg-primary-dark' 
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              } transition-colors`}
              disabled={product.stock <= 0}
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load products from db.json
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/db', {
          cache: 'no-store'
        });
        if (!response.ok) {
          throw new Error('Failed to load the database');
        }
        const data = await response.json();
        console.log("Products loaded on products page:", data.products);
        setProducts(data?.products || []);
        setFilteredProducts(data?.products || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Failed to load products. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category and search
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      // More sorting options here
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied in real-time with state
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Products</h1>
        
        {/* Search bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              />
              <button type="submit" className="absolute right-3 top-3 text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-r-lg flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </form>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className={`lg:w-1/4`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
              
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sort by</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setSortBy("relevance");
                  }}
                  className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Product listing */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <Image 
                  src="https://images.unsplash.com/photo-1580169980114-ccd0babfa840?q=80&w=2070" 
                  alt="Loading products"
                  width={200}
                  height={200}
                  className="mx-auto mb-4 rounded-full object-cover"
                />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Loading products...</h2>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <Image 
                  src="https://images.unsplash.com/photo-1580169980114-ccd0babfa840?q=80&w=2070" 
                  alt="Error loading products"
                  width={200}
                  height={200}
                  className="mx-auto mb-4 rounded-full object-cover"
                />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{error}</h2>
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <Image 
                  src="https://images.unsplash.com/photo-1580169980114-ccd0babfa840?q=80&w=2070" 
                  alt="No products found"
                  width={200}
                  height={200}
                  className="mx-auto mb-4 rounded-full object-cover"
                />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">No products found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try changing the filters or try a different search.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                  View all products
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {filteredProducts?.length} products
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;