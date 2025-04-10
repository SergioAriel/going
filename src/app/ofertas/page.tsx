"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";

// Productos en oferta (simulando datos de backend)
const offerProducts = [
  {
    id: 1,
    name: "Smartwatch Deportivo",
    description: "Reloj inteligente con GPS y monitoreo cardíaco",
    originalPrice: 249.99,
    offerPrice: 199.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099",
    category: "Electrónica",
    rating: 4.2,
    reviews: 95,
    slug: "smartwatch-deportivo",
    stock: 8,
    expiresIn: "23:59:41" // tiempo restante de la oferta
  },
  {
    id: 2,
    name: "Laptop Ultradelgada",
    description: "Potente laptop con procesador de última generación",
    originalPrice: 999.99,
    offerPrice: 849.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071",
    category: "Electrónica",
    rating: 4.7,
    reviews: 203,
    slug: "laptop-ultradelgada",
    stock: 3,
    expiresIn: "23:59:41"
  },
  {
    id: 3,
    name: "Chaqueta Impermeable",
    description: "Chaqueta ligera perfecta para días lluviosos",
    originalPrice: 89.99,
    offerPrice: 69.99,
    discount: 22,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936",
    category: "Moda",
    rating: 4.3,
    reviews: 67,
    slug: "chaqueta-impermeable",
    stock: 20,
    expiresIn: "23:59:41"
  },
  {
    id: 4,
    name: "Cafetera Automática",
    description: "Cafetera programable con molinillo incorporado",
    originalPrice: 199.99,
    offerPrice: 159.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1564585222527-c2777a5bc6cb?q=80&w=2070",
    category: "Hogar",
    rating: 4.7,
    reviews: 89,
    slug: "cafetera-automatica",
    stock: 12,
    expiresIn: "23:59:41"
  },
  {
    id: 5,
    name: "Balón de Fútbol",
    description: "Balón profesional de competición",
    originalPrice: 49.99,
    offerPrice: 39.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1614632537423-2e24fae60403?q=80&w=2070",
    category: "Deportes",
    rating: 4.5,
    reviews: 76,
    slug: "balon-futbol",
    stock: 35,
    expiresIn: "23:59:41"
  },
  {
    id: 6,
    name: "Audífonos Inalámbricos",
    description: "Audífonos con cancelación de ruido y batería de larga duración",
    originalPrice: 129.99,
    offerPrice: 99.99,
    discount: 23,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070",
    category: "Electrónica",
    rating: 4.6,
    reviews: 152,
    slug: "audifonos-inalambricos",
    stock: 7,
    expiresIn: "23:59:41"
  },
  {
    id: 7,
    name: "Silla Ergonómica",
    description: "Silla de oficina con soporte lumbar y ajuste de altura",
    originalPrice: 179.99,
    offerPrice: 139.99,
    discount: 22,
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1887",
    category: "Hogar",
    rating: 4.4,
    reviews: 58,
    slug: "silla-ergonomica",
    stock: 4,
    expiresIn: "23:59:41"
  },
  {
    id: 8,
    name: "Cámara Instantánea",
    description: "Cámara con impresión instantánea de fotos",
    originalPrice: 89.99,
    offerPrice: 69.99,
    discount: 22,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=2070",
    category: "Electrónica",
    rating: 4.1,
    reviews: 45,
    slug: "camara-instantanea",
    stock: 9,
    expiresIn: "23:59:41"
  },
  {
    id: 9,
    name: "Kit de Maquillaje Profesional",
    description: "Set completo de maquillaje con paletas y brochas",
    originalPrice: 149.99,
    offerPrice: 119.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087",
    category: "Belleza",
    rating: 4.3,
    reviews: 64,
    slug: "kit-maquillaje",
    stock: 6,
    expiresIn: "23:59:41"
  },
  {
    id: 10,
    name: "Mesa de Centro",
    description: "Mesa de centro de diseño moderno para sala de estar",
    originalPrice: 129.99,
    offerPrice: 99.99,
    discount: 23,
    image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?q=80&w=1974",
    category: "Hogar",
    rating: 4.5,
    reviews: 37,
    slug: "mesa-centro",
    stock: 2,
    expiresIn: "23:59:41"
  }
];

