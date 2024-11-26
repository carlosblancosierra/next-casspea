import React, { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { toast } from 'react-toastify';
import { Product as ProductType } from '@/types/products';
import FlavourPicker from './FlavourPicker';
import ProgressBar from '@/components/common/ProgressBar';
import {
    Flavour as FlavourType,
} from '@/types/flavours';
import ProductConfirm from './ProductConfirm';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { CartItemBoxFlavorSelection } from '@/types/carts';
import { CartItemRequest } from '@/types/carts';
import { useAddCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import { addCartItem, setCart } from '@/redux/features/carts/cartSlice';

interface ProductInfoProps {
    product: ProductType;
}

const ProductFormBoxes: React.FC<ProductInfoProps> = ({ product }) => {
    const maxChocolates = product.units_per_box || 0;
    const [selection, setSelection] = useState('PICK');
    const [flavours, setFlavours] = useState<CartItemBoxFlavorSelection[]>([]);
    const [remainingChocolates, setRemainingChocolates] = useState(maxChocolates);
    const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
    const [quantity, setQuantity] = useState<number | 'more'>(1);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [addToCart, { isLoading }] = useAddCartItemMutation();

    const prebulids = [
        { name: 'Pick & Mix', value: 'PICK_AND_MIX' },
        { name: 'Surprise Me', value: 'RANDOM' },
    ];

    const allergens = [
        { name: 'Gluten', id: 2 },
        { name: 'Alcohol', id: 5 },
        { name: 'Nut', id: 6 },
    ];

    const handleAddFlavour = (flavour: FlavourType) => {
        if (remainingChocolates <= 0) return;
        const existingFlavourIndex = flavours.findIndex(f => f.flavor === flavour.id);
        if (existingFlavourIndex !== -1) {
            handleFlavourChange(existingFlavourIndex, 'quantity', flavours[existingFlavourIndex].quantity + 1);
        } else {
            const newFlavour: CartItemBoxFlavorSelection = {
                flavor: flavour.id,
                quantity: 1,
            };
            setFlavours([...flavours, newFlavour]);
            setRemainingChocolates(remainingChocolates - 1);
        }
    };

    const handleFlavourChange = (index: number, field: string, value: string | number) => {
        if (remainingChocolates <= 0) return;
        const newFlavours = [...flavours];
        newFlavours[index] = { ...newFlavours[index], [field]: value };
        setFlavours(newFlavours);

        const totalQuantity = newFlavours.reduce((acc, curr) => acc + curr.quantity, 0);
        setRemainingChocolates(maxChocolates - totalQuantity);
    };

    const incrementQuantity = (index: number) => {
        if (remainingChocolates > 0) {
            handleFlavourChange(index, 'quantity', flavours[index].quantity + 1);
        }
    };

    const decrementQuantity = (index: number) => {
        if (flavours[index].quantity > 0) {
            handleFlavourChange(index, 'quantity', flavours[index].quantity - 1);
        }
    };

    const deleteFlavour = (index: number) => {
        const newFlavours = flavours.filter((_, i) => i !== index);
        setFlavours(newFlavours);

        const totalQuantity = newFlavours.reduce((acc, curr) => acc + curr.quantity, 0);
        setRemainingChocolates(maxChocolates - totalQuantity);
    };

    const handleAllergenChange = (value: number) => {
        setSelectedAllergens((prev) =>
            prev.includes(value) ? prev.filter((allergen) => allergen !== value) : [...prev, value]
        );
    };

    const handleDeleteAllFlavours = () => {
        setFlavours([]);
        setRemainingChocolates(maxChocolates);
    }

    const allergenText = selectedAllergens.length
        ? ` that are ${selectedAllergens.map((allergen) => allergens.find((a) => a.id === allergen)?.name).join(' and ')} Free`
        : '';

    const handleAddToCart = async () => {
        const cartItem: CartItemRequest = {
            product: product.id,
            quantity: quantity === 'more' ? 200 : quantity,
            box_customization: {
                selection_type: selection === 'RANDOM' ? 'RANDOM' : 'PICK_AND_MIX',
                allergens: selectedAllergens,
                flavor_selections: selection === 'RANDOM' ? [] : flavours.map(flavour => ({
                    flavor: flavour.flavor,
                    quantity: flavour.quantity,
                })),
            },
        };

        try {
            console.log("adding to cart", cartItem);
            const response = await addToCart(cartItem).unwrap();
            console.log("response", response);
            dispatch(setCart(response));
            toast.success(`${product.name} added to cart!`);
            setTimeout(() => {
                router.push('/cart');
            }, 1000);
        } catch (error) {
            toast.error('Failed to add to cart. Please try again.');
        }
    };

    const getProgressText = () => {
        if (remainingChocolates === maxChocolates) {
            return `Please select your ${maxChocolates} bonbons.`;
        } else if (remainingChocolates === 0) {
            return `Congratulations, you have selected all ${maxChocolates} bonbons.`;
        } else {
            return `You have selected ${maxChocolates - remainingChocolates} out of ${maxChocolates} bonbons.`;
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setQuantity(parseInt(value, 10));
    };

    return (
        <form>
            <p className="text-sm dark:text-gray-200">Flavour Build:</p>
            <fieldset aria-label="Choose a size" className="mt-4">
                <RadioGroup
                    value={selection}
                    onChange={setSelection}
                    className="grid grid-cols-2 gap-4"
                >
                    {prebulids.map((obj) => (
                        <RadioGroup.Option
                            key={obj.name}
                            value={obj.value}
                            className={({ checked }) =>
                                `cursor-pointer bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none ${checked ? 'ring-2 ring-indigo-500 border-indigo-500' : ''
                                }`
                            }
                        >
                            <span>{obj.name}</span>
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
                            />
                        </RadioGroup.Option>
                    ))}
                </RadioGroup>
            </fieldset>

            <p className="mt-6 text-sm dark:text-gray-200">Select allergens</p>
            <fieldset aria-label="Choose allergens" className="mt-4">
                {allergens.map((obj) => (
                    <div key={obj.id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={obj.id.toString()}
                            name={`${obj.id} Free`}
                            value={obj.id}
                            className="mr-2 rounded dark:bg-gray-800 dark:text-gray-300"
                            onChange={() => handleAllergenChange(obj.id)}
                        />
                        <label htmlFor={obj.id.toString()} className="text-xs my-1 text-gray-700 dark:text-gray-300">{`${obj.name} Free`}</label>
                    </div>
                ))}
            </fieldset>

            {selection === 'RANDOM' ? (
                <p className="mt-6 dark:text-gray-200">We will pick you {maxChocolates} amazing bonbons{allergenText}.</p>
            ) : (
                <>
                    <p className="mt-6 text-sm dark:text-gray-200">Flavours</p>
                    <FlavourPicker
                        flavours={flavours}
                        maxChocolates={maxChocolates}
                        remainingChocolates={remainingChocolates}
                        handleAddFlavour={handleAddFlavour}
                        handleFlavourChange={handleFlavourChange}
                        incrementQuantity={incrementQuantity}
                        decrementQuantity={decrementQuantity}
                        deleteFlavour={deleteFlavour}
                        handleDeleteAllFlavours={handleDeleteAllFlavours}
                    />
                </>
            )}
            {selection === 'PICK' && (
                <div className="mt-4">
                    <p className="text-sm mb-1 dark:text-gray-200">{getProgressText()}</p>
                    <ProgressBar value={maxChocolates - remainingChocolates} max={maxChocolates} />
                </div>

            )}

            <div className="mt-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Number of Boxes
                </label>
                <select
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
            </div>

            {/* <ProductConfirm
                flavours={selection === 'PICK_AND_MIX' ? flavours : []}
                isVisible={isPopupVisible}
                onClose={handleClosePopup}
                totalChocolates={maxChocolates}
                selection={selection}
                selectedAllergens={selectedAllergens}
            /> */}

            <button
                type="button"
                onClick={handleAddToCart}
                disabled={isLoading}
                className={`mt-8 w-full py-3 rounded flex items-center justify-center text-sm gap-2 ${isLoading
                    ? 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-500 text-white dark:bg-indigo-600 cursor-pointer'
                    }`}
            >
                {isLoading ? 'Adding...' : 'Add to Cart'}
            </button>
        </form>
    );
};

export default ProductFormBoxes;
