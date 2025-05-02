"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, ShoppingCartIcon, HeartIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useCart } from "@/context/CartContext";

// Interfaces for data
interface Product {
  _id: number;
  name: string;
  description: string;
  price: number;
  images?: string[];
  image?: string;
  category: string;
  rating: number;
  reviews: number;
  slug: string;
  stock: number;
  sellerId: number;
  acceptSolana?: boolean;
  acceptCredit?: boolean;
  acceptGooglePay?: boolean;
  acceptApplePay?: boolean;
  acceptedCryptos?: string[];
  specifications?: Array<{name: string, value: string}>;
  relatedProducts?: number[];
}

interface Seller {
  id: number;
  name: string;
  wallet: string;
}

interface DbData {
  product: Product;
  seller: Seller[];
}

const ProductDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
  
  // Load product from db.json
  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${slug}`, {
          cache: 'no-store'
        });
        if (!response.ok) {
          throw new Error('Failed to load the database');
        }
        const data: DbData = await response.json();
        // Find the product by its slug
        const foundProduct  = data.product;
        
        if (!foundProduct) {
          setError("Product not found");
          setIsLoading(false);
          return;
        }
                
        // If the product has a single image instead of an array of images
        if (foundProduct.image && !foundProduct.images) {
          foundProduct.images = [foundProduct.image];
        } else if (!foundProduct.images && !foundProduct.image) {
          // If it has no images, assign a default one
          foundProduct.images = ["https://via.placeholder.com/400"];
        }
        
        setProduct(foundProduct);
        
        // Find the seller associated with the product
        if (foundProduct.sellerId) {
          const foundSeller = data.seller.find(s => s.id === foundProduct.sellerId);
          if (foundSeller) {
            setSeller(foundSeller);
          }
        }
        
        // Get related products if they exist
        if (foundProduct.relatedProducts && foundProduct.relatedProducts.length > 0) {
            // const related: Product[] = [];
          // data.product.filter(p => 
          //   foundProduct.relatedProducts?.includes(p._id)
          // );
          // setRelatedProducts(related);
        } else {
          // If there are no specific related products, show products from the same category
          // const sameCategoryProducts: Seller[] = []
          // data.products.filter(p => 
          //   p.category === foundProduct.category && p._id !== foundProduct._id
          // ).slice(0, 3);
          // setRelatedProducts(sameCategoryProducts);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading product data:", error);
        setError("Failed to load product information. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Loading product...</h1>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Product not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error || "The product you are looking for does not exist or has been removed."}</p>
          <Link href="/products" className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
            View all products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    
    // Create a product object compatible with the interface expected by addToCart
    const cartProduct = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "https://via.placeholder.com/400",
      slug: product.slug,
      acceptSolana: product.acceptSolana,
      acceptCredit: product.acceptCredit,
      acceptGooglePay: product.acceptGooglePay,
      acceptApplePay: product.acceptApplePay,
      acceptedCryptos: product.acceptedCryptos
    };
    
    addToCart(cartProduct, quantity);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex text-sm text-gray-600 dark:text-gray-400">
            <li className="mr-2">
              <Link href="/" className="hover:text-primary dark:hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="mr-2">
              <Link href="/products" className="hover:text-primary dark:hover:text-primary">Products</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="mr-2">
              <Link href={`/products?category=${product.category}`} className="hover:text-primary dark:hover:text-primary">
                {product.category}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 dark:text-white font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Image gallery */}
          <div className="lg:w-1/2">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              {product.images && product.images.length > 0 && (
                <div className="relative aspect-square">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product details */}
          <div className="lg:w-1/2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.rating) ? (
                      <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ) : i < product.rating ? (
                      <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <StarIcon key={i} className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                    )
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {product?.rating?.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">${Number(product?.price).toFixed(2)}</span>
                {product.stock <= 5 && (
                  <span className="ml-4 text-sm text-red-600 font-medium">
                    Only {product.stock} left in stock!
                  </span>
                )}
              </div>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {product.description}
              </p>
              
              {/* Payment methods */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Payment Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {product.acceptCredit && (
                    <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
                      Credit Card
                    </span>
                  )}
                  {product.acceptSolana && (
                    <span className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full">
                      Solana
                    </span>
                  )}
                  {product.acceptGooglePay && (
                    <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
                      Google Pay
                    </span>
                  )}
                  {product.acceptApplePay && (
                    <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
                      Apple Pay
                    </span>
                  )}
                  {product.acceptedCryptos && product.acceptedCryptos.map(crypto => (
                    <span key={crypto} className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                      {crypto}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-l-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    min="1"
                    max={product.stock}
                    className="w-16 h-10 border-t border-b border-gray-300 dark:border-gray-600 text-center text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  />
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 rounded-r-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Add to cart button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={toggleWishlist}
                  className="flex-1 sm:flex-none border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {isWishlist ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span className="ml-2 sm:hidden md:inline">Add to Wishlist</span>
                </button>
              </div>
            </div>
            
            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Specifications</h2>
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                      <span className="w-1/3 text-gray-600 dark:text-gray-400">{spec.name}</span>
                      <span className="w-2/3 text-gray-900 dark:text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Seller Information */}
        {seller && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h2>
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCardIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-gray-900 dark:text-white font-medium">{seller.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Wallet: {seller.wallet.substring(0, 6)}...{seller.wallet.substring(seller.wallet.length - 4)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={product.images?.[0] || product.image || "https://via.placeholder.com/400"}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            i < Math.floor(product.rating) ? (
                              <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <StarIcon key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                            )
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                        <button className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          <ShoppingCartIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;