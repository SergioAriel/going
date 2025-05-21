"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, ShoppingCartIcon, HeartIcon, ShoppingBagIcon, HeartIcon as HeartSolidIcon, PlusIcon, StarIcon as StarSolidIcon } from "@heroicons/react/24/outline";
// import { HeartIcon as HeartSolidIcon, PlusIcon, StarIcon as StarSolidIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { Product } from "@/interfaces";
import { useCurrencies } from "@/context/CurrenciesContext";
import { Tooltip } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";


// Product Card Component with Add to Cart functionality
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { listCryptoCurrencies, userCurrency } = useCurrencies();
  const [isWishlist, setIsWishlist] = useState(false);
  const [convertedPrice, setConvertedPrice] = useState<number>(0)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlist(!isWishlist);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    // Optional: Add feedback
  };

  useEffect(() => {
    setConvertedPrice(listCryptoCurrencies.find((crypto) => crypto.symbol === product.currency)?.price || 0)
  }, [listCryptoCurrencies])

  const handleToBuy = () => {

  }



  return (
    <Link href={`/products/${product?._id}`} className="block group">
      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">

        {/* Product Image */}
        <div className="relative">
          <div className="flex items-center justify-center aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <Image
              src={product?.mainImage || "/imageNotFound.svg"}
              alt={product?.name}
              width={300}
              height={300}
              className={`${product?.mainImage ? "w-full h-full" : "w-1/2 h-1/2"} object-cover transition-transform duration-300 group-hover:scale-105`}
            />

            {/* Wishlist */}
            <button
              onClick={toggleWishlist}
              className="absolute top-3 left-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow hover:bg-white dark:hover:bg-gray-700 z-10"
            >
              {isWishlist ? (
                <HeartSolidIcon className="h-4 w-4 text-[#D300E5]" />
              ) : (
                <HeartIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            {product.isOffer && (
              <span className="absolute top-3 right-3 bg-[#D300E5] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                Oferta
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-3 left-3 translate-y-8 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                ¡Quedan pocos!
              </span>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Agotado</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 title={product.name} className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-[#14BFFB] transition-colors truncate">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 my-2">
            <div className="flex">
              {Array(5).fill(0).map((_, i) =>
                i < Math.floor(product?.rating) ? (
                  <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
                ) : (
                  <StarIcon key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                )
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviews})</span>
          </div>

          {/* Descripción */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-3">
            {product.description}
          </p>

          {/* Price and actions */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              {/* ConvertedPrice */}
              {
                userCurrency && (
                  <div className="flex  text-secondary">
                    <span className="text-lg font-bold">
                      {userCurrency.currency} {((product?.price * (1 - ((product.offerPercentage || 0) / 100)) * convertedPrice) / userCurrency?.price).toFixed(2)}
                    </span>
                    <Tooltip content="Approximate price converted to your currency">
                      <InformationCircleIcon className="w-4 h-4 text-secondary" />
                    </Tooltip>
                    <p className=" self-center text-xs">(-{(product.offerPercentage || 0)}%)</p>

                  </div>
                )
              }
              {/* Original Price and Offer */}
              {product.offerPercentage ? (
                <div className="flex items-center text-primary">
                  <span className="text-md font-bold ">
                    {product.currency} {(product.price * (1 - ((product.offerPercentage || 0) / 100))).toFixed(2)}
                  </span>
                  <p className="text-xs">(-{(product.offerPercentage || 3)}%)</p>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {product.currency} {product.price.toFixed(2)}
                </span>
              )}

              <div
                className="flex text-xs gap-2"
              >

                <span className="line-through text-gray-500 dark:text-gray-400">
                  {userCurrency.currency} {product.price.toFixed(2)}
                </span>
                <span className="line-through text-gray-500 dark:text-gray-400">
                  {userCurrency.currency} {((product.price * convertedPrice) / userCurrency.price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              {/* Agregar al carrito: botón sólido violeta */}
              <button
                onClick={handleAddToCart}
                className={`p-2 rounded-full transition-colors ${product.stock > 0
                  ? 'bg-secondary text-white hover:bg-secondary-dark'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                disabled={product.stock <= 0}
              >
                <ShoppingBagIcon className="h-5 w-5" />
              </button>

              {/* Comprar ahora: botón outline celeste */}
              <button
                onClick={handleToBuy}
                className={`relative p-2 rounded-full   outline-2 outline-primary text-primary hover:bg-primary hover:text-white transition-colors ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={product.stock <= 0}
              >
                <PlusIcon className="absolute h-3 w-3 top-1 right-1 stroke-3" />
                <ShoppingCartIcon className="h-5 w-5" />
              </button>
            </div>




          </div>
        </div>
      </div>
    </Link>

  );
}

export default ProductCard;