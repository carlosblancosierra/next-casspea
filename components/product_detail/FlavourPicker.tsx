import React, { useState } from 'react';
import { FiPlus, FiMinus, FiTrash, FiRefreshCw, FiX } from "react-icons/fi";
import { selectAllFlavours } from '@/redux/features/flavour/flavourSlice';
import { useAppSelector } from '@/redux/hooks';
import { Flavour as FlavourType } from '@/types/flavours';
import Image from 'next/image';
import { CartItemBoxFlavorSelection } from '@/types/carts';

interface FlavourPickerProps {
    flavours: CartItemBoxFlavorSelection[];
    remainingChocolates: number;
    maxChocolates: number;
    handleAddFlavour: (flavour: FlavourType) => void;
    handleFlavourChange: (index: number, field: string, value: string | number) => void;
    incrementQuantity: (index: number) => void;
    decrementQuantity: (index: number) => void;
    deleteFlavour: (index: number) => void;
    handleDeleteAllFlavours: () => void;
    selectedAllergens: number[];
}

const FlavourPicker: React.FC<FlavourPickerProps> = ({
    flavours,
    remainingChocolates,
    maxChocolates,
    handleAddFlavour,
    incrementQuantity,
    decrementQuantity,
    deleteFlavour,
    handleDeleteAllFlavours,
    selectedAllergens
}) => {
    const availableFlavours = useAppSelector(selectAllFlavours);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    // Function to filter out flavours that contain any selected allergens
    const getFilteredFlavours = () => {
        if (selectedAllergens.length === 0) return availableFlavours;

        return availableFlavours.filter(flavour => {
            if (!flavour.allergens) return true;
            // Check if flavour's allergens intersect with selectedAllergens
            const flavourAllergenIds = flavour.allergens.map(allergen => allergen.id);
            return !flavourAllergenIds.some(id => selectedAllergens.includes(id));
        });
    };

    const addFlavour = (flavour: FlavourType) => {
        handleAddFlavour(flavour);
        setIsModalOpen(false);
    }

    return (
        <div className='rounded md:px-3'>
            <div className="selected-flavours">
                {flavours.map((flavour, index) => (
                    <div key={flavour.flavor.id} className="flavour-item flex items-center mt-4">
                        <div className="flavour-info flex-grow text-left grid grid-cols-4">
                            <div className="col-span-1 pr-3">
                                {flavour.flavor.image && (
                                    <Image
                                        src={flavour.flavor.image || '/flavours/default.png'}
                                        alt={flavour.flavor.name}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className='w-full h-auto'
                                    />
                                )}
                            </div>
                            <div className='col-span-3 mt-1 mx-1 md:mx-4'>
                                <p className="font-bold text-xs md:text-sm dark:text-gray-200">{flavour.flavor.name}</p>
                            </div>
                        </div>
                        <div className="quantity-controls flex items-center">
                            <button
                                type="button"
                                onClick={() => decrementQuantity(index)}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-s-lg p-3 h-11 focus:ring-2 focus:outline-none"
                            >
                                <FiMinus />
                            </button>
                            <input
                                type="text"
                                value={flavour.quantity}
                                readOnly
                                className="bg-gray-50 dark:bg-gray-800 border-x-0 border-gray-300 dark:border-gray-600 h-11 text-center text-gray-900 dark:text-gray-300 text-sm block w-[3rem] py-2.5"
                            />
                            <button
                                type="button"
                                onClick={() => incrementQuantity(index)}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-e-lg p-3 h-11 focus:ring-2 focus:outline-none"
                            >
                                <FiPlus />
                            </button>
                            <button
                                type="button"
                                onClick={() => deleteFlavour(index)}
                                className="px-2 py-1 rounded focus:ring-2 focus:outline-none"
                            >
                                <FiTrash className="dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={remainingChocolates <= 0}
                className={`mt-4 cursor-pointer group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium focus:outline-none
                ${remainingChocolates > 0
                        ? 'bg-indigo-500 dark:bg-indigo-600 text-white border-gray-300 dark:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600'
                    }`}
            >
                {remainingChocolates > 0 ? 'Add Flavour' : 'All Flavours Selected'}
            </button>

            {/* <button
                type="button"
                onClick={handleDeleteAllFlavours}
                className="mt-4 py-4 flex items-center justify-center text-sm gap-2 text-gray-700 dark:text-gray-300"
            >
                <FiRefreshCw />
                Start over
            </button> */}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-80 flex items-center justify-center overflow-auto z-[100]"
                    onClick={handleModalClick}>
                    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg max-w-[90vw] w-full max-h-[85vh] mx-auto shadow-lg overflow-y-auto">
                        <h2 className="text-center text-sm font-semibold mb-1 dark:text-gray-300">Select a Flavour</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                            {getFilteredFlavours().map((flavour) => (
                                <button
                                    key={flavour.name}
                                    onClick={() => addFlavour(flavour)}
                                    className="border dark:border-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 dark:bg-gray-800 dark:text-gray-300 hover:shadow-lg transition-shadow duration-200"
                                >
                                    <div className="flex-shrink-0 relative w-16 h-16">
                                        {flavour.image && (
                                            <Image
                                                src={flavour.image || '/flavours/default.png'}
                                                alt={flavour.name}
                                                fill
                                                sizes="64px" // Adjust based on desired size
                                                className="object-contain rounded"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 gap-1">
                                        <h3 className="text-lg font-semibold dark:text-gray-200 text-sm">{flavour.name}</h3>
                                        <p className="text-[0.7rem] text-gray-500 dark:text-gray-400 text-xs leading-3">{flavour.mini_description}</p>
                                        {flavour.allergens && flavour.allergens.length > 0 && (
                                            <p className="text-[8px] text-gray-500 md:text-xs text-center mt-1">
                                                {flavour.allergens.map((allergen, index, array) => (
                                                    <span key={allergen.id} className="mr-1">
                                                        {allergen.name}
                                                        {index < array.length - 1 ? ',' : '.'}
                                                    </span>
                                                ))}
                                            </p>
                                        )}
                                    </div>
                                    <FiPlus className="text-gray-500 dark:text-gray-400" />
                                </button>
                            ))}
                        </div>

                        {/* Close Modal Button */}
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none"
                            aria-label="Close Modal"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlavourPicker;
