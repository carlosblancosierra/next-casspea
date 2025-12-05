import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Product as ProductType, Product } from '@/types/products';
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
// Pack-related imports
import SelectableProductCard from '@/components/store/SelectableProductCard';
import SelectableGiftCard from '@/components/store/SelectableGiftCard';
import GiftMessage from '@/components/cart/GiftMessage';
import { ID_MAP } from '@/components/packs/constants';

interface ProductInfoProps {
    product: ProductType;
}

const ProductFormBoxes: React.FC<ProductInfoProps> = ({ product }) => {
    const maxChocolates = product.units_per_box || 0;
    const [currentStep, setCurrentStep] = useState<number>(1);

    // Step 1: Selection type
    const [selection, setSelection] = useState<string | null>(null);

    // Step 2: Allergens
    const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
    const [allergenOption, setAllergenOption] = useState<'NONE' | 'SPECIFY' | null>(null);

    // Step 3: Flavours (only for PICK_AND_MIX)
    const [flavours, setFlavours] = useState<CartItemBoxFlavorSelection[]>([]);
    const [remainingChocolates, setRemainingChocolates] = useState<number>(maxChocolates);

    // Final options
    const [quantity, setQuantity] = useState<number>(1);
    // Pack-related state
    const [isPack, setIsPack] = useState<boolean>(false);
    const [showUpgradePopup, setShowUpgradePopup] = useState<boolean>(false);
    const [chocolateBark, setChocolateBark] = useState<Product | null>(null);
    const [hotChocolate, setHotChocolate] = useState<Product | null>(null);
    const [giftCard, setGiftCard] = useState<Product | null>(null);
    const [giftMessage, setGiftMessage] = useState<string>('');
    const [showGiftMessagePopup, setShowGiftMessagePopup] = useState<boolean>(false);

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

    // Step navigation helpers
    const canProceedToStep2 = () => selection !== null;
    const canProceedToStep3 = () => selection !== null && allergenOption !== null;
    const canProceedToNextStep = () => {
        if (!canProceedToStep3()) return false;

        // Check basic selection requirements
        if (selection === 'PICK_AND_MIX') {
            if (flavours.length === 0 || remainingChocolates > 0 || !flavours.every(f => f.flavor?.id)) {
                return false;
            }
        }

        return true;
    };
    const canAddToCart = () => {
        if (!canProceedToNextStep()) return false;

        // If pack is selected, check that hot chocolate and chocolate bark are selected
        // Gift card is optional
        if (isPack) {
            return hotChocolate !== null && chocolateBark !== null;
        }

        return true;
    };

    // Pack pricing based on box size
    const getPackPrice = () => {
        const units = product.units_per_box || 0;
        switch (units) {
            case 9: return 11;
            case 15: return 8;
            case 24: return 8;
            case 48: return 5;
            default: return 10; // fallback
        }
    };

    // Dynamic step calculation
    const getTotalSteps = () => isPack ? 6 : 3;
    const isPackStep = (step: number) => isPack && step > 3;

    const handleNextStep = () => {
        if (currentStep === 1 && canProceedToStep2()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && canProceedToStep3()) {
            setCurrentStep(3);
        } else if (currentStep === 3 && isPack) {
            setCurrentStep(4);
        } else if (currentStep === 4 && hotChocolate !== null) {
            setCurrentStep(5);
        } else if (currentStep === 5 && chocolateBark !== null) {
            setCurrentStep(6);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Step indicator component
    const StepIndicator = () => {
        const totalSteps = getTotalSteps();
        return (
            <div className="flex items-center justify-center mb-8">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <React.Fragment key={step}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition-colors ${
                            step <= currentStep
                                ? 'bg-primary border-primary text-primary-text-light'
                                : 'border-gray-300 text-primary-text dark:text-primary-text-light bg-main-bg dark:bg-main-bg-dark'
                        }`}>
                            {step}
                        </div>
                        {step < totalSteps && (
                            <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                                step < currentStep ? 'bg-primary' : 'bg-main-bg'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const handleAddFlavour = (flavour: FlavourType) => {
        if (remainingChocolates <= 0) {
            toast.error('Not enough remaining chocolates for this selection.');
            return;
        }
        const existingFlavourIndex = flavours.findIndex(f => f.flavor?.id === flavour.id);
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
        return !canAddToCart();
    };

    const getProgressText = () => {
        if (remainingChocolates === 0) {
            return `You have selected all ${maxChocolates} chocolates.`;
        } else {
            return `You can select ${remainingChocolates} more chocolate(s).`;
        }
    };

    const handleAddToCart = async () => {
        // Check if gift card is selected but no gift message is provided
        if (isPack && giftCard && giftMessage.trim() === '') {
            setShowGiftMessagePopup(true);
            return;
        }

        try {
            let cartItemRequest: CartItemRequest;

            if (isPack) {
                // Pack customization - use pack product ID from ID_MAP
                const packProductId = ID_MAP[product.units_per_box || 0] || product.id;
                cartItemRequest = {
                    product: packProductId,
                    quantity: quantity,
                    pack_customization: {
                        selection_type: selection as 'PICK_AND_MIX' | 'RANDOM',
                        flavor_selections: selection === 'PICK_AND_MIX' ? flavours.filter(f => f.flavor?.id).map(f => ({
                            flavor: f.flavor!.id,
                            quantity: f.quantity
                        })) : [],
                        chocolate_bark: chocolateBark?.id ?? undefined,
                        hot_chocolate: hotChocolate?.id ?? undefined,
                        gift_card: giftCard?.id ?? undefined
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
                        flavor_selections: selection === 'PICK_AND_MIX' ? flavours.filter(f => f.flavor?.id).map(f => ({
                            flavor: f.flavor!.id,
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
                <h2 className="text-2xl font-semibold text-primary-text dark:text-primary-text-light mb-4">Create your Signature Box</h2>

                <StepIndicator />

                {/* Step 1: Selection Type */}
                {currentStep === 1 && (
                    <div className="transition-opacity">
                        <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light mb-4">Step 1: Choose your experience</h3>
                        <BoxSelection
                            options={prebulids}
                            selected={selection}
                            onChange={setSelection}
                        />
                        {selection === 'RANDOM' && (
                            <p className="text-sm text-primary-text dark:text-primary-text-light mt-2">
                                We will pick you {maxChocolates} amazing bonbons with your selected preferences.
                            </p>
                        )}
                        {selection === 'PICK_AND_MIX' && (
                            <p className="text-sm text-primary-text dark:text-primary-text-light mt-2">
                                Choose your own {maxChocolates} flavours and create your perfect box.
                            </p>
                        )}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={!canProceedToStep2()}
                                className="px-6 py-2 bg-primary text-primary-text-light rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Allergens */}
                {currentStep === 2 && (
                    <div className="transition-opacity">
                        <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light mb-4">Step 2: Any allergens to avoid?</h3>
                        <AllergenSelection
                            allergens={allergens}
                            selectedAllergens={selectedAllergens}
                            setSelectedAllergens={setSelectedAllergens}
                            allergenOption={allergenOption}
                            setAllergenOption={setAllergenOption}
                        />
                        <div className="mt-6 flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2 border border-gray-300 text-primary-text dark:text-primary-text-light rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={!canProceedToStep3()}
                                className="px-6 py-2 bg-primary text-primary-text-light rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Flavours or Final Options */}
                {currentStep === 3 && (
                    <div className="transition-opacity">
                        <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light mb-4">
                            Step 3: {selection === 'PICK_AND_MIX' ? 'Pick your flavours' : 'Review your selection'}
                        </h3>

                        {selection === 'PICK_AND_MIX' ? (
                            <>
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

                                <div className="mt-4">
                                    <p className="text-sm mb-1 text-primary-text dark:text-primary-text-light">{getProgressText()}</p>
                                    <ProgressBar
                                        value={maxChocolates - remainingChocolates}
                                        max={maxChocolates}
                                    />
                                </div>

                                {remainingChocolates === 0 && (
                                    <div className="mt-6 space-y-4">
                                        {/* Quantity Selection */}
                                        <div>
                                            <label htmlFor="quantity" className="block text-sm font-medium text-primary-text dark:text-primary-text-light">
                                                Number of Boxes
                                            </label>
                                            <select
                                                id="quantity"
                                                name="quantity"
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600
                                                    bg-main-bg dark:bg-main-bg-dark text-primary-text dark:text-primary-text-light shadow-sm focus:border-primary-2
                                                    focus:ring-primary-2"
                                            >
                                                {Array.from({ length: 20 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>


                                        <div className="mt-6 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={handlePrevStep}
                                                className="px-6 py-2 border border-gray-300 text-primary-text dark:text-primary-text-light rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowUpgradePopup(true)}
                                                disabled={!canAddToCart()}
                                                className="px-6 py-2 bg-primary text-primary-text-light rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            // RANDOM selection - show summary and options
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg">
                                    <p className="text-sm text-primary-text dark:text-primary-text-light">
                                        We'll select {maxChocolates} chocolates for you, avoiding your specified allergens.
                                    </p>
                                </div>

                                {/* Quantity Selection */}
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-primary-text dark:text-primary-text-light">
                                        Number of Boxes
                                    </label>
                                    <select
                                        id="quantity"
                                        name="quantity"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600
                                            bg-main-bg dark:bg-transparent text-primary-text dark:text-primary-text-light shadow-sm focus:border-primary-2
                                            focus:ring-primary-2"
                                    >
                                        {Array.from({ length: 20 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>


                                <div className="mt-6 flex justify-between">
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="px-6 py-2 border border-gray-300 text-primary-text dark:text-primary-text-light rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowUpgradePopup(true)}
                                        disabled={!canAddToCart()}
                                        className="px-6 py-2 bg-primary text-primary-text-light rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Hot Chocolate Selection (Pack only) */}
                {currentStep === 4 && isPack && (
                    <div className="transition-opacity">
                        <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light mb-4">Step 4: Choose your Hot Chocolate</h3>

                        <div className="mb-4">
                            <label htmlFor="hot-chocolate-select" className="block text-sm font-medium text-primary-text dark:text-primary-text-light mb-2">
                                Select Hot Chocolate
                            </label>
                            <select
                                id="hot-chocolate-select"
                                value={hotChocolate?.id || ''}
                                onChange={(e) => {
                                    const selectedProduct = allProducts?.find(p => p.id === parseInt(e.target.value));
                                    setHotChocolate(selectedProduct || null);
                                }}
                                className="block w-full rounded-md border-gray-300 dark:border-gray-600
                                    bg-main-bg dark:bg-transparent text-primary-text dark:text-primary-text-light shadow-sm focus:border-primary-2
                                    focus:ring-primary-2 px-3 py-2"
                            >
                                <option value="">Choose a hot chocolate...</option>
                                {allProducts?.filter(p => p.category?.slug === 'hot-chocolate').map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2 border border-gray-300 text-primary-text dark:text-primary-text-light rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={hotChocolate === null}
                                className="px-6 py-2 bg-primary text-primary-text-light rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Chocolate Bark Selection (Pack only) */}
                {currentStep === 5 && isPack && (
                    <div className="transition-opacity">
                        <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light mb-4">Step 5: Choose your Chocolate Bark</h3>

                        <div className="mb-4">
                            <label htmlFor="chocolate-bark-select" className="block text-sm font-medium text-primary-text dark:text-primary-text-light mb-2">
                                Select Chocolate Bark
                            </label>
                            <select
                                id="chocolate-bark-select"
                                value={chocolateBark?.id || ''}
                                onChange={(e) => {
                                    const selectedProduct = allProducts?.find(p => p.id === parseInt(e.target.value));
                                    setChocolateBark(selectedProduct || null);
                                }}
                                className="block w-full rounded-md border-gray-300 dark:border-gray-600
                                    bg-main-bg dark:bg-transparent text-primary-text dark:text-primary-text-light shadow-sm focus:border-primary-2
                                    focus:ring-primary-2 px-3 py-2"
                            >
                                <option value="">Choose a chocolate bark...</option>
                                {allProducts?.filter(p => p.category?.slug === 'chocolate-barks').map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2 border border-gray-300 text-primary-text dark:text-primary-text-light rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={chocolateBark === null}
                                className="px-6 py-2 bg-primary text-primary-text-light rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 6: Gift Card Selection (Pack only) */}
                {currentStep === 6 && isPack && (
                    <div className="transition-opacity">
                        <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light mb-4">Step 6: Choose your Gift Card</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4">
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
                                        ? 'border-primary bg-primary text-primary-text-light'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                }`}
                            >
                                <span className={giftCard === null ? 'text-primary-text-light' : 'text-primary-text dark:text-primary-text-light'}>No Gift Card</span>
                            </div>
                        </div>

                        {giftCard && (
                            <div className="mt-4">
                                <GiftMessage onGiftMessageChange={setGiftMessage} />
                            </div>
                        )}

                        <div className="mt-6 flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2 border border-gray-300 text-primary-text dark:text-primary-text-light rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add to Cart Button - Only show on final step when ready */}
            {((!isPack && currentStep === 3) || (isPack && currentStep === 6)) && canAddToCart() && (
                <div className="sticky md:static bottom-[55px] md:bottom-auto bg-main-bg dark:bg-main-bg-dark pt-4 pb-6 px-4 -mx-4 border-t border-gray-200 dark:border-gray-700">
                    <AddToCartButton
                        onClick={handleAddToCart}
                        isLoading={isLoading}
                        isDisabled={isAddToCartDisabled()}
                        selection={selection}
                        remainingChocolates={remainingChocolates}
                    />
                </div>
            )}

            {/* Upgrade Popup */}
            {showUpgradePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-main-bg dark:bg-main-bg-dark rounded-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light mb-4">
                                Make your signature box more indulgent.
                            </h3>
                            <p className="text-sm text-primary-text dark:text-primary-text-light mb-4">
                                For £{getPackPrice()} pounds more add:
                            </p>
                            <ul className="text-sm text-primary-text dark:text-primary-text-light mb-6 space-y-1">
                                <li>• Gourmet chocolate bark</li>
                                <li>• Luxury hot chocolate</li>
                                <li>• Personalized gift card</li>
                            </ul>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowUpgradePopup(false);
                                        handleAddToCart();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-primary-text dark:text-primary-text-light rounded-md hover:main-bg dark:hover:bg-main-bg-dark transition-colors"
                                >
                                    Continue to cart
                                </button>
                                <button
                                    onClick={() => {
                                        setShowUpgradePopup(false);
                                        setIsPack(true);
                                        setCurrentStep(4);
                                    }}
                                    className="flex-1 px-4 py-2 bg-primary text-primary-text-light rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Make an indulgence pack
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gift Message Confirmation Popup */}
            {showGiftMessagePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-main-bg dark:bg-main-bg-dark rounded-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light mb-4">
                                Add a personal message?
                            </h3>
                            <p className="text-sm text-primary-text dark:text-primary-text-light mb-6">
                                You've selected a gift card but haven't added a personal message. Would you like to add one?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowGiftMessagePopup(false);
                                        setCurrentStep(6); // Go back to gift card step to add message
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-primary-text dark:text-primary-text-light rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Add Message
                                </button>
                                <button
                                    onClick={async () => {
                                        setShowGiftMessagePopup(false);
                                        // Proceed with adding to cart without gift message
                                        try {
                                            const packProductId = ID_MAP[product.units_per_box || 0] || product.id;
                                            const cartItemRequest: CartItemRequest = {
                                                product: packProductId,
                                                quantity: quantity,
                                                pack_customization: {
                                                    selection_type: selection as 'PICK_AND_MIX' | 'RANDOM',
                                                    flavor_selections: selection === 'PICK_AND_MIX' ? flavours.filter(f => f.flavor?.id).map(f => ({
                                                        flavor: f.flavor!.id,
                                                        quantity: f.quantity
                                                    })) : [],
                                                    chocolate_bark: chocolateBark?.id ?? undefined,
                                                    hot_chocolate: hotChocolate?.id ?? undefined,
                                                    gift_card: giftCard?.id ?? undefined
                                                }
                                            };

                                            const response = await addToCart(cartItemRequest).unwrap();
                                            toast.success('Pack added to cart successfully!');
                                            router.push('/cart');
                                        } catch (error) {
                                            toast.error('Failed to add item to cart');
                                            console.error('Add to cart error:', error);
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-primary text-primary-text-light rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Continue to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );

};

export default ProductFormBoxes;
