"use client";

import { DragEvent, useState } from "react";
import Link from "next/link";
import {
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import { Product } from "@/interfaces";
import { useAlert } from "@/context/AlertContext";
import { useCurrencies } from "@/context/CurrenciesContext";


const UploadProduct = () => {
  const { user } = usePrivy();
  const [infoProduct, setInfoProduct] = useState<Partial<Product>>({
    seller: user?.id || "",
    name: "",
    description: "",
    category: "",
    price: 0,
    currency: "",
    stock: 0,
    location: "",
    condition: "",
    images: [] as Array<File>,
    tags: "",
    isService: false,
    addressWallet: "",
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { listCryptoCurrencies } = useCurrencies()

  const { handleAlert } = useAlert()

  const categories = [
    { name: "Electronics", value: "electronics" },
    { name: "Clothing and Accessories", value: "clothing" },
    { name: "Home and Garden", value: "home" },
    { name: "Sports", value: "sports" },
    { name: "Toys", value: "toys" },
    { name: "Health and Beauty", value: "health" },
    { name: "Food", value: "food" },
    { name: "Services", value: "services" },
    { name: "Other", value: "other" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "stock" || name === "price") {
      setInfoProduct(prev => ({ ...prev, [name]: Math.round(parseFloat(value)) || 0 }));
      return
    }
    if (name === "tags") {
      setInfoProduct(prev => ({ ...prev, [name]: value.split(",").map((tag: string) => tag.trim()).join(", ") }));
      return
    }
    setInfoProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setInfoProduct(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setInfoProduct(({ ...infoProduct, images: [...infoProduct.images as Array<File>, ...Array.from(files)] }));
    }
  };
  const handleImageRemove = (index: number) => {
    setInfoProduct(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== index) }));
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      return; // No change needed
    }

    const imagesArray = [...infoProduct.images as File[]];
    const [draggedImage] = imagesArray.splice(draggedIndex, 1);
    imagesArray.splice(dropIndex, 0, draggedImage);

    // Update the state with the new order
    setInfoProduct({
      ...infoProduct,
      images: imagesArray,
    });

    // Reset the dragged index
    setDraggedIndex(null);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    Object.entries(infoProduct).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formDataToSend.append(key, item)
        });
      } else {
        formDataToSend.append(key, typeof value === "boolean" ? value.toString() : String(value));
      }
    });
    // Logic to send data to the server would go here
    const requiredFields = ["name", "description", "category", "price", "currency", "images"];
    const isValid = requiredFields.every(field => infoProduct[field as keyof typeof infoProduct] !== "");

    if (!isValid) {
      handleAlert({
        message: "Please fill in all required fields.",
        isError: true
      })
      return;
    }

    // Logic to send data to the server would go here
    fetch("/api/products", {
      method: "POST",
      body: formDataToSend,
    })
    handleAlert({
      message: "Product published successfully!",
      isError: false
    })

  };  

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Publish a Product</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete the following form to publish your product or service on our platform.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {/* Basic Information */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Product Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={infoProduct.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="E.g. Bluetooth Headphones"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={infoProduct.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Describe your product in detail..."
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={infoProduct.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white appearance-none"
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        {categories.map(({ name, value }) => (
                          <option key={value} value={value}>{name}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={infoProduct?.stock?.toString()}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="E.g. 10"
                    />
                  </div>
                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={infoProduct.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="E.g. New York, USA"
                    />
                  </div>
                  {/* Condition */}
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={infoProduct.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    >
                      <option value="" disabled>Select condition</option>
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      id="isService"
                      name="isService"
                      type="checkbox"
                      checked={infoProduct.isService}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isService" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      This is a service (not a physical product)
                    </label>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <div className="flex items-center">
                      <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={infoProduct.tags}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        placeholder="E.g. headphones, wireless, bluetooth (separated by commas)"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Add tags to help buyers find your product
                    </p>
                  </div>
                </div>
              </div>


              {/* Price and Payment Methods */}
              <div className="flex flex-col gap-6 p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Price and Payment Methods
                </h2>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Wallet Address
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Select the wallet address where you want to receive payments.
                  </p>
                  <select
                    id="addressWallet"
                    name="addressWallet"
                    value={!!(user?.linkedAccounts[0]?.type === "wallet") ? user?.linkedAccounts[0]?.address : ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  >
                    <option value="" disabled>Select a wallet</option>
                    {
                      !user?.linkedAccounts.length ?
                        <option value="" disabled>
                          No wallets linked. Please link a wallet to your account.
                        </option>
                        :
                        user?.linkedAccounts.map((account) => {
                          if (account.type === "wallet") {
                            return (
                              <option key={account.address} value={account.address}>
                                {account.address}
                              </option>
                            )
                          }
                        })
                    }
                  </select>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price *
                      </label>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                          type="number"
                          step="0.01"
                          id="price"
                          name="price"
                          value={infoProduct?.price?.toString()}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Currency *
                      </label>
                      <div className="relative">
                        <select
                          id="currency"
                          name="currency"
                          value={infoProduct.currency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white appearance-none"
                          required
                        >
                          <option value="" disabled>Select a currency</option>
                          {listCryptoCurrencies?.map((crypto) => (
                            <option key={crypto.symbol} value={crypto.symbol}>{`${crypto.name} - ${crypto.symbol}`}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {
                      (infoProduct?.price || 1) * (listCryptoCurrencies.find((crypto) => crypto.symbol === infoProduct.currency)?.price || 0)
                    } USD
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    The price is the amount you will receive after the sale. Make sure to set a competitive price.
                  </p>
                </div>
              </div>

              {/* Images */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Product Images
                </h2>

                <div
                  className="flex flex-col gap-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center"
                >
                  <div
                    className="flex flex-col items-center justify-center h-full"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files) {
                        setInfoProduct((prev) => ({
                          ...prev,
                          images: [...prev?.images as Array<File>, ...Array.from(files)],
                        }));
                      }
                    }}
                  >
                    <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="space-y-2">
                      <p className="text-gray-700 dark:text-gray-300">
                        Drag and drop images or
                      </p>
                      <label
                        htmlFor="imageUpload"
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Upload images
                      </label>
                      <input
                        id="imageUpload"
                        onChange={handleImageChange}
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 5MB (maximum 5 images)
                      </p>
                    </div>
                  </div>
                  {
                    !!infoProduct?.images?.length &&
                    <div className="grid grid-cols-2 gap-4 mb-4">

                      {infoProduct.images.map((image, index) => {
                        // if( image.){
                        //dragable change position array

                        return (
                          <div
                            key={index}
                            className="relative"
                            draggable
                            onDragStart={() => setDraggedIndex(index)}
                            onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                            onDrop={() => handleDrop(index)}
                          >
                            {
                              index === 0 &&
                              <label className="absolute left-2 top-2 p-1 border-1 rounded-md border-slate-400 bg-secondary-dark text-white">
                                Main Image
                              </label>

                            }
                            <Image
                              src={URL.createObjectURL(image as File)}
                              alt={`Product Image ${index + 1}`}
                              className="w-full h-auto rounded-lg"
                              width={200}
                              height={200}
                            />
                            <button
                              type="button"
                              onClick={() => handleImageRemove(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-5 w-5"
                            >
                              <span className=" inline-block -translate-y-[15%]">
                                &times;
                              </span>
                            </button>
                          </div>
                        )
                        // }
                      }
                      )}
                    </div>
                  }
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Save draft
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                >
                  Publish product
                </button>
              </div>
            </form>
          </div>

          {/* Help Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tips for selling</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <DocumentTextIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Be detailed:</strong> Include all important specifications of your product.
                  </p>
                </li>
                <li className="flex">
                  <DocumentTextIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Quality images:</strong> Add clear photos from different angles.
                  </p>
                </li>
                <li className="flex">
                  <DocumentTextIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Competitive price:</strong> Research similar prices on the platform.
                  </p>
                </li>
                <li className="flex">
                  <DocumentTextIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Be honest:</strong> Describe any defects or limitations of your product.
                  </p>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need help?</h3>
                <Link href="/ayuda/vendedores" className="text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-dark flex items-center">
                  <span>View seller guides</span>
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProduct;