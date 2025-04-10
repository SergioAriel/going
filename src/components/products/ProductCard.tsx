"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  slug: string;
  stock?: number;
  isOffer?: boolean;
  offerPrice?: number;
  acceptSolana?: boolean;
  acceptCredit?: boolean;
  acceptGooglePay?: boolean;
  acceptApplePay?: boolean;
  acceptedCryptos?: string[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [isWishlist, setIsWishlist] = useState(false);

  // Determinar la imagen a mostrar
  const productImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/400");

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlist(!isWishlist);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Crear un objeto de producto compatible con la interfaz esperada por addToCart
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImage,
      slug: product.slug,
      acceptSolana: product.acceptSolana,
      acceptCredit: product.acceptCredit,
      acceptGooglePay: product.acceptGooglePay,
      acceptApplePay: product.acceptApplePay,
      acceptedCryptos: product.acceptedCryptos
    };
    addToCart(cartProduct, 1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={productImage}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-800 z-10"
          >
            {isWishlist ? (
              <HeartSolidIcon className="h-5 w-5 text-secondary" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
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
              {product.isOffer && product.offerPrice ? (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-secondary ml-2">
                    ${product.offerPrice.toFixed(2)}
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
              className="p-2 bg-primary/10 hover:bg-primary/20 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-full text-primary dark:text-primary-300 transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;