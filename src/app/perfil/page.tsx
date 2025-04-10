"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  UserIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  CreditCardIcon, 
  TruckIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  KeyIcon,
  BellIcon
} from "@heroicons/react/24/outline";

// Tipo para los datos de usuario
interface UserData {
  name: string;
  email: string;
  avatar: string;
  joined: string;
}

// Pestañas disponibles en el perfil
const tabs = [
  { id: "account", name: "Mi Cuenta", icon: UserIcon },
  { id: "orders", name: "Pedidos", icon: ShoppingBagIcon },
  { id: "wishlist", name: "Lista de Deseos", icon: HeartIcon },
  { id: "payment", name: "Métodos de Pago", icon: CreditCardIcon },
  { id: "addresses", name: "Direcciones", icon: TruckIcon },
  { id: "notifications", name: "Notificaciones", icon: BellIcon },
  { id: "settings", name: "Configuración", icon: CogIcon },
];

// Usuario de ejemplo
const userData: UserData = {
  name: "Carlos Rodríguez",
  email: "carlos@example.com",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080",
  joined: "Enero 2023",
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("account");
  
  // Contenido a mostrar según la pestaña seleccionada
  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountTab userData={userData} />;
      case "orders":
        return <OrdersTab />;
      case "wishlist":
        return <WishlistTab />;
      case "payment":
        return <PaymentTab />;
      case "addresses":
        return <AddressesTab />;
      case "notifications":
        return <NotificationsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <AccountTab userData={userData} />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Mi Perfil</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de navegación */}
          <div className="md:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{userData.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
                
                {/* Botón de cerrar sesión */}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="md:w-3/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes para cada pestaña
const AccountTab = ({ userData }: { userData: UserData }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Información Personal</h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              defaultValue={userData.name}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              defaultValue={userData.email}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Ingresa tu número de teléfono"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <KeyIcon className="h-5 w-5 mr-2" />
            Cambiar Contraseña
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                id="currentPassword"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

const OrdersTab = () => {
  // Datos de ejemplo para pedidos
  const orders = [
    {
      id: "ORD-12345",
      date: "10 Mar 2024",
      total: 379.98,
      status: "Entregado",
      statusColor: "bg-green-100 text-green-800",
      items: 2
    },
    {
      id: "ORD-12344",
      date: "25 Feb 2024",
      total: 129.99,
      status: "En camino",
      statusColor: "bg-blue-100 text-blue-800",
      items: 1
    },
    {
      id: "ORD-12343",
      date: "15 Feb 2024",
      total: 249.99,
      status: "Procesando",
      statusColor: "bg-yellow-100 text-yellow-800",
      items: 3
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Mis Pedidos</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBagIcon className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">No tienes pedidos aún</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pedido
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.items}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <Link href={`/pedidos/${order.id}`} className="text-primary hover:text-primary-dark">
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const WishlistTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Mi Lista de Deseos</h2>
      
      <div className="text-center py-8">
        <HeartIcon className="h-12 w-12 mx-auto text-gray-400" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Tu lista de deseos está vacía</p>
        <Link 
          href="/productos"
          className="mt-4 inline-block px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
        >
          Explorar Productos
        </Link>
      </div>
    </div>
  );
};

const PaymentTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Métodos de Pago</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tarjetas Guardadas</h3>
          <button className="text-primary hover:text-primary-dark">+ Añadir Tarjeta</button>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-sm font-medium">
                VISA
              </div>
              <div>
                <div className="text-gray-900 dark:text-white font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Vence: 09/25</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Editar</button>
              <button className="text-gray-500 hover:text-error dark:text-gray-400 dark:hover:text-error">Eliminar</button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Billeteras Crypto</h3>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-sm font-medium">
                  SOL
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">Billetera Solana</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Conectada</div>
                </div>
              </div>
              <button className="text-primary hover:text-primary-dark">
                Desconectar
              </button>
            </div>
          </div>
          <button className="mt-4 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            + Conectar Nueva Billetera
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressesTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Mis Direcciones</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Direcciones Guardadas</h3>
          <button className="text-primary hover:text-primary-dark">+ Añadir Dirección</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between">
              <div className="text-gray-900 dark:text-white font-medium">Casa</div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Editar</button>
                <button className="text-gray-500 hover:text-error dark:text-gray-400 dark:hover:text-error">Eliminar</button>
              </div>
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              <p>Carlos Rodríguez</p>
              <p>Av. Principal 123</p>
              <p>Ciudad de México, 12345</p>
              <p>México</p>
              <p>Tel: +52 55 1234 5678</p>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-dark bg-opacity-10 text-primary-dark">
                Dirección principal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Preferencias de Notificaciones</h2>
      
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notificaciones por Email</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Actualizaciones de pedidos</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recibe emails sobre el estado de tus pedidos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Ofertas y promociones</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recibe descuentos y promociones especiales</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notificaciones Push</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Actualizaciones de pedidos</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones sobre el estado de tus pedidos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Nuevos lanzamientos</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones sobre nuevos productos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
          >
            Guardar Preferencias
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Configuración de la Cuenta</h2>
      
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferencias de Idioma</h3>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Idioma de la plataforma
            </label>
            <select
              id="language"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              defaultValue="es"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Moneda Preferida</h3>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Moneda para mostrar precios
            </label>
            <select
              id="currency"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              defaultValue="USD"
            >
              <option value="USD">USD - Dólar Estadounidense</option>
              <option value="EUR">EUR - Euro</option>
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="SOL">SOL - Solana</option>
            </select>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tema</h3>
          <div className="flex items-center space-x-4">
            <button className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center space-y-2 hover:border-primary transition-colors">
              <div className="h-10 w-10 bg-white border border-gray-300 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Claro</span>
            </button>
            <button className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center space-y-2 hover:border-primary transition-colors">
              <div className="h-10 w-10 bg-gray-900 border border-gray-300 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Oscuro</span>
            </button>
            <button className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center space-y-2 hover:border-primary transition-colors">
              <div className="h-10 w-10 bg-gradient-to-r from-white to-gray-900 border border-gray-300 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Sistema</span>
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Opciones de Seguridad</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Autenticación de dos factores</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Añade una capa adicional de seguridad a tu cuenta</p>
              </div>
              <button className="text-primary hover:text-primary-dark">
                Configurar
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Sesiones activas</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona tus dispositivos conectados</p>
              </div>
              <button className="text-primary hover:text-primary-dark">
                Ver sesiones
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 