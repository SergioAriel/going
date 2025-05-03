"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Product } from "@/interfaces";
import ProductCard from "@/components/products/ProductCard";

// Categories for filtering
  const categories = [
    "All",
    "Electronics",
    "Clothing and Accessories",
    "Home and Garden",
    "Sports",
    "Toys",
    "Health and Beauty",
    "Food",
    "Services",
    "Other"
  ];

// Sort options
const sortOptions = [
  { name: "Most Relevant", value: "relevance" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
  { name: "Best Rated", value: "rating" },
  { name: "Newest", value: "newest" },
];

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
        const response = await fetch('/api/products', {
          cache: 'no-store'
        });
        if (!response.ok) {
          throw new Error('Failed to load the database');
        }
        const { results: products } = await response.json();
        setProducts(products || []);
        setFilteredProducts(products || []);
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
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
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
                    <ProductCard key={product?._id as string} product={product} />
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