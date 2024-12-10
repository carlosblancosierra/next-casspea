import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Product as ProductType } from '@/types/products';
import FlavourPicker from './FlavourPicker';
import ProgressBar from '@/components/common/ProgressBar';
import { Flavour as FlavourType } from '@/types/flavours';
import { CartItemBoxFlavorSelection, CartItemRequest } from '@/types/carts';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { useAddCartItemMutation } from '@/redux/features/carts/cartApiSlice';

// Importing sub-components
import BoxSelection from './BoxSelection';
import AllergenSelection from './AllergenSelection';
import AddToCartButton from './AddToCartButton';

interface ProductInfoProps {
    product: ProductType;
}

const ProductFormBoxes: React.FC<ProductInfoProps> = ({ product }) => {
    const maxChocolates = product.units_per_box || 0;
    const [selection, setSelection] = useState<string | null>(null);
    const [flavours, setFlavours] = useState<CartItemBoxFlavorSelection[]>([]);
    const [remainingChocolates, setRemainingChocolates] = useState<number>(maxChocolates);
    const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
    const [allergenOption, setAllergenOption] = useState<'NONE' | 'SPECIFY' | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [addToCart, { isLoading }] = useAddCartItemMutation();

    const prebulids = [
        {
            name: 'Pick & Mix',
            value: 'PICK_AND_MIX',
            description: 'Choose your own flavours and create your perfect box'
        },
        {
            name: 'Surprise Me',
            value: 'RANDOM',
            description: 'Let us surprise you with our best selection'
        },
    ];

    const allergens = [
        { name: 'Gluten', id: 2 },
        { name: 'Alcohol', id: 5 },
        { name: 'Nut', id: 6 },
        // Add more allergens as needed
    ];

    const handleAddFlavour = (flavour: FlavourType) => {
        if (remainingChocolates <= 0) {
            toast.error('Not enough remaining chocolates for this selection.');
            return;
        }
        const existingFlavourIndex = flavours.findIndex(f => f.flavor.id === flavour.id);
        if (existingFlavourIndex !== -1) {
            handleFlavourChange(existingFlavourIndex, 'quantity', flavours[existingFlavourIndex].quantity + 1);
        } else {
            const newFlavour: CartItemBoxFlavorSelection = {
                flavor: flavour,
                quantity: 1,
            };
            setFlavours([...flavours, newFlavour]);
            setRemainingChocolates(prev => prev - 1);
        }
    };

    const handleFlavourChange = (index: number, field: string, value: string | number) => {
        const newFlavours = [...flavours];
        newFlavours[index] = { ...newFlavours[index], [field]: value };
        setFlavours(newFlavours);

        if (field === 'quantity') {
            setRemainingChocolates(prev => prev + flavours[index].quantity - Number(value));
        }
    };

    const incrementQuantity = (index: number) => {
        if (remainingChocolates <= 0) {
            toast.error('No more chocolates remaining.');
            return;
        }
        handleFlavourChange(index, 'quantity', flavours[index].quantity + 1);
    };

    const decrementQuantity = (index: number) => {
        if (flavours[index].quantity <= 1) {
            deleteFlavour(index);
            return;
        }
        handleFlavourChange(index, 'quantity', flavours[index].quantity - 1);
    };

    const deleteFlavour = (index: number) => {
        const removedQuantity = flavours[index].quantity;
        const newFlavours = flavours.filter((_, i) => i !== index);
        setFlavours(newFlavours);
        setRemainingChocolates(prev => prev + removedQuantity);
    };

    const handleDeleteAllFlavours = () => {
        const totalSelected = flavours.reduce((acc, curr) => acc + curr.quantity, 0);
        setFlavours([]);
        setRemainingChocolates(totalSelected + remainingChocolates);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuantity(Number(e.target.value));
    };

    const isAddToCartDisabled = () => {
        return flavours.length === 0 || remainingChocolates > 0;
    };

    const getProgressText = () => {
        if (remainingChocolates === 0) {
            return `You have selected all ${maxChocolates} chocolates.`;
        } else {
            return `You can select ${remainingChocolates} more chocolate(s).`;
        }
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission logic here
        }}>
            <div className="space-y-6">
                {/* Box Selection */}
                <BoxSelection
                    options={prebulids}
                    selected={selection}
                    onChange={setSelection}
                />

                {/* Conditionally render based on selection */}
                {selection === 'RANDOM' ? (
                    <p className="text-sm dark:text-gray-200">
                        We will pick you {maxChocolates} amazing bonbons with your selected preferences.
                    </p>
                ) : (
                    <>
                        <div>
                            <p className="text-sm dark:text-gray-200">Pick your flavours</p>
                            {/* Render FlavourPicker */}
                            <FlavourPicker
                                flavours={flavours}
                                remainingChocolates={remainingChocolates}
                                maxChocolates={maxChocolates}
                                handleAddFlavour={handleAddFlavour}
                                handleFlavourChange={handleFlavourChange}
                                incrementQuantity={incrementQuantity}
                                decrementQuantity={decrementQuantity}
                                deleteFlavour={deleteFlavour}
                                handleDeleteAllFlavours={handleDeleteAllFlavours}
                                selectedAllergens={selectedAllergens}
                            />
                        </div>

                        <div>
                            <p className="text-sm mb-1 dark:text-gray-200">{getProgressText()}</p>
                            <ProgressBar
                                value={maxChocolates - remainingChocolates}
                                max={maxChocolates}
                            />
                        </div>
                    </>
                )}

                {/* Allergen Selection */}
                <AllergenSelection
                    allergens={allergens}
                    selectedAllergens={selectedAllergens}
                    setSelectedAllergens={setSelectedAllergens}
                    allergenOption={allergenOption}
                    setAllergenOption={setAllergenOption}
                />

                {/* Quantity Selection */}
                <div>
                    <label htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Number of Boxes
                    </label>
                    <select
                        id="quantity"
                        name="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500
                            focus:ring-indigo-500"
                    >
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-6 px-4 -mx-4
                border-t border-gray-200 dark:border-gray-700">
                <AddToCartButton
                    onClick={() => {
                        // Handle adding to cart logic here
                        // Example:
                        // addToCart({ productId: product.id, flavours, quantity });
                    }}
                    isLoading={isLoading}
                    isDisabled={isAddToCartDisabled()}
                    selection={selection}
                    remainingChocolates={remainingChocolates}
                />
            </div>
        </form>
    );

};

export default ProductFormBoxes;
