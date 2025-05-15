
import LogoLoading from "@/components/svgs/LogoLoading";
import { Product } from "@/interfaces";
import { getProducts } from "@/lib/ServerActions/products";
import { Suspense } from "react";
import ProductsRendering from ".";


const ProductsPage = async (params: Promise<{ category: string }>) => {
  const { category } = await params
  const products: Promise<Product[]> = getProducts({ category }, { metacritic: -1 });

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><LogoLoading /></div>}>
      <ProductsRendering dbProducts={products} />
    </Suspense>
  );
};

export default ProductsPage;


