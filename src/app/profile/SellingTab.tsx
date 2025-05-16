import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";
import { Product } from "@/interfaces";
import { getProducts } from "@/lib/ServerActions/products";
import { updateUser } from "@/lib/ServerActions/users";
import Link from "next/link";
import { useEffect, useState } from "react";

export const SellingTab = () => {
    const { userData, setUserData } = useUser()
    const [isSeller, setIsSeller] = useState(userData.isSeller)
    const [userProducts, setUserProducts] = useState<Product[] | null>()
    const { handleAlert } = useAlert();
  
    useEffect(() => {
      if (userData.isSeller) {
        (async () => {
          const products = await getProducts({ seller: userData._id })
          if (products.length) {
            setUserProducts(products);
          } else {
            handleAlert({
              message: "Error fetching user products",
              isError: true
            })
          }
        }
        )()
      }
    }, [userData])
  
    const handlerSeller = async () => {
      const resp = await updateUser({
        ...userData,
        isSeller
      })
      if (resp.status) {
        setUserData({
          ...userData,
          isSeller
        })
      }
    }
  
    if (!userData.addresses.length) {
      if (!userData.isSeller) {
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Becoming a seller</h2>
            <div className="flex flex-col w-full gap-6">
              <p>Comming Soon KYC</p>
              <div className="flex flex-col w-full gap-4">
                <p>Test seller feature</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input checked={isSeller} onChange={() => setIsSeller(!isSeller)} type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handlerSeller}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
              >
                Send Information.
              </button>
            </div>
          </div>
        )
      }
      return (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Becoming a seller</h2>
          <p>To become a seller, please add an address.</p>
          <Link
            href="/profile?tab=addresses"
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg font-medium transition-colors"
          >
            Add Address
          </Link>
        </div>
      )
  
    }
  
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Products</h2>
  
        <div className="flex justify-end mb-4">
          <Link
            href="/uploadProduct"
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg font-medium transition-colors"
          >
            + Add New Product
          </Link>
        </div>
  
        <div className="space-y-4">
          {userProducts?.map((product) => (
            <div key={product._id as string} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">${product.price.toFixed(2)}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === "Active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
              >
                {product.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };