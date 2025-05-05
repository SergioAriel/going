import ProductsRendering from "@/components/pages/products";
import { Product } from "@/interfaces";
import { getProducts } from "@/lib/products";


const ProductsPage = async () => {

  const products: Product[] = await getProducts()

  return (
    <ProductsRendering initialProducts={products}/>
  );
};

export default ProductsPage;


