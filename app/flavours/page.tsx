'use client';

import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';

import FlavourCard from '@/components/flavours/FlavourCard';
import Spinner from '@/components/common/Spinner';
import { Flavour } from '@/types/flavours';

export default function FlavoursPage() {
    const { data: flavours, isLoading, error } = useGetFlavoursQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner md />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Error:</div>
            </div>
        );
    }

    return (
        <div className=" dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto px-0">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Our Flavours
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Discover our delicious selection of handcrafted chocolates
                    </p>
                </div>

                {/* Flavours Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {flavours?.map((flavour: Flavour) => (
                        <FlavourCard
                            key={flavour.id}
                            flavour={flavour}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
