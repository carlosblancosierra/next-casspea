'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectAllFlavours } from '@/redux/features/flavour/flavourSlice';
import FlavourCard from '@/components/flavours/FlavourCard';
import Spinner from '@/components/common/Spinner';
import { Flavour } from '@/types/flavours';

export default function FlavoursPage() {
    const availableFlavours = useAppSelector(selectAllFlavours) as Flavour[];

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {availableFlavours.map((flavour: Flavour) => (
                        <FlavourCard
                            key={flavour.id}
                            flavour={flavour}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {availableFlavours.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                        No flavours available at the moment
                    </div>
                )}
            </div>
        </div>
    );
}
