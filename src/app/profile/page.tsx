"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  CreditCardIcon,
  TruckIcon,
  CogIcon,
  BellIcon,
  ArrowRightIcon,
  ArrowRightStartOnRectangleIcon,
  DocumentDuplicateIcon,
  ArrowLeftEndOnRectangleIcon
} from "@heroicons/react/24/outline";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { useFundWallet } from "@privy-io/react-auth/solana";


// Type for user data
interface UserData {
  name: string;
  addresses: string[];
  email: string;
  avatar: string;
  joined: string;
  location: string;
  bio: string;
  website: string;
  twitter: string;
  x: string;
  instagram: string;
  telegram: string;
  facebook: string;
}


// Available profile tabs
const tabs = [
  { id: "account", name: "My Account", icon: UserIcon },
  { id: "orders", name: "Orders", icon: ShoppingBagIcon },
  { id: "wishlist", name: "Wishlist", icon: HeartIcon },
  { id: "payment", name: "Associated Wallets", icon: CreditCardIcon },
  { id: "addresses", name: "Addresses", icon: TruckIcon },
  { id: "selling", name: "My Products", icon: ShoppingBagIcon },
  { id: "notifications", name: "Notifications", icon: BellIcon },
  { id: "settings", name: "Settings", icon: CogIcon },
];

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
  const { ready, authenticated, user } = usePrivy()
  const [activeTab, setActiveTab] = useState("account");
  const [userData, setUserData] = useState<UserData>({
    name: "going",
    addresses: [],
    email: "going@example.com",
    avatar: "/goingLogo1.png",
    joined: "January 2023",
    location: "",
    bio: "",
    website: "",
    twitter: "",
    x: "",
    instagram: "",
    telegram: "",
    facebook: "",
  });

  const { login } = useLogin()
  const { logout } = useLogout()

  // Content to display based on the selected tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountTab userData={userData} setUserData={setUserData} />;
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
      case "selling":
        return <SellingTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <AccountTab userData={userData} setUserData={setUserData} />;
    }
  };

  useEffect(() => {
    if (ready && authenticated) {
      (async () => {
        try {
          const res = await fetch(`/api/users?_id=${user?.id.split("did:privy:")[1]}`)
          const resUserData = await res.json();
          if (res.ok) {
            setUserData((prev) => ({
              ...prev,
              ...resUserData
            }))
            return
          }

          // Fetch user data or perform any necessary actions
          const defaultUserData = {
            name: "unknown",
            addresses: [],
            email: "",
            avatar: "",
            joined: "",
            location: "",
            bio: "",
            website: "",
            twitter: "",
            x: "",
            instagram: "",
            telegram: "",
            facebook: "",
          }

          setUserData(defaultUserData)
          fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              _id: user?.id.split("did:privy:")[1],
              // addresses: user?.linkedAccounts?.filter((account) => account.type === "wallet").map((account) => account.address),
              name: user?.google?.name,
              email: user?.google?.email,
            })
          })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        } catch (error) {
          console.log(error)
        }

      })();
    }
  }, [ready, authenticated, user]);


  const handlerLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  }



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
                    src={userData.avatar || "/goingLogo1.png"}
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
                {
                  tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      disabled={!(ready && authenticated)}
                      className={
                        `
                          w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors 
                          ${activeTab === tab.id ? "bg-primary text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                          ${!(ready && authenticated) && "cursor-not-allowed"}
                        `
                      }
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  ))
                }
                {/* Logout Button */}
                {
                  !(ready && authenticated) ?
                    <button
                      className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={handlerLogin}
                    >
                      <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
                      <span>Log In</span>
                    </button>
                    :
                    <button
                      className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => logout()}
                    >
                      <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                      <span>Log Out</span>
                    </button>
                }
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
const AccountTab = ({ userData, setUserData }: { userData: UserData, setUserData: Dispatch<SetStateAction<UserData>> }) => {
  const { ready, authenticated, user, linkGoogle } = usePrivy();
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
      <form className="space-y-6">
        <div
          className="flex flex-col gap-8 items-center rounded-lg p-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(ready && authenticated) ? (e) => {

            e.preventDefault();
            const file = e.dataTransfer.files;
            if (file) {
              setUserData((prev) => ({
                ...prev,
                avatar: URL.createObjectURL(file[0]),
              }));
            }
          }
            : undefined
          }
        >
          <div className="relative h-24 w-24 rounded-full overflow-hidden">
            <Image
              src={userData.avatar || "/goingLogo1.png"}
              alt={userData.name}
              fill
              className="object-cover"
            />
          </div>
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUserData((prev) => ({
                    ...prev,
                    avatar: URL.createObjectURL(file),
                  }));
                }
              }}
              type="file"
              multiple
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
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

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              defaultValue={userData.location}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              defaultValue={userData.bio}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

        </div>

        {/* button login google */}
        {
          !user?.google &&
          <div className="flex justify-center">
            <button
              type="button"
              className="px-6 py-2 bg-white text-black rounded-lg font-medium transition-colors flex items-center space-x-2"
              onClick={linkGoogle}
            >
              <span>Sign in with Google</span>
            </button>
          </div>
        }



        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                id="website"
                placeholder="Enter your website URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="x" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                X
              </label>
              <input
                type="url"
                id="x"
                placeholder="Enter your X profile URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Facebook
              </label>
              <input
                type="url"
                id="facebook"
                placeholder="Enter your Facebook profile URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                placeholder="Enter your Instagram profile URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telegram
              </label>
              <input
                type="url"
                id="telegram"
                placeholder="Enter your Telegram profile URL"
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
  const { user, linkWallet, unlinkWallet } = usePrivy();
  const { fundWallet } = useFundWallet();

  const handlerFundWallet = async (address: string) => {
    await fundWallet(address,
      {
        cluster: { name: "devnet" },
        amount: "0.1",
      }
    );
  }
  return (
    <>
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Wallets</h3>
        <div className="flex justify-end mb-4">
          <button
            onClick={linkWallet}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg font-medium transition-colors"
          >
            + Connect Wallet
          </button>
        </div>
        {
          user?.linkedAccounts.map((account) => {
            if (account.type === "wallet") {
              return (
                <div key={account.address} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex text-gray-900 dark:text-white font-medium">
                        <Link href={`/wallet/${account.address}`} className="mr-2 hover:text-primary">
                          {account.address.slice(0, 6)}...{account.address.slice(-4)}
                        </Link>
                        <DocumentDuplicateIcon className="w-4 h-4 cursor-pointer" onClick={() => navigator.clipboard.writeText(account.address)} />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Connected</div>
                    </div>
                  </div>
                  <div className='flex flex-col items-end'>
                    {
                      account.connectorType !== "embedded" &&
                      <button onClick={() => unlinkWallet(account.address)} className="text-primary hover:text-primary-dark">
                        Unlinked Wallet
                      </button>
                    }
                    <button
                      onClick={() => handlerFundWallet(account.address)}
                      className="text-primary hover:text-primary-dark"
                    >
                      Funding Wallet
                    </button>
                  </div>
                </div>
              )
            }
            else {
              return null;
            }
          })
        }



      </div>

      {/* <div className="absolute h-screen w-screen backdrop-blur-md top-0 left-0">
          <div className="absolute -translate-1/2 top-1/2 left-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fund Wallet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Fund your wallet with SOL to start using our services.
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                value={dialogFoundWallet.address}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
              <button
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                onClick={() => }
              >
                Fund
              </button>

            </div>
          </div>
        </div> */}
    </>
  );
};

const AddressesTab = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Addresses</h2>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Saved Addresses</h3>
          <button className="px-6 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg font-medium transition-colors">
            + Add Address
          </button>
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
              <option value="ARS">ARS - Argentinian Peso</option>
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

const SellingTab = () => {
  const userProducts = [
    { id: "PROD-001", name: "Wireless Earbuds", price: 49.99, status: "Active" },
    { id: "PROD-002", name: "Gaming Mouse", price: 29.99, status: "Inactive" },
  ];

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
        {userProducts.map((product) => (
          <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
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

export default ProfilePage;