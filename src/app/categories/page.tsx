"use client";

import Image from "next/image";
import Link from "next/link";

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
      { name: "Men", slug: "men-fashion", count: 78 },
      { name: "Women", slug: "women-fashion", count: 98 },
      { name: "Kids", slug: "kids-fashion", count: 45 },
      { name: "Accessories", slug: "fashion-accessories", count: 22 }
    ]
  },
  {
    id: 3,
    name: "Home",
    description: "Furniture, decoration, and appliances",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=2788",
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
  },
  {
    id: 5,
    name: "Beauty",
    description: "Makeup, perfumes, and personal care",
    icon: "💄",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080",
    productCount: 172,
    slug: "beauty",
    subcategories: [
      { name: "Makeup", slug: "makeup", count: 48 },
      { name: "Skin Care", slug: "skin-care", count: 53 },
      { name: "Perfumes", slug: "perfumes", count: 31 },
      { name: "Hair", slug: "hair", count: 40 }
    ]
  },
  {
    id: 6,
    name: "Pets",
    description: "Everything for the care and well-being of your pets",
    icon: "🐕",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2064",
    productCount: 98,
    slug: "pets",
    subcategories: [
      { name: "Dogs", slug: "dogs", count: 42 },
      { name: "Cats", slug: "cats", count: 36 },
      { name: "Food", slug: "pet-food", count: 15 },
      { name: "Accessories", slug: "pet-accessories", count: 5 }
    ]
  },
  {
    id: 7,
    name: "Books",
    description: "Books, comics, and literature",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=2071",
    productCount: 215,
    slug: "books",
    subcategories: [
      { name: "Fiction", slug: "fiction", count: 87 },
      { name: "Non-fiction", slug: "non-fiction", count: 74 },
      { name: "Comics", slug: "comics", count: 32 },
      { name: "Education", slug: "education", count: 22 }
    ]
  },
  {
    id: 8,
    name: "Toys",
    description: "Toys, board games, and items for kids",
    icon: "🧸",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b40?q=80&w=2040",
    productCount: 127,
    slug: "toys",
    subcategories: [
      { name: "For Babies", slug: "babies", count: 34 },
      { name: "Board Games", slug: "board-games", count: 28 },
      { name: "Educational Toys", slug: "educational-toys", count: 36 },
      { name: "Stuffed Animals", slug: "stuffed-animals", count: 29 }
    ]
  }
];

const CategoriesPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explore all our categories
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Find what you need among our wide selection of products organized by categories.
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              href={`/categories/${category.slug}`} 
              key={category.id}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1 flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </h2>
                      <p className="text-gray-200 text-sm mb-2">{category.productCount} products</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Popular subcategories:</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((subcategory, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full"
                        >
                          {subcategory.name} ({subcategory.count})
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-primary group-hover:text-primary-dark flex items-center transition-colors">
                    <span>View all products</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Promotional Banner */}
        <div className="mt-16 mb-12 bg-gradient-to-r from-primary to-secondary rounded-lg overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-12 md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Want to sell your products?</h2>
              <p className="text-white/90 mb-6">Join our seller community and reach thousands of potential customers.</p>
              <Link 
                href="/sell" 
                className="inline-block px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Start selling
              </Link>
            </div>
            
            <div className="md:w-1/2 px-8 pb-8 md:p-0 md:h-72 lg:h-80 relative">
              <div className="relative h-48 md:h-full w-full">
                <Image
                  src="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2670"
                  alt="Sell your products"
                  fill
                  className="object-cover rounded-lg md:rounded-none"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Interests Navigation Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Browse by interests
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Daily Deals", icon: "🔥", url: "/deals" },
              { name: "New Arrivals", icon: "✨", url: "/products?sort=newest" },
              { name: "Top Rated", icon: "⭐", url: "/products?sort=rating" },
              { name: "Free Shipping", icon: "🚚", url: "/products?filter=free_shipping" },
              { name: "Pay with Solana", icon: "💰", url: "/products?filter=solana" },
              { name: "Eco-friendly", icon: "🌱", url: "/products?filter=eco" },
            ].map((interest, index) => (
              <Link 
                key={index} 
                href={interest.url}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{interest.icon}</div>
                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{interest.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;