import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Product as ProductType } from '@/types/products';
import FlavourPicker from './FlavourPicker';
import ProgressBar from '@/components/common/ProgressBar';
import { Flavour as FlavourType } from '@/types/flavours';
import { CartItemBoxFlavorSelection, CartItemRequest } from '@/types/carts';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { useAddCartItemMutation, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice';

// Importing sub-components
import BoxSelection from './BoxSelection';
import AllergenSelection from './AllergenSelection';
import AddToCartButton from './AddToCartButton';
import SelectableProductCard from '@/components/store/SelectableProductCard';
import SelectableGiftCard from '@/components/store/SelectableGiftCard';
import GiftMessage from '@/components/cart/GiftMessage';

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
    // Pack-related state
    const [isPack, setIsPack] = useState<boolean>(false);
    const [chocolateBark, setChocolateBark] = useState<Product | null>(null);
    const [hotChocolate, setHotChocolate] = useState<Product | null>(null);
    const [giftCard, setGiftCard] = useState<Product | null>(null);
    const [giftMessage, setGiftMessage] = useState<string>('');

    const dispatch = useAppDispatch();
    const router = useRouter();
    const [addToCart, { isLoading }] = useAddCartItemMutation();
    const [updateCart] = useUpdateCartMutation();
    const { data: allProducts } = useGetActiveProductsQuery();

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
        // Basic validation for both box types
        if (!selection || !allergenOption) {
            return true;
        }

        // For Pick & Mix, ensure all chocolates are selected
        if (selection === 'PICK_AND_MIX') {
            if (flavours.length === 0 || remainingChocolates > 0) {
                return true;
            }
        }

        // For packs, all selections are optional since they can choose "No [item]"
        // The pack customization is handled in the UI but doesn't block add to cart

        return false;
    };

    const getProgressText = () => {
        if (remainingChocolates === 0) {
            return `You have selected all ${maxChocolates} chocolates.`;
        } else {
            return `You can select ${remainingChocolates} more chocolate(s).`;
        }
    };

    const handleAddToCart = async () => {
        try {
            let cartItemRequest: CartItemRequest;

            if (isPack) {
                // Pack customization
                cartItemRequest = {
                    product: product.id,
                    quantity: quantity,
                    pack_customization: {
                        selection_type: selection as 'PICK_AND_MIX' | 'RANDOM',
                        allergens: allergenOption === 'SPECIFY' ? selectedAllergens : [],
                        flavor_selections: selection === 'PICK_AND_MIX' ? flavours.map(f => ({
                            flavor: f.flavor.id,
                            quantity: f.quantity
                        })) : [],
                        chocolate_bark: chocolateBark?.id ?? null,
                        hot_chocolate: hotChocolate?.id ?? null,
                        gift_card: giftCard?.id ?? null
                    }
                };
            } else {
                // Regular box customization
                cartItemRequest = {
                    product: product.id,
                    quantity: quantity,
                    box_customization: {
                        selection_type: selection as 'PICK_AND_MIX' | 'RANDOM',
                        allergens: allergenOption === 'SPECIFY' ? selectedAllergens : [],
                        flavor_selections: selection === 'PICK_AND_MIX' ? flavours.map(f => ({
                            flavor: f.flavor.id,
                            quantity: f.quantity
                        })) : []
                    }
                };
            }

            // Handle gift message for packs
            if (isPack && giftMessage.trim() !== '') {
                await updateCart({ gift_message: giftMessage }).unwrap();
            }

            const response = await addToCart(cartItemRequest).unwrap();
            toast.success(isPack ? 'Pack added to cart successfully!' : 'Box added to cart successfully!');
            router.push('/cart');
        } catch (error) {
            toast.error('Failed to add item to cart');
            console.error('Add to cart error:', error);
        }
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
        }}>
            <div className="space-y-6 pb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Create your Signature Box</h2>
                <BoxSelection
                    options={prebulids}
                    selected={selection}
                    onChange={setSelection}
                />

                {selection === 'RANDOM' ? (
                    <>
                        <p className="text-sm dark:text-gray-200">
                            We will pick you {maxChocolates} amazing bonbons with your selected preferences.
                        </p>

                        <AllergenSelection
                            allergens={allergens}
                            selectedAllergens={selectedAllergens}
                            setSelectedAllergens={setSelectedAllergens}
                            allergenOption={allergenOption}
                            setAllergenOption={setAllergenOption}
                        />
                    </>
                ) : (
                    <>
                        <AllergenSelection
                            allergens={allergens}
                            selectedAllergens={selectedAllergens}
                            setSelectedAllergens={setSelectedAllergens}
                            allergenOption={allergenOption}
                            setAllergenOption={setAllergenOption}
                        />

                        {allergenOption && (
                            <>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">3- Pick your flavours</h3>
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
                    </>
                )}

                {/* Quantity Selection */}
                <div>
                    <label htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        3. Number of Boxes
                    </label>
                    <select
                        id="quantity"
                        name="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600
                            bg-main-bg dark:bg-transparent shadow-sm focus:border-primary-2
                            focus:ring-primary-2"
                    >
                        {Array.from({ length: 20 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>

                {/* Pack Option Toggle */}
                <div className="mt-4">
                    <div className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="pack-option"
                                checked={isPack}
                                onChange={(e) => {
                                    setIsPack(e.target.checked);
                                    // Reset pack selections when toggling off
                                    if (!e.target.checked) {
                                        setChocolateBark(null);
                                        setHotChocolate(null);
                                        setGiftCard(null);
                                        setGiftMessage('');
                                    }
                                }}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="pack-option" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer">
                                Upgrade to Indulgent Pack (+£10)
                            </label>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                            {isPack ? 'Pack Selected' : 'Box Only'}
                        </div>
                    </div>
                    {isPack && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Transform your signature box into a complete indulgent experience with chocolate bark, hot chocolate, and a personalized gift card.
                        </p>
                    )}
                </div>

                {/* Pack Customization Section */}
                {isPack && (
                    <div className="mt-6 space-y-6">
                        {/* Chocolate Bark Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Add Chocolate Bark</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {allProducts?.filter(p => p.category?.slug === 'chocolate-barks').map(p => (
                                    <SelectableProductCard
                                        key={p.id}
                                        product={p}
                                        price={0}
                                        selected={chocolateBark?.id === p.id}
                                        onSelect={() => setChocolateBark(p)}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setChocolateBark(null)}
                                className={`mt-4 px-4 py-2 text-sm rounded-md ${
                                    chocolateBark === null
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                No Chocolate Bark
                            </button>
                        </div>

                        {/* Hot Chocolate Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Add Hot Chocolate</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {allProducts?.filter(p => p.category?.slug === 'hot-chocolate').map(p => (
                                    <SelectableProductCard
                                        key={p.id}
                                        product={p}
                                        price={0}
                                        selected={hotChocolate?.id === p.id}
                                        onSelect={() => setHotChocolate(p)}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setHotChocolate(null)}
                                className={`mt-4 px-4 py-2 text-sm rounded-md ${
                                    hotChocolate === null
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                No Hot Chocolate
                            </button>
                        </div>

                        {/* Gift Card Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Add Gift Card</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {allProducts?.filter(p => p.category?.slug === 'gift-cards').map(p => (
                                    <SelectableGiftCard
                                        key={p.id}
                                        title={p.name}
                                        image={p.image || ''}
                                        selected={giftCard?.id === p.id}
                                        onSelect={() => setGiftCard(p)}
                                    />
                                ))}
                                <div
                                    onClick={() => setGiftCard(null)}
                                    className={`flex items-center justify-center p-6 border rounded cursor-pointer ${
                                        giftCard === null
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                    }`}
                                >
                                    No Gift Card
                                </div>
                            </div>
                            {giftCard && (
                                <div className="mt-4">
                                    <GiftMessage onGiftMessageChange={setGiftMessage} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Add to Cart Button */}
            <div className="sticky md:static bottom-[55px] md:bottom-auto bg-main-bg dark:bg-gray-900 pt-4 pb-6 px-4 -mx-4 border-t border-gray-200 dark:border-gray-700">
                <AddToCartButton
                    onClick={handleAddToCart}
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
