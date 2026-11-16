import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiMinus, FiTrash, FiX } from "react-icons/fi";
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';;
import { Flavour as FlavourType } from '@/types/flavours';
import Image from 'next/image';
import { CartItemBoxFlavorSelection } from '@/types/carts';
import Spinner from "@/components/common/Spinner";
import { toast } from 'react-toastify';
import { buttonClasses } from '@/components/common/Button';

interface FlavourPickerProps {
    flavours: CartItemBoxFlavorSelection[];
    remainingChocolates: number;
    maxChocolates: number;
    handleAddFlavour: (flavour: FlavourType) => void;
    handleFlavourChange: (index: number, field: 'quantity', value: number) => void;
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
    handleFlavourChange,
    incrementQuantity,
    decrementQuantity,
    deleteFlavour,
    handleDeleteAllFlavours,
    selectedAllergens,
    availableFlavours: propAvailableFlavours,
    ...rest
}) => {
    const { data: fetchedFlavours, isLoading, error } = useGetFlavoursQuery();
    // Every hook must run before the early returns below, otherwise the hook
    // order changes once loading finishes and React throws.
    const [isModalOpen, setIsModalOpen] = useState(false);
    // "+5" on a flavour that is not in the box yet: the parent can only add it
    // with a quantity of 1, so remember the target and top it up once the new
    // row shows up in `flavours`.
    const pendingTopUp = useRef<{ id: number; quantity: number } | null>(null);
    useEffect(() => {
        const pending = pendingTopUp.current;
        if (!pending) return;
        const index = flavours.findIndex(f => f.flavor?.id === pending.id);
        if (index < 0) return;
        pendingTopUp.current = null;
        if (flavours[index].quantity < pending.quantity) {
            handleFlavourChange(index, 'quantity', pending.quantity);
        }
    }, [flavours, handleFlavourChange]);

    const availableFlavours = propAvailableFlavours ?? fetchedFlavours;
    if (!propAvailableFlavours && isLoading) return <div className="flex items-center justify-center min-h-screen">
                <Spinner md />
            </div>;
    if (!propAvailableFlavours && error) return <div className="text-primary-text dark:text-primary-text-light">Error:</div>;

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
        const existingFlavor = flavours.find(f => f.flavor?.id === flavorId);
        return existingFlavor?.quantity || 0;
    };

    // Modified addFlavour to handle both increment and new additions
    const addFlavour = (flavour: FlavourType) => {
        const existingIndex = flavours.findIndex(f => f.flavor?.id === flavour.id);
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

    // Adds up to `count` of a flavour in one tap. On the big boxes people were
    // tapping "+" ten times in a row for one flavour, which PostHog recorded as
    // rage clicks (101 in 30 days, nearly all on the 48 and 96 boxes).
    const addMany = (flavour: FlavourType, count: number) => {
        const amount = Math.min(count, remainingChocolates);
        if (amount <= 0) return;
        const existingIndex = flavours.findIndex(f => f.flavor?.id === flavour.id);
        if (existingIndex >= 0) {
            handleFlavourChange(existingIndex, 'quantity', flavours[existingIndex].quantity + amount);
            return;
        }
        handleAddFlavour(flavour);
        if (amount > 1) pendingTopUp.current = { id: flavour.id, quantity: amount };
    };

    const boxFull = remainingChocolates <= 0;
    // Only the big boxes get "+5": on a box of 9 it would fill half of it.
    const showAddFive = maxChocolates >= 24;

    // Helper function to handle decrement
    const handleDecrement = (flavour: FlavourType) => {
        const existingIndex = flavours.findIndex(f => f.flavor?.id === flavour.id);
        if (existingIndex >= 0) {
            decrementQuantity(existingIndex);
        }
    };

    return (
        <div className='rounded md:px-3 w-full'>
            {/* Selected Flavours List */}
            <div className="selected-flavours w-full max-w-full">
                {flavours.map((flavour, index) => {
                    const flavor = flavour.flavor;
                    if (!flavor) return null;
                    return (
                    <div key={flavor.id} className="flavour-item flex items-center mt-4 min-w-0">
                        <div className="flavour-info flex-grow min-w-0 text-left grid grid-cols-4">
                            <div className="col-span-1 pr-3">
                                {flavor.image && (
                                    <Image
                                        src={flavor.image || '/flavours/default.png'}
                                        alt={flavor.name}
                                        width={64}
                                        height={64}
                                        className='w-full h-auto rounded'
                                    />
                                )}
                            </div>
                            <div className='col-span-3 mt-1 mx-1 md:mx-4'>
                                <p className="font-bold text-xs md:text-sm dark:text-primary-text-light">{flavor.name}</p>
                            </div>
                        </div>
                        <div className="quantity-controls flex items-center">
                            <button
                                type="button"
                                onClick={() => handleDecrement(flavor)}
                                aria-label={`Remove one ${flavor.name}`}
                                className="touch-manipulation bg-gray-100 hover:bg-gray-200 dark:bg-main-bg-dark dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-s-lg p-3 h-11 focus:ring-2 focus:outline-none"
                            >
                                <FiMinus />
                            </button>
                            <input
                                type="text"
                                value={getFlavorQuantity(flavor.id)}
                                readOnly
                                className=" dark:bg-main-bg-dark border-x-0 border-gray-300 dark:border-gray-600 h-11 text-center text-primary-text dark:text-primary-text-light text-base block w-[3rem] py-2.5"
                            />
                            <button
                                type="button"
                                onClick={() => addFlavour(flavor)}
                                disabled={boxFull}
                                aria-label={`Add one ${flavor.name}`}
                                className="touch-manipulation bg-gray-100 hover:bg-gray-200 dark:bg-main-bg-dark dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-e-lg p-3 h-11 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FiPlus />
                            </button>
                            <button
                                type="button"
                                onClick={() => deleteFlavour(index)}
                                className="px-2 py-1 rounded focus:ring-2 focus:outline-none"
                            >
                                <FiTrash className="dark:text-primary-text-light" />
                            </button>
                        </div>
                    </div>
                    );
                })}
            </div>

            {/* Add Flavour Button */}
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={remainingChocolates <= 0}
                className={buttonClasses({ fullWidth: true, className: 'mt-4' })}
            >
                {remainingChocolates > 0 ? 'Add Flavour' : 'All Flavours Selected'}
            </button>

            {/* Uncomment if you want to allow users to start over */}
            {/* <button
                type="button"
                onClick={handleDeleteAllFlavours}
                className="mt-4 py-4 flex items-center justify-center text-sm gap-2 text-primary-text dark:text-primary-text-light"
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
                        <h2 className="text-center text-sm font-semibold mb-1 text-primary-text dark:text-primary-text-light">Select a Flavour</h2>
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
                                            <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light text-sm">{flavour.name}</h3>
                                            <p className="text-[0.7rem] text-primary-text dark:text-primary-text-light text-xs leading-3 mt-1">{flavour.mini_description}</p>
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
                                    <div className="flex items-center justify-center gap-3 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDecrement(flavour)}
                                            disabled={getFlavorQuantity(flavour.id) === 0}
                                            aria-label={`Remove one ${flavour.name}`}
                                            className={buttonClasses({ size: 'sm', className: 'touch-manipulation !px-4 !py-2' })}
                                        >
                                            <FiMinus size={16} />
                                        </button>
                                        <span className="min-w-[1.5rem] text-center text-sm tabular-nums text-primary-text dark:text-primary-text-light" aria-live="polite">
                                            {getFlavorQuantity(flavour.id)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => addFlavour(flavour)}
                                            disabled={boxFull}
                                            aria-label={`Add one ${flavour.name}`}
                                            className={buttonClasses({ size: 'sm', className: 'touch-manipulation !px-4 !py-2' })}
                                        >
                                            <FiPlus size={16} />
                                        </button>
                                        {showAddFive && (
                                            <button
                                                type="button"
                                                onClick={() => addMany(flavour, 5)}
                                                disabled={boxFull}
                                                aria-label={`Add ${Math.min(5, remainingChocolates) || 5} ${flavour.name}`}
                                                className={buttonClasses({ variant: 'secondary', size: 'sm', className: 'touch-manipulation !px-3 !py-2' })}
                                            >
                                                +{Math.min(5, remainingChocolates) || 5}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Close Modal Button */}
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-primary-text dark:text-primary-text-light hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
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

                                {/* Progress text. When the box is full the "+" buttons
                                    are disabled, and this says why. */}
                                <div className="text-sm text-primary-text dark:text-primary-text-light text-center" aria-live="polite">
                                    {boxFull
                                        ? `Your box is full: ${maxChocolates} of ${maxChocolates} chocolates. Tap Done to continue.`
                                        : `${maxChocolates - remainingChocolates} of ${maxChocolates} chocolates selected`}
                                </div>

                                {/* Done button */}
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className={buttonClasses({ fullWidth: true })}
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
