"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Product } from "@/interfaces";
import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/ServerActions/products";
import { SortDirection } from "mongodb";
import LogoLoading from "@/components/svgs/LogoLoading";
import { useSearchParams } from "next/navigation";
// import { getProducts } from "@/lib/products";

// Categories for filtering
const categories = [
  { name: "All", value: "all" },
  { name: "Electronics", value: "electronics" },
  { name: "Clothing and Accessories", value: "clothing" },
  { name: "Home and Garden", value: "home" },
  { name: "Sports", value: "sports" },
  { name: "Toys", value: "toys" },
  { name: "Health and Beauty", value: "health" },
  { name: "Food", value: "food" },
  { name: "Services", value: "services" },
  { name: "Other", value: "other" },
];

interface Sort {
  name: string;
  value: string;
  sort: { [key: string]: SortDirection }
}

// Sort options
const sortOptions: Sort[] = [
  // { name: "Most Relevant", value: "relevance", sort: {} },
  { name: "Price: Low to High", value: "price-asc", sort: { price: 1 } as { [key: string]: SortDirection } },
  { name: "Price: High to Low", value: "price-desc", sort: { price: -1 } as { [key: string]: SortDirection } },
  { name: "Best Rated", value: "rating", sort: { rating: 1 } as { [key: string]: SortDirection } },
  { name: "Newest", value: "newest", sort: { date: 1 } as { [key: string]: SortDirection } },
];

const ProductsRendering = (
  { dbProducts }:
    {
      dbProducts: Promise<Product[]>,
    }
) => {
  const initialProducts = use<Product[]>(dbProducts);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(!products);
  const [error, setError] = useState("");
  
  const searchParams = useSearchParams()
  
  const categoryParams = searchParams.get('category')
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParams || "all");
  // Filter products by category and search
  useEffect(() => {
    (async () => {
      try {

        const find = {
          ...(selectedCategory !== "all" && { category: selectedCategory }),
          ...(searchQuery && { name: { $regex: searchQuery, $options: 'i' } })
        }

        const result = (await getProducts(
          find,
          sortOptions.find(({ value }) => value === sortBy)?.sort as { [key: string]: SortDirection }
        ))

        if (!result) {
          throw new Error('Failed to load the database');
        }
        // const { results: products } = await response.json();

        setProducts(result || []);
      } catch (error) {
        console.error(error)
        setError(error as string)
      }
    })()
  }, [selectedCategory, searchQuery, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is applied in real-time with state
    setIsLoading(true)
  };

  console.log("category", selectedCategory, categoryParams)


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
                setSelectedCategory("all");
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
                {categories.map(({ name, value }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === value}
                      onChange={() => setSelectedCategory(value)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{name}</span>
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
                    setSelectedCategory("all");
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex justify-center">
                <LogoLoading />

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
            ) : (!initialProducts || !products?.length) ? (
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
                    setSelectedCategory("all");
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
                    Showing {products?.length} products
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products?.map((product) => (
                    <ProductCard key={product?._id as string} product={{ ...product, _id: product._id.toString() }} />
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

export default ProductsRendering;


