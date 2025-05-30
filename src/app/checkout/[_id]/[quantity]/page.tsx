import { getOneProduct } from "@/lib/ServerActions/products";
import { Suspense } from "react";
import CheckoutPage from "../..";


export default async function DirectCheckout ({params}: { params: Promise<{_id: string, quantity: string}> }) {
    const {_id, quantity} = await params
    const product = await getOneProduct(_id)

    if(!product) throw new Error("Not Found Product")

        
    return (
        <Suspense
            fallback={<PageLoading/>}
         >
            <CheckoutPage items={[{...product, quantity: Number(quantity)}]}/>
        </Suspense>
    )
} 

const PageLoading = () => {
    // Skeleton line component
    const SkeletonLine = ({ width = "w-full", height = "h-4", className = "" }) => (
        <div
            className={`bg-gray-200 dark:bg-gray-700 rounded ${width} ${height} animate-pulse ${className}`}
        />
    );

    // Skeleton circle
    const SkeletonCircle = ({ size = "w-10 h-10", className = "" }) => (
        <div
            className={`bg-gray-200 dark:bg-gray-700 rounded-full ${size} animate-pulse ${className}`}
        />
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-10">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Progress indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center">
                                <SkeletonCircle />
                                <SkeletonLine width="w-16" height="h-3" className="ml-2 hidden sm:block" />
                            </div>
                            <div className="w-16 sm:w-24 h-1 mx-2 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="flex items-center">
                                <SkeletonCircle />
                                <SkeletonLine width="w-16" height="h-3" className="ml-2 hidden sm:block" />
                            </div>
                            <div className="w-16 sm:w-24 h-1 mx-2 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="flex items-center">
                                <SkeletonCircle />
                                <SkeletonLine width="w-24" height="h-3" className="ml-2 hidden sm:block" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main content */}
                        <div className="lg:w-2/3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                                <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                                    <SkeletonLine width="w-40" height="h-6" />
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Form skeleton */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <SkeletonLine width="w-full" height="h-4" className="md:col-span-2" />
                                        <SkeletonLine width="w-full" height="h-10" className="md:col-span-2" />
                                        <SkeletonLine width="w-full" height="h-4" />
                                        <SkeletonLine width="w-full" height="h-4" />
                                        <SkeletonLine width="w-full" height="h-4" />
                                        <SkeletonLine width="w-full" height="h-4" />
                                        <SkeletonLine width="w-full" height="h-4" className="md:col-span-2" />
                                        <SkeletonLine width="w-full" height="h-4" className="md:col-span-2" />
                                    </div>
                                    <div className="mt-8 flex justify-between">
                                        <SkeletonLine width="w-32" height="h-10" />
                                        <SkeletonLine width="w-48" height="h-10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <SkeletonLine width="w-32" height="h-6" />
                                </div>
                                <div className="p-6">
                                    <div className="mb-6">
                                        <div className="max-h-64 overflow-y-auto">
                                            <div className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                                <div className="ml-4 flex-1">
                                                    <SkeletonLine width="w-24" height="h-4" />
                                                    <SkeletonLine width="w-16" height="h-3" className="mt-2" />
                                                </div>
                                                <SkeletonLine width="w-20" height="h-4" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <SkeletonLine width="w-16" height="h-3" />
                                            <SkeletonLine width="w-10" height="h-3" />
                                        </div>
                                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between">
                                                <SkeletonLine width="w-16" height="h-4" />
                                                <SkeletonLine width="w-20" height="h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Shipping address skeleton */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-6">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <SkeletonLine width="w-32" height="h-4" />
                                        <SkeletonLine width="w-12" height="h-3" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-2">
                                    <SkeletonLine width="w-24" height="h-4" />
                                    <SkeletonLine width="w-32" height="h-3" />
                                    <SkeletonLine width="w-40" height="h-3" />
                                    <SkeletonLine width="w-32" height="h-3" />
                                    <SkeletonLine width="w-24" height="h-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
