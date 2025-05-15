import { HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const WishlistTab = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Wishlist</h2>
  
        <div className="text-center py-8">
          <HeartIcon className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Your wishlist is empty</p>
          <Link
            href="/products"
            className="mt-4 inline-block px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  };