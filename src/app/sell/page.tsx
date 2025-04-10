"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PhotoIcon, 
  TagIcon, 
  CurrencyDollarIcon, 
  ChevronDownIcon,
  DocumentTextIcon 
} from "@heroicons/react/24/outline";

const SellerPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    currency: "USD",
    images: [],
    tags: "",
    isService: false,
    acceptSolana: true,
    acceptCredit: true,
    acceptGooglePay: false,
    acceptApplePay: false,
  });

  const categories = [
    "Electrónica",
    "Ropa y Accesorios",
    "Hogar y Jardín",
    "Deportes",
    "Juguetes",
    "Salud y Belleza",
    "Alimentos",
    "Servicios",
    "Otro"
  ];

  const currencies = [
    { value: "USD", label: "USD - Dólar Estadounidense" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "MXN", label: "MXN - Peso Mexicano" },
    { value: "SOL", label: "SOL - Solana" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí iría la lógica para enviar los datos al servidor
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Publicar un Producto</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Completa el siguiente formulario para publicar tu producto o servicio en nuestra plataforma.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {/* Información Básica */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Información del Producto
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Ej. Auriculares Bluetooth"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      placeholder="Describe tu producto detalladamente..."
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoría *
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white appearance-none"
                        required
                      >
                        <option value="" disabled>Selecciona una categoría</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input
                      id="isService"
                      name="isService"
                      type="checkbox"
                      checked={formData.isService}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isService" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Este es un servicio (no un producto físico)
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Etiquetas
                    </label>
                    <div className="flex items-center">
                      <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        placeholder="Ej. auriculares, inalámbrico, bluetooth (separadas por comas)"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Añade etiquetas para ayudar a los compradores a encontrar tu producto
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Precio y Métodos de Pago */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Precio y Métodos de Pago
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Precio *
                      </label>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                          type="number"
                          step="0.01"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Moneda *
                      </label>
                      <div className="relative">
                        <select
                          id="currency"
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white appearance-none"
                          required
                        >
                          {currencies.map((currency) => (
                            <option key={currency.value} value={currency.value}>{currency.label}</option>
                          ))}
                        </select>
                        <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Métodos de pago aceptados
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="acceptSolana"
                          name="acceptSolana"
                          type="checkbox"
                          checked={formData.acceptSolana}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="acceptSolana" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Aceptar pagos con Solana
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="acceptCredit"
                          name="acceptCredit"
                          type="checkbox"
                          checked={formData.acceptCredit}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="acceptCredit" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Aceptar pagos con tarjeta de crédito/débito
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="acceptGooglePay"
                          name="acceptGooglePay"
                          type="checkbox"
                          checked={formData.acceptGooglePay}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="acceptGooglePay" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Aceptar Google Pay
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="acceptApplePay"
                          name="acceptApplePay"
                          type="checkbox"
                          checked={formData.acceptApplePay}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="acceptApplePay" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Aceptar Apple Pay
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Imágenes */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Imágenes del Producto
                </h2>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <div className="space-y-2">
                    <p className="text-gray-700 dark:text-gray-300">
                      Arrastra y suelta imágenes o
                    </p>
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Buscar archivos
                    </button>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF hasta 5MB (máximo 5 imágenes)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="p-6 flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Guardar borrador
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                >
                  Publicar producto
                </button>
              </div>
            </form>
          </div>
          
          {/* Panel lateral de ayuda */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Consejos para vender</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <DocumentTextIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Sé detallado:</strong> Incluye todas las especificaciones importantes de tu producto.
                  </p>
                </li>
                <li className="flex">
                  <DocumentTextIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Imágenes de calidad:</strong> Añade fotos claras y desde diferentes ángulos.
                  </p>
                </li>
                <li className="flex">
                  <DocumentTextIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Precio competitivo:</strong> Investiga precios similares en la plataforma.
                  </p>
                </li>
                <li className="flex">
                  <DocumentTextIcon className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Sé honesto:</strong> Describe cualquier defecto o limitación de tu producto.
                  </p>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">¿Necesitas ayuda?</h3>
                <Link href="/ayuda/vendedores" className="text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-dark flex items-center">
                  <span>Ver guías para vendedores</span>
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

export default SellerPage; 