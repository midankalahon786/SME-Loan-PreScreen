import React from 'react';

// Basic building block
const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// 1. Loader for the Dashboard List
export const DashboardSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fake Navbar */}
            <div className="h-16 bg-blue-900 shadow-lg mb-8"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Fake Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>

                {/* Fake Cards */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-5 sm:px-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-24 mb-3" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-6 rounded-full self-center" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 2. Loader for the Application Details Page
export const DetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Fake Blue Header */}
            <div className="bg-blue-900 pt-8 pb-12 px-4 sm:px-8 shadow-lg mb-8">
                <div className="max-w-6xl mx-auto">
                    <Skeleton className="h-6 w-32 bg-blue-800 mb-4" />
                    <div className="flex justify-between items-start">
                        <div>
                            <Skeleton className="h-10 w-64 bg-blue-800 mb-2" />
                            <Skeleton className="h-5 w-96 bg-blue-800" />
                        </div>
                        <Skeleton className="h-12 w-32 bg-blue-800 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Fake Content Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Documents) */}
                <div className="lg:col-span-2 space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <Skeleton className="h-6 w-6" />
                                <Skeleton className="h-6 w-40" />
                            </div>
                            <div className="p-6 space-y-6">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="flex justify-between items-center">
                                        <div>
                                            <Skeleton className="h-5 w-48 mb-2" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                        <Skeleton className="h-10 w-28 rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column (Chat) */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md h-96 p-4 flex flex-col justify-between">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <Skeleton className="h-16 w-3/4 self-start rounded-tr-xl rounded-b-xl" />
                            <Skeleton className="h-12 w-2/3 self-end ml-auto rounded-tl-xl rounded-b-xl" />
                            <Skeleton className="h-16 w-3/4 self-start rounded-tr-xl rounded-b-xl" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};