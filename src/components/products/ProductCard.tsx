"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useCart } from "@/context/CartContext";
import { Product } from "@/interfaces";


// Product Card Component with Add to Cart functionality
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [isWishlist, setIsWishlist] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlist(!isWishlist);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    // Optional: Add feedback
    alert(`Added to cart: ${product.name}`);
  };

  return (
    <Link href={`/products/${product?._id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Image
              src={product?.mainImage}
              alt={product?.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              onClick={toggleWishlist}
              className="absolute top-2 left-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-800 z-10"
            >
              {isWishlist ? (
                <HeartSolidIcon className="h-4 w-4 text-secondary" />
              ) : (
                <HeartIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {product.isOffer && (
            <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
              Sale
            </div>
          )}

          {
            product?.stock <= 5 && product?.stock > 0 && (
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
        <h3 title={product.name} className="text-lg font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
  {product.name}
</h3>

          <div className="flex items-center mb-2">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) =>
                  i < Math.floor(product?.rating) ? (
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
                    ${product.isOffer && product.offerPercentage ? product.price - (product.price * product.offerPercentage) : false}
                    {/* ${product.offerPrice?.toFixed(2) || product.price.toFixed(2)} */}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${product?.price}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-full ${product.stock > 0
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
}

export default ProductCard;