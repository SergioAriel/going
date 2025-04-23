"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";

// Example data for categories
const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and gadgets",
    icon: "🖥️",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070",
    productCount: 156,
    slug: "electronics",
    subcategories: [
      { name: "Smartphones", slug: "smartphones", count: 45 },
      { name: "Laptops", slug: "laptops", count: 32 },
      { name: "Audio", slug: "audio", count: 28 },
      { name: "Accessories", slug: "electronic-accessories", count: 51 }
    ]
  },
  {
    id: 2,
    name: "Fashion",
    description: "Clothing, footwear, and accessories",
    icon: "👕",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
    productCount: 243,
    slug: "fashion",
    subcategories: [
      { name: "Men", slug: "fashion-men", count: 78 },
      { name: "Women", slug: "fashion-women", count: 98 },
      { name: "Kids", slug: "fashion-kids", count: 45 },
      { name: "Accessories", slug: "fashion-accessories", count: 22 }
    ]
  },
  {
    id: 3,
    name: "Home",
    description: "Furniture, decoration, and appliances",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1513161455079-7bc8d5a4ee3e?q=80&w=2788",
    productCount: 187,
    slug: "home",
    subcategories: [
      { name: "Furniture", slug: "furniture", count: 56 },
      { name: "Decoration", slug: "decoration", count: 64 },
      { name: "Appliances", slug: "appliances", count: 42 },
      { name: "Kitchen", slug: "kitchen", count: 25 }
    ]
  },
  {
    id: 4,
    name: "Sports",
    description: "Sports equipment and sportswear",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070",
    productCount: 129,
    slug: "sports",
    subcategories: [
      { name: "Soccer", slug: "soccer", count: 34 },
      { name: "Running", slug: "running", count: 28 },
      { name: "Fitness", slug: "fitness", count: 41 },
      { name: "Outdoor", slug: "outdoor", count: 26 }
    ]
  }
];

// Example products to associate with categories
const products = [
  // Electronics products
  {
    id: 1,
    name: "Bluetooth Headphones",
    description: "Wireless headphones with active noise cancellation",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070",
    category: "Electronics",
    subcategory: "Audio",
    rating: 4.5,
    reviews: 128,
    slug: "bluetooth-headphones",
    isFeatured: true,
    isOffer: false,
    stock: 15
  },
  {
    id: 2,
    name: "Sports Smartwatch",
    description: "Smartwatch with GPS and heart rate monitoring",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099",
    category: "Electronics",
    subcategory: "Accessories",
    rating: 4.2,
    reviews: 95,
    slug: "sports-smartwatch",
    isFeatured: false,
    isOffer: true,
    offerPrice: 199.99,
    stock: 8
  },
  {
    id: 3,
    name: "Mirrorless Camera",
    description: "Professional Full Frame camera with 24MP",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070",
    category: "Electronics",
    subcategory: "Accessories",
    rating: 4.8,
    reviews: 74,
    slug: "mirrorless-camera",
    isFeatured: true,
    isOffer: false,
    stock: 5
  },
  {
    id: 5,
    name: "Ultrathin Laptop",
    description: "Powerful laptop with next-generation processor",
    price: 999.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071",
    category: "Electronics",
    subcategory: "Laptops",
    rating: 4.7,
    reviews: 203,
    slug: "ultrathin-laptop",
    isFeatured: true,
    isOffer: true,
    offerPrice: 899.99,
    stock: 3
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    description: "Portable waterproof speaker with great sound quality",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2069",
    category: "Electronics",
    subcategory: "Audio",
    rating: 4.1,
    reviews: 87,
    slug: "bluetooth-speaker",
    isFeatured: false,
    isOffer: false,
    stock: 12
  },
  {
    id: 11,
    name: "Premium Smartphone",
    description: "Next-generation phone with professional camera",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080",
    category: "Electronics",
    subcategory: "Smartphones",
    rating: 4.6,
    reviews: 156,
    slug: "premium-smartphone",
    isFeatured: true,
    isOffer: false,
    stock: 7
  },
  
  // Fashion products
  {
    id: 7,
    name: "Waterproof Jacket",
    description: "Lightweight jacket perfect for rainy days",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936",
    category: "Fashion",
    subcategory: "Men",
    rating: 4.3,
    reviews: 67,
    slug: "waterproof-jacket",
    isFeatured: false,
    isOffer: true,
    offerPrice: 69.99,
    stock: 20
  },
  {
    id: 8,
    name: "Summer Dress",
    description: "Fresh and elegant dress for hot days",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1965",
    category: "Fashion",
    subcategory: "Women",
    rating: 4.4,
    reviews: 42,
    slug: "summer-dress",
    isFeatured: true,
    isOffer: false,
    stock: 15
  },
  {
    id: 12,
    name: "Casual Sneakers",
    description: "Comfortable sneakers for daily use",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1996",
    category: "Fashion",
    subcategory: "Men",
    rating: 4.2,
    reviews: 38,
    slug: "casual-sneakers",
    isFeatured: false,
    isOffer: false,
    stock: 23
  },
  
  // Home products
  {
    id: 9,
    name: "Designer Lamp",
    description: "Modern table lamp with adjustable light",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1974",
    category: "Home",
    subcategory: "Decoration",
    rating: 4.6,
    reviews: 53,
    slug: "designer-lamp",
    isFeatured: true,
    isOffer: false,
    stock: 8
  },
  {
    id: 10,
    name: "Automatic Coffee Maker",
    description: "Programmable coffee maker with built-in grinder",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1564585222527-c2777a5bc6cb?q=80&w=2070",
    category: "Home",
    subcategory: "Appliances",
    rating: 4.7,
    reviews: 89,
    slug: "automatic-coffee-maker",
    isFeatured: false,
    isOffer: true,
    offerPrice: 159.99,
    stock: 12
  },
  
  // Sports products
  {
    id: 4,
    name: "Running Shoes",
    description: "Lightweight high-performance shoes",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070",
    category: "Sports",
    subcategory: "Running",
    rating: 4.3,
    reviews: 112,
    slug: "running-shoes",
    isFeatured: false,
    isOffer: false,
    stock: 20
  },
  {
    id: 13,
    name: "Soccer Ball",
    description: "Professional competition ball",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1614632537423-2e24fae60403?q=80&w=2070",
    category: "Sports",
    subcategory: "Soccer",
    rating: 4.5,
    reviews: 76,
    slug: "soccer-ball",
    isFeatured: true,
    isOffer: true,
    offerPrice: 39.99,
    stock: 35
  }
];

