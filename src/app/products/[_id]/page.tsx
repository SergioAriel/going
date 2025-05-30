import Link from "next/link";
import ProductDetail from "@/app/products/[_id]";
import { getOneProduct } from "@/lib/ServerActions/products";
import { getUser } from "@/lib/ServerActions/users";

const ProductDetailPage = async ({ params }: { params: Promise<{ _id: string }> }) => {
  // const [relatedProducts, setRelatedProducts] = ...;
  const { _id } = await params;
  const product = await getOneProduct(_id)
  if (!product) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Product not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{"The product you are looking for does not exist or has been removed."}</p>
          <Link href="/products" className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
            View all products
          </Link>
        </div>
      </div>
    );
  }

  const seller = JSON.parse(JSON.stringify((await getUser(product.seller))));

  return (
    <ProductDetail product={product} seller={seller} />
  );
};

export default ProductDetailPage;