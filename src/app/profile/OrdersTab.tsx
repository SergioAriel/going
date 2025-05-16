import { useUser } from "@/context/UserContext";
import { Order } from "@/interfaces";
import { getOrders } from "@/lib/ServerActions/orders";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export const OrdersTab = () => {
  const { userData } = useUser()
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    (async () => {
      const orders = await getOrders({ sellers: userData?._id })
      console.log(userData, orders)
      setOrders(orders)
    })()

  }, [userData])


  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Orders</h2>

      <div className="space-y-6">
        {
        orders.map((order) => (
          <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white font-medium">Order {order._id}</span>
                  <span className="mx-2 text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{order.date.getDate()}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2
                  ${order.status === "delivered"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : order.status === "in_transit"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center">
                <span className="text-gray-900 dark:text-white font-medium">
                  ${order.totalPrice.toFixed(2)}
                </span>
                <Link href={`/orders/${order._id}`} className="ml-4 text-primary hover:text-primary-dark flex items-center">
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