// Function to get a category by its slug
const getCategoryBySlug = (slug: string) => {
  return categories.find(category => category.slug === slug);
};

// Function to get products of a specific category
const getProductsByCategory = (categorySlug: string, subcategory?: string) => {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  
  return products.filter(product => 
    product.category === category.name && 
    (!subcategory || product.subcategory === subcategory)
  );
};

// Component to display a product
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  slug: string;
  isFeatured: boolean;
  isOffer: boolean;
  offerPrice?: number;
  stock: number;
}

const ProductCard = ({ product }: { product: Product }) => {
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
              Offer
            </div>
          )}
          
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              Last units!
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of stock</span>
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
              className={`p-2 rounded-full ${
                product.stock > 0 
                  ? 'bg-primary text-white hover:bg-primary-dark' 
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              } transition-colors`}
              disabled={product.stock <= 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Main category page
const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const category = getCategoryBySlug(slug);
  
  // Handle product filtering and sorting
  useEffect(() => {
    if (!category) return;
    
    // Get products of the category (and subcategory if selected)
    let result = getProductsByCategory(
      slug, 
      selectedSubcategory || undefined
    );
    
    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Sort products
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
      case "newest":
        // In a real case, this would sort by creation date
        result.sort((a, b) => b.id - a.id);
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
    
    setFilteredProducts(result);
  }, [slug, selectedSubcategory, sortBy, priceRange, category]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Category not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, the category you are looking for does not exist or has been removed.
          </p>
          <Link 
            href="/categories" 
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            View all categories
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex text-sm">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
              Home
            </Link>
            <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
            <Link href="/categories" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
              Categories
            </Link>
            <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {category.name}
            </span>
          </div>
        </div>
        
        {/* Category header */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div className="relative aspect-[3/1] w-full">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
              <div className="px-8 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-3 text-4xl">{category.icon}</span>
                  {category.name}
                </h1>
                <p className="text-white/80 max-w-2xl mb-4">{category.description}</p>
                <p className="text-white/90 text-sm">{category.productCount} products available</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className={`lg:w-1/4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subcategories</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg ${
                    selectedSubcategory === null
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  All subcategories
                </button>
                
                {category.subcategories.map((subcategory, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSubcategory(subcategory.name)}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                      selectedSubcategory === subcategory.name
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {subcategory.name} ({subcategory.count})
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Filter by price</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-primary"
                />
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setPriceRange([0, 2000])}
                    className="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Availability</h2>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">In stock</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Offers</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Free shipping</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Products */}
          <div className="lg:w-3/4">
            {/* Controls: Sorting and mobile filtering */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center lg:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
              
              <div className="flex items-center ml-auto">
                <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                  <option value="rating">Best rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
            
            {/* Product grid */}
            {filteredProducts?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try other filters or categories
                </p>
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    setPriceRange([0, 2000]);
                    setSortBy("featured");
                  }}
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                  Reset filters
                </button>
              </div>
            )}
            
            {/* Pagination */}
            {filteredProducts?.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Previous
                  </button>
                  
                  <button className="px-3 py-2 rounded-lg bg-primary text-white">
                    1
                  </button>
                  
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    2
                  </button>
                  
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    3
                  </button>
                  
                  <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
                  
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    8
                  </button>
                  
                  <button className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;