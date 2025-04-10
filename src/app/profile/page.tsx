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
  KeyIcon,
  BellIcon,
  ArrowRightIcon,
  ArrowRightStartOnRectangleIcon
} from "@heroicons/react/24/outline";

// Type for user data
interface UserData {
  name: string;
  email: string;
  avatar: string;
  joined: string;
}

// Available profile tabs
const tabs = [
  { id: "account", name: "My Account", icon: UserIcon },
  { id: "orders", name: "Orders", icon: ShoppingBagIcon },
  { id: "wishlist", name: "Wishlist", icon: HeartIcon },
  { id: "payment", name: "Payment Methods", icon: CreditCardIcon },
  { id: "addresses", name: "Addresses", icon: TruckIcon },
  { id: "notifications", name: "Notifications", icon: BellIcon },
  { id: "settings", name: "Settings", icon: CogIcon },
];

// Example user
const userData: UserData = {
  name: "Carlos Rodríguez",
  email: "carlos@example.com",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080",
  joined: "January 2023",
};

const orderHistory = [
  {
    id: "ORD-2023-001",
    date: "June 15, 2023",
    total: 239.98,
    status: "Delivered",
    items: [
      { name: "Bluetooth Headphones", quantity: 1, price: 89.99 },
      { name: "Sports Smartwatch", quantity: 1, price: 149.99 }
    ]
  },
  {
    id: "ORD-2023-002",
    date: "July 23, 2023",
    total: 349.50,
    status: "In Transit",
    items: [
      { name: "Android Tablet 10'", quantity: 1, price: 349.50 }
    ]
  },
  {
    id: "ORD-2023-003",
    date: "August 5, 2023",
    total: 124.95,
    status: "Processing",
    items: [
      { name: "Mechanical Keyboard", quantity: 1, price: 124.95 }
    ]
  }
];
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("account");
  
  // Content to display based on the selected tab
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation Sidebar */}
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
              
              <div className="space-y-1">
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
                
                {/* Logout Button */}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
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

// Components for each tab
const AccountTab = ({ userData }: { userData: UserData }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
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
              Email Address
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
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
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
            Change Password
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const OrdersTab = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Orders</h2>
      
      <div className="space-y-6">
        {orderHistory.map((order) => (
          <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white font-medium">Order {order.id}</span>
                  <span className="mx-2 text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{order.date}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
                  ${order.status === "Delivered" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                    : order.status === "In Transit" 
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center">
                <span className="text-gray-900 dark:text-white font-medium">
                  ${order.total.toFixed(2)}
                </span>
                <Link href={`/orders/${order.id}`} className="ml-4 text-primary hover:text-primary-dark flex items-center">
                  View Details
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="p-4">
              <ul className="space-y-3">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 dark:text-white">{item.quantity}x</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WishlistTab = () => {
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

const PaymentTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Payment Methods</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Saved Cards</h3>
          <button className="text-primary hover:text-primary-dark">+ Add Card</button>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-sm font-medium">
                VISA
              </div>
              <div>
                <div className="text-gray-900 dark:text-white font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Expires: 09/25</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Edit</button>
              <button className="text-gray-500 hover:text-error dark:text-gray-400 dark:hover:text-error">Delete</button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Crypto Wallets</h3>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-14 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-sm font-medium">
                  SOL
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">Solana Wallet</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Connected</div>
                </div>
              </div>
              <button className="text-primary hover:text-primary-dark">
                Disconnect
              </button>
            </div>
          </div>
          <button className="mt-4 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            + Connect New Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressesTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Addresses</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Saved Addresses</h3>
          <button className="text-primary hover:text-primary-dark">+ Add Address</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between">
              <div className="text-gray-900 dark:text-white font-medium">Home</div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">Edit</button>
                <button className="text-gray-500 hover:text-error dark:text-gray-400 dark:hover:text-error">Delete</button>
              </div>
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              <p>Carlos Rodríguez</p>
              <p>Main Avenue 123</p>
              <p>Mexico City, 12345</p>
              <p>Mexico</p>
              <p>Tel: +52 55 1234 5678</p>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-dark bg-opacity-10 text-primary-dark">
                Primary Address
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
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Order Updates</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about your order status</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Offers and Promotions</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive discounts and special promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Push Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Order Updates</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about your order status</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">New Releases</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about new products</p>
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
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Language Preferences</h3>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform Language
            </label>
            <select
              id="language"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              defaultValue="en"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferred Currency</h3>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency for displaying prices
            </label>
            <select
              id="currency"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              defaultValue="USD"
            >
              <option value="USD">USD - United States Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="MXN">MXN - Mexican Peso</option>
              <option value="SOL">SOL - Solana</option>
            </select>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme</h3>
          <div className="flex items-center space-x-4">
            <button className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center space-y-2 hover:border-primary transition-colors">
              <div className="h-10 w-10 bg-white border border-gray-300 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Light</span>
            </button>
            <button className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center space-y-2 hover:border-primary transition-colors">
              <div className="h-10 w-10 bg-gray-900 border border-gray-300 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Dark</span>
            </button>
            <button className="flex-1 p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center space-y-2 hover:border-primary transition-colors">
              <div className="h-10 w-10 bg-gradient-to-r from-white to-gray-900 border border-gray-300 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">System</span>
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Options</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <button className="text-primary hover:text-primary-dark">
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300">Active Sessions</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your connected devices</p>
              </div>
              <button className="text-primary hover:text-primary-dark">
                View Sessions
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;