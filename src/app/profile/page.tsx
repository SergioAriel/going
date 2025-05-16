"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import {
  UserIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
  CogIcon
} from "@heroicons/react/24/outline";
import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { useAlert } from "@/context/AlertContext";
import { useRouter, useSearchParams } from "next/navigation";
import { AccountTab } from "./AccountTab";
import { OrdersTab } from "./OrdersTab";
import { WishlistTab } from "./WishlistTab";
import { PaymentTab } from "./PaymentTab";
import { AddressesTab } from "./AddressesTab";
import { NotificationsTab } from "./NotificationsTab";
import { SettingsTab } from "./SettingsTab";
import { SellingTab } from "./SellingTab";
import { useUser } from "@/context/UserContext";

// Available profile tabs
const tabs = [
  { id: "account", name: "My Account", icon: UserIcon },
  { id: "orders", name: "Orders", icon: ShoppingBagIcon },
  // { id: "wishlist", name: "Wishlist", icon: HeartIcon },
  { id: "payment", name: "Associated Wallets", icon: CreditCardIcon },
  { id: "addresses", name: "Addresses", icon: TruckIcon },
  { id: "selling", name: "My Products", icon: ShoppingBagIcon },
  // { id: "notifications", name: "Notifications", icon: BellIcon },
  { id: "settings", name: "Settings", icon: CogIcon },
];

const ProfileContent = () => {
  const { ready, authenticated } = usePrivy()
  const { userData } = useUser()

  const { login } = useLogin()
  const { logout } = useLogout()
  const { handleAlert } = useAlert()
  // Content to display based on the selected tab
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParams = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState(tabParams || "settings");  

  useEffect(() => {
    if(!ready || !authenticated) {
      setActiveTab("settings")
      return
    } else {
      setActiveTab(tabParams || "account")
    }
    if (tabParams) {
      const tab = tabs.find((tab) => tab.id === tabParams);
      if (tab) {
        setActiveTab(tab.id);
        router.replace(`/profile`);
      }
    }
  }, [tabParams, ready, authenticated]);

  const renderTabContent = () => {
    const tabs = {
      account: <AccountTab />,
      orders: <OrdersTab />,
      wishlist: <WishlistTab />,
      payment: <PaymentTab />,
      addresses: <AddressesTab />,
      notifications: <NotificationsTab />,
      selling: <SellingTab />,
      settings: <SettingsTab />,
    };
    // Check if the active tab exists in the tabs object
    if (!tabs[activeTab as keyof typeof tabs]) {
      // If not, return the default tab content (e.g., AccountTab)
      return <AccountTab />;
    }

    return tabs[activeTab as keyof typeof tabs]
  };


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
              <div className="flex flex-wrap items-center w-full mb-6">
                <div className="h-16 w-16 rounded-full">
                  <Image
                    src={userData.avatar || "/logo.png"}
                    alt={userData.name}
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="w-full">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{userData.name}</h2>
                  <p className="w-full text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis">{userData.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                {
                  tabs.map((tab) => {

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          if (!userData.isSeller && tab.id === "addresses") {
                            handleAlert({
                              message: "Only Available to Sellers",
                              isError: true
                            })
                          }
                          setActiveTab(tab.id)
                        }}
                        disabled={(!(ready && authenticated)) && tab.id !== "settings"}
                        className={
                          `
                           w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors 
                          ${activeTab === tab.id ? "bg-primary text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                          ${(!(ready && authenticated) || (!userData.isSeller && tab.id === "addresses")) ? "cursor-not-allowed" : "cursor-pointer"}
                          ${tab.id === "settings" ? "cursor-pointer" : ""}
                        `
                        }
                      >
                        <tab.icon className="h-5 w-5" />
                        <span title="afasf">{tab.name}</span>
                      </button>
                    )
                  })
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

// Define a simple loading fallback component
function ProfilePageLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>
        <div className="flex flex-col md:flex-row gap-8">
           {/* Skeleton for Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
          {/* Skeleton for Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// The main page component that uses Suspense
export default function ProfilePageWrapper() {
  return (
    // Wrap the component that uses useSearchParams in Suspense
    <Suspense fallback={<ProfilePageLoading />}>
      <ProfileContent />
    </Suspense>
  );
}