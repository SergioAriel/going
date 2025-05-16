// app/profile/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react"; // Import Suspense
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

// Create a component that uses useSearchParams and will be wrapped
function ProfileContent() {
  const { ready, authenticated } = usePrivy();
  const { userData } = useUser();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { handleAlert } = useAlert();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParams = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabParams || "settings");

  useEffect(() => {
    if (!ready || !authenticated) {
      setActiveTab("settings");
      // Optional: redirect if not authenticated and trying to access a protected tab
      // if (tabParams && tabParams !== "settings") {
      //   router.replace('/profile?tab=settings');
      // }
      return;
    } else {
       // Only update if tabParams exists or if activeTab is still "settings" and authenticated
       if (tabParams) {
         setActiveTab(tabParams);
       } else if (activeTab === "settings") {
         setActiveTab("account"); // Default to account if authenticated and no tab param
       }
    }
     // This effect should primarily react to tabParams changes
     if (tabParams) {
        const tab = tabs.find((tab) => tab.id === tabParams);
        if (tab) {
          setActiveTab(tab.id);
          // Avoid replacing the history entry if the tab is already active
          // router.replace(`/profile?tab=${tabParams}`); // Or use push if you want history entries
        } else {
           // Handle invalid tab param, e.g., redirect to default or show error
           setActiveTab("account"); // Default to account for invalid tab
           router.replace('/profile?tab=account');
        }
     }


  }, [tabParams, ready, authenticated, router, activeTab]); // Include activeTab as dependency if it can change independently


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
                    src={userData?.avatar || "/logo.png"} // Use optional chaining in case userData is null initially
                    alt={userData?.name || "User"} // Use default alt text
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="w-full">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.name || "Guest"}</h2> {/* Default name */}
                  <p className="w-full text-sm text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis">{userData?.email || "N/A"}</p> {/* Default email */}
                </div>
              </div>

              <div className="space-y-1">
                {
                  tabs.map((tab) => {
                    const isDisabled = !(ready && authenticated) && tab.id !== "settings";
                    const isSellerRestricted = !userData?.isSeller && tab.id === "selling"; // Corrected tab id for selling
                    const cursorClass = isDisabled || isSellerRestricted ? "cursor-not-allowed" : "cursor-pointer";

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          if (isSellerRestricted) {
                            handleAlert({
                              message: "Only Available to Sellers",
                              isError: true
                            });
                          } else {
                            setActiveTab(tab.id);
                            // Update URL without full page reload
                            router.replace(`/profile?tab=${tab.id}`);
                          }
                        }}
                        disabled={isDisabled || isSellerRestricted}
                        className={`
                           w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                          ${activeTab === tab.id ? "bg-primary text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                          ${cursorClass}
                        `}
                      >
                        <tab.icon className="h-5 w-5" />
                        <span>{tab.name}</span>
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
}

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