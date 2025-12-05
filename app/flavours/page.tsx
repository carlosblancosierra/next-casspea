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
                <div className="text-primary-text dark:text-primary-text-light">Error:</div>
            </div>
        );
    }

    return (
        <div className="dark:bg-main-bg-dark min-h-screen my-4">
            <div className="max-w-7xl mx-auto px-0">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-text dark:text-primary-text-light">
                        Our Flavours
                    </h1>
                    <p className="mt-2 text-primary-text dark:text-primary-text-light">
                        Discover our delicious selection of handcrafted chocolates
                    </p>
                </div>

                {/* Flavours Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {flavours?.map((flavour: Flavour) => (
                        <FlavourCard
                            key={flavour.id}
                            flavour={flavour}
                            height="h-70"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
