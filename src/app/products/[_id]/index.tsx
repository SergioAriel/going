"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, ShoppingCartIcon, HeartIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useCart } from "@/context/CartContext";
import { Product, User } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useCurrencies } from "@/context/CurrenciesContext";

const ProductDetail = ({ product, seller }: { product: Product, seller?: User | null }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter()
  const { addToCart } = useCart();
  const {listCryptoCurrencies, userCurrency} = useCurrencies();

  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  // const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const nameCategories = {
    electronics: "Electronics",
    clothing: "Clothing and Accessories",
    home: "Home and Garden",
    sports: "Sports",
    toys: "Toys",
    health: "Health and Beauty",
    food: "Food",
    namservicese: "Services",
    other: "Other",
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, quantity);
  };

  const handleBuyer = () => {
    if (!product) return;
    router.push(`/checkout/${product._id}/${quantity}`)
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
                {nameCategories[product.category as keyof typeof nameCategories]}
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
                    src={product.images[selectedImage] as string || "/imageNotFound.svg"}
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
                    className={`relative aspect-square rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    <Image
                      src={image as string || "/imageNotFound.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      sizes="100%"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="relative lg:w-1/2">
            <button
              onClick={toggleWishlist}
              className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 z-10"
            >
              {isWishlist ? (
                <HeartSolidIcon className="h-4 w-4 text-[#D300E5]" />
              ) : (
                <HeartIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
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
                  {product?.rating?.toFixed(1)} ({product.reviews||0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div
                  className="flex flex-col"
                >
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{product.currency}{Number(product?.price)}</span>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{userCurrency.currency}{(Number(product?.price) * (listCryptoCurrencies.find((crypto) => crypto.symbol === product.currency)?.price || 0) / (userCurrency.price || 1)).toFixed(2)}</span>
                </div>

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

              {/* Quantity */}
              <div className="mb-6">
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
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
                <div
                  className="flex flex-col gap-4 w-full"
                >

                  <button
                    onClick={handleBuyer}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Buy!
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-secondary  hover:bg-secondary-dark text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                </div>

              </div>
            </div>

            {/* Specifications */}
            {/* {product.specifications && product.specifications.length > 0 && (
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
            )} */}
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
                <span>{seller.bio}</span>
              </div>
            </div>
          </div>
        )}

        {/* Related products */}
        {/* {relatedProducts.length > 0 && (
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
        )} */}
      </div>
    </div>
  );
};

export default ProductDetail;