// Categorías con descuentos destacados
const featuredCategories = [
  { 
    name: "Electrónica",
    discount: "Hasta 25% OFF",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2701",
    slug: "electronica"
  },
  { 
    name: "Moda",
    discount: "Hasta 30% OFF",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071",
    slug: "moda"
  },
  { 
    name: "Hogar",
    discount: "Hasta 20% OFF",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974",
    slug: "hogar"
  },
  { 
    name: "Deportes",
    discount: "Hasta 40% OFF",
    image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=1974",
    slug: "deportes"
  }
];

// Componente para mostrar un producto en oferta
const OfferProductCard = ({ product }: { product: typeof offerProducts[0] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative">
      <div className="absolute top-0 right-0 bg-secondary text-white px-3 py-1 z-10 rounded-bl-lg font-bold">
        {product.discount}% OFF
      </div>
      
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 hover:text-primary transition-colors line-clamp-1">
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
              <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="text-xl font-bold text-secondary ml-2">
                ${product.offerPrice.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {product.stock < 5 ? (
                  <span className="text-amber-600 dark:text-amber-400">
                    ¡Últimas unidades!
                  </span>
                ) : (
                  <span>En stock</span>
                )}
              </div>
              <div className="text-xs font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                Termina en: {product.expiresIn}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Componente para mostrar una categoría destacada
const FeaturedCategoryCard = ({ category }: { category: typeof featuredCategories[0] }) => {
  return (
    <Link href={`categories/${category.slug}?discount=true`} className="block group">
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
          <p className="text-secondary font-medium">{category.discount}</p>
        </div>
      </div>
    </Link>
  );
};

// Página principal de ofertas
const OffersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filtrar productos por categoría si hay una seleccionada
  const filteredProducts = selectedCategory 
    ? offerProducts.filter(product => product.category === selectedCategory)
    : offerProducts;
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Hero section */}
        <div className="relative rounded-xl overflow-hidden mb-12">
          <div className="relative aspect-[21/9] w-full">
            <Image
              src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2115"
              alt="Ofertas especiales"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
              <div className="px-8 md:px-16 lg:w-1/2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                  Ofertas del día
                </h1>
                <div className="bg-secondary inline-block px-3 py-1 rounded-md mb-6">
                  <p className="text-white font-bold">
                    ¡HASTA 40% DE DESCUENTO!
                  </p>
                </div>
                <p className="text-white/90 text-lg mb-6">
                  Aprovecha nuestras ofertas por tiempo limitado en productos exclusivos. 
                  ¡No te las pierdas!
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="#products"
                    className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    scroll={false}
                  >
                    Ver ofertas
                  </Link>
                  <Link
                    href="categories"
                    className="bg-white hover:bg-gray-100 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    Explorar categorías
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Categorías destacadas */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Categorías con los mejores descuentos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category, index) => (
              <FeaturedCategoryCard key={index} category={category} />
            ))}
          </div>
        </div>
        
        {/* Productos en oferta */}
        <div id="products">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
              Ofertas especiales por tiempo limitado
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedCategory('Electrónica')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'Electrónica'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Electrónica
              </button>
              <button
                onClick={() => setSelectedCategory('Hogar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'Hogar'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Hogar
              </button>
              <button
                onClick={() => setSelectedCategory('Moda')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'Moda'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Moda
              </button>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <OfferProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No hay ofertas disponibles
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Por el momento no hay ofertas en esta categoría.
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Ver todas las ofertas
              </button>
            </div>
          )}
        </div>
        
        {/* Información adicional */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-3xl text-primary mb-3">🚚</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Envío gratis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              En compras superiores a $50 en todos los productos en oferta.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-3xl text-primary mb-3">⏱️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ofertas por tiempo limitado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Todas las ofertas tienen un tiempo de expiración. ¡Aprovéchalas ahora!
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-3xl text-primary mb-3">💳</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pago seguro
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Paga con tarjeta de crédito, PayPal o directamente con Solana.
            </p>
          </div>
        </div>
        
        {/* Suscripción a ofertas */}
        <div className="mt-16 mb-8 bg-gradient-to-r from-primary to-secondary rounded-lg overflow-hidden shadow-lg">
          <div className="px-6 py-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿No quieres perderte ninguna oferta?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Suscríbete a nuestro boletín de ofertas y recibe notificaciones sobre descuentos exclusivos y ofertas relámpago.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white hover:bg-gray-100 text-primary font-medium px-6 py-3 rounded-lg transition-colors">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage; 