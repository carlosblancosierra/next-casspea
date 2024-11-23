import React, { useState } from 'react';
import { FiPlus, FiMinus, FiTrash, FiRefreshCw } from "react-icons/fi";
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
}

const FlavourPicker: React.FC<FlavourPickerProps> = ({
    flavours,
    remainingChocolates,
    maxChocolates,
    handleAddFlavour,
    incrementQuantity,
    decrementQuantity,
    deleteFlavour,
    handleDeleteAllFlavours
}) => {
    const availableFlavours = useAppSelector(selectAllFlavours);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsModalOpen(false);
        }
    };

    const addFlavour = (flavour: FlavourType) => {
        handleAddFlavour(flavour);
        setIsModalOpen(false);
    }

    return (
        <div className='border rounded md:px-3 dark:border-gray-700'>
            <div className="selected-flavours">
                {flavours.map((flavour, index) => (
                    <div key={index} className="flavour-item flex items-center mt-4">
                        <div className="flavour-info flex-grow text-left grid grid-cols-4">
                            <div className="col-span-1">
                                <Image src={flavour.flavor.image || ''} alt={flavour.flavor.name} width={0} height={0} sizes="100vw" className='w-full h-auto' />
                            </div>
                            <div className='col-span-3 mt-1 mx-1 md:mx-3'>
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

            <button
                type="button"
                onClick={handleDeleteAllFlavours}
                className="mt-4 py-4 flex items-center justify-center text-sm gap-2 text-gray-700 dark:text-gray-300"
            >
                <FiRefreshCw />
                Start over
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-80 flex items-center justify-center overflow-auto z-50"
                    onClick={handleModalClick}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-[90vw] w-full max-h-[90vh] mx-auto shadow-lg overflow-y-auto">
                        <h2 className="text-center text-2xl font-semibold mb-6 dark:text-gray-300">Select a Flavour</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                            {availableFlavours.map((flavour) => (
                                <button
                                    key={flavour.name}
                                    onClick={() => addFlavour(flavour)}
                                    className="border dark:border-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 dark:bg-gray-800 dark:text-gray-300 hover:shadow-lg transition-shadow duration-200"
                                >
                                    <div className="flex-shrink-0 w-10 h-auto">
                                        <Image
                                            src={flavour.image || ''}
                                            alt={flavour.name}
                                            width={64}
                                            height={64}
                                            sizes="100vw"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 gap-1">
                                        <h3 className="text-lg font-semibold dark:text-gray-200 text-sm">{flavour.name}</h3>
                                        <p className="text-[0.7rem] text-gray-500 dark:text-gray-400 text-xs leading-3">{flavour.mini_description}</p>
                                        {/* <p className="text-[8px] text-gray-500 md:text-xs text-center">
                                            {flavour.allergens.map((allergen, index) => (
                                                <span key={index} className="mr-1">
                                                    {allergen.name},
                                                </span>
                                            ))}
                                        </p> */}
                                    </div>
                                    <FiPlus className="text-gray-500 dark:text-gray-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlavourPicker;
