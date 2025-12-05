import React, { useState, useEffect } from 'react';
import { FiPlus, FiMinus, FiTrash, FiX } from "react-icons/fi";
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';;
import { Flavour as FlavourType } from '@/types/flavours';
import Image from 'next/image';
import { CartItemBoxFlavorSelection } from '@/types/carts';
import Spinner from "@/components/common/Spinner";
import { toast } from 'react-toastify';

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
    availableFlavours?: FlavourType[];
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
    selectedAllergens,
    availableFlavours: propAvailableFlavours,
    ...rest
}) => {
    const { data: fetchedFlavours, isLoading, error } = useGetFlavoursQuery();
    const availableFlavours = propAvailableFlavours ?? fetchedFlavours;
    if (!propAvailableFlavours && isLoading) return <div className="flex items-center justify-center min-h-screen">
                <Spinner md />
            </div>;
    if (!propAvailableFlavours && error) return <div className="text-primary-text dark:text-primary-text-light">Error:</div>;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    // Function to filter out flavours that contain any selected allergens
    const getFilteredFlavours = () => {
        if (!availableFlavours) return [];
        if (selectedAllergens.length === 0) return availableFlavours;

        return availableFlavours.filter(flavour => {
            if (!flavour.allergens) return true;
            // Check if flavour's allergens intersect with selectedAllergens
            const flavourAllergenIds = flavour.allergens.map(allergen => allergen.id);
            return !flavourAllergenIds.some(id => selectedAllergens.includes(id));
        });
    };

    // Helper function to get quantity for a flavor
    const getFlavorQuantity = (flavorId: number) => {
        const existingFlavor = flavours.find(f => f.flavor.id === flavorId);
        return existingFlavor?.quantity || 0;
    };

    // Modified addFlavour to handle both increment and new additions
    const addFlavour = (flavour: FlavourType) => {
        const existingIndex = flavours.findIndex(f => f.flavor.id === flavour.id);
        if (existingIndex >= 0) {
            incrementQuantity(existingIndex);
        } else {
            if (remainingChocolates <= 0) {
                toast.error('All chocolates have been selected.');
                return;
            }
            handleAddFlavour(flavour);
        }
    };

    // Helper function to handle decrement
    const handleDecrement = (flavour: FlavourType) => {
        const existingIndex = flavours.findIndex(f => f.flavor.id === flavour.id);
        if (existingIndex >= 0) {
            decrementQuantity(existingIndex);
        }
    };

    return (
        <div className='rounded md:px-3'>
            {/* Selected Flavours List */}
            <div className="selected-flavours max-w-[400px]">
                {flavours.map((flavour, index) => (
                    <div key={flavour.flavor.id} className="flavour-item flex items-center mt-4">
                        <div className="flavour-info flex-grow text-left grid grid-cols-4">
                            <div className="col-span-1 pr-3">
                                {flavour.flavor.image && (
                                    <Image
                                        src={flavour.flavor.image || '/flavours/default.png'}
                                        alt={flavour.flavor.name}
                                        width={64}
                                        height={64}
                                        className='w-full h-auto rounded'
                                    />
                                )}
                            </div>
                            <div className='col-span-3 mt-1 mx-1 md:mx-4'>
                                <p className="font-bold text-xs md:text-sm dark:text-primary-text">{flavour.flavor.name}</p>
                            </div>
                        </div>
                        <div className="quantity-controls flex items-center">
                            <button
                                type="button"
                                onClick={() => handleDecrement(flavour.flavor)}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-main-bg-dark dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-s-lg p-3 h-11 focus:ring-2 focus:outline-none"
                            >
                                <FiMinus />
                            </button>
                            <input
                                type="text"
                                value={getFlavorQuantity(flavour.flavor.id)}
                                readOnly
                                className=" dark:bg-main-bg-dark border-x-0 border-gray-300 dark:border-gray-600 h-11 text-center text-primary-text dark:text-primary-text text-base block w-[3rem] py-2.5"
                            />
                            <button
                                type="button"
                                onClick={() => addFlavour(flavour.flavor)}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-main-bg-dark dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-e-lg p-3 h-11 focus:ring-2 focus:outline-none"
                            >
                                <FiPlus />
                            </button>
                            <button
                                type="button"
                                onClick={() => deleteFlavour(index)}
                                className="px-2 py-1 rounded focus:ring-2 focus:outline-none"
                            >
                                <FiTrash className="dark:text-primary-text" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Flavour Button */}
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={remainingChocolates <= 0}
                className={`mt-4 cursor-pointer group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium focus:outline-none
                ${remainingChocolates > 0
                        ? 'bg-primary-2 dark:bg-primary text-primary-text-light border-gray-300 dark:border-primary hover:bg-primary dark:hover:bg-primary'
                        : 'bg-main-bg dark:bg-main-bg-dark text-primary-text cursor-not-allowed border-gray-300 dark:border-gray-600'
                    }`}
            >
                {remainingChocolates > 0 ? 'Add Flavour' : 'All Flavours Selected'}
            </button>

            {/* Uncomment if you want to allow users to start over */}
            {/* <button
                type="button"
                onClick={handleDeleteAllFlavours}
                className="mt-4 py-4 flex items-center justify-center text-sm gap-2 text-primary-text dark:text-primary-text"
            >
                <FiRefreshCw />
                Start over
            </button> */}

            {/* Updated Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 dark:bg-main-bg-dark bg-opacity-50 dark:bg-opacity-80 flex items-center justify-center overflow-auto z-[100]"
                    onClick={handleModalClick}
                >
                    <div className="relative bg-main-bg dark:bg-main-bg-dark p-6 rounded-lg max-w-[90vw] w-full max-h-[85vh] mx-auto shadow-lg overflow-y-auto">
                        <h2 className="text-center text-sm font-semibold mb-1 text-primary-text dark:text-primary-text">Select a Flavour</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {getFilteredFlavours()?.map((flavour) => (
                                <div key={flavour.id} className="flavour-card border dark:border-gray-700 px-3 py-2 rounded-lg flex flex-col justify-between dark:bg-main-bg-dark">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-shrink-0 relative w-16 h-16">
                                            {flavour.image && (
                                                <Image
                                                    src={flavour.image || '/flavours/default.png'}
                                                    alt={flavour.name}
                                                    fill
                                                    sizes="64px"
                                                    className="object-contain rounded"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text text-sm">{flavour.name}</h3>
                                            <p className="text-[0.7rem] text-primary-text dark:text-primary-text text-xs leading-3 mt-1">{flavour.mini_description}</p>
                                            {flavour.allergens && flavour.allergens.length > 0 && (
                                                <p className="text-[8px] text-primary-text dark:text-primary-text-light md:text-xs mt-1">
                                                    {flavour.allergens.map((allergen, index, array) => (
                                                        <span key={allergen.id} className="mr-1">
                                                            {allergen.name}
                                                            {index < array.length - 1 ? ',' : '.'}
                                                        </span>
                                                    ))}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-center mt-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDecrement(flavour)}
                                            disabled={getFlavorQuantity(flavour.id) === 0}
                                            className={`py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-2
                                            ${getFlavorQuantity(flavour.id) > 0
                                                    ? 'bg-primary text-primary-text-light hover:bg-primary'
                                                    : 'bg-main-bg text-primary-text cursor-not-allowed'
                                                }`}
                                        >
                                            <FiMinus size={16} />
                                        </button>
                                        <span className="mx-4 text-sm text-primary-text dark:text-primary-text">
                                            {getFlavorQuantity(flavour.id)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => addFlavour(flavour)}
                                            disabled={remainingChocolates <= 0 && getFlavorQuantity(flavour.id) === 0}
                                            className={`py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-2
                                            ${remainingChocolates > 0 || getFlavorQuantity(flavour.id) > 0
                                                    ? 'bg-primary text-primary-text-light hover:bg-primary'
                                                    : 'bg-main-bg text-primary-text cursor-not-allowed'
                                                }`}
                                        >
                                            <FiPlus size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Close Modal Button */}
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-primary-text dark:text-primary-text hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
                            aria-label="Close Modal"
                        >
                            <FiX size={24} />
                        </button>

                        {/* Sticky footer for both mobile and desktop */}
                        <div className="fixed bottom-0 left-0 right-0 bg-main-bg dark:bg-main-bg-dark border-t dark:border-gray-700 p-4 shadow-lg">
                            <div className="max-w-[95vw] mx-auto space-y-3">
                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 dark:bg-main-bg-dark rounded-full h-2.5">
                                    <div
                                        className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${((maxChocolates - remainingChocolates) / maxChocolates) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Progress text */}
                                <div className="text-sm text-primary-text dark:text-primary-text text-center">
                                    {maxChocolates - remainingChocolates} of {maxChocolates} chocolates selected
                                </div>

                                {/* Done button */}
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full bg-primary text-primary-text-light py-3 rounded-lg hover:bg-primary transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>

                        {/* Adjust padding bottom for the sticky footer */}
                        <div className="h-32"></div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default FlavourPicker;
