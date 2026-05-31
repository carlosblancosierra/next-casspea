'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Product as ProductType, Product } from '@/types/products';
import { CartItemBoxFlavorSelection, CartItemRequest } from '@/types/carts';
import { useAddCartItemMutation, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { useRouter } from 'next/navigation';
import { ID_MAP, LOVE_SLEEVE_PRODUCT_ID, LOVE_SLEEVE_PRICE } from '@/components/packs/constants';
import FlavourPicker from './FlavourPicker';
import GiftMessage from '@/components/cart/GiftMessage';
import { Flavour as FlavourType } from '@/types/flavours';

type StepId =
    | 'experience'
    | 'allergens'
    | 'flavours'
    | 'upgrade'
    | 'hot_chocolate'
    | 'bark'
    | 'gift_card'
    | 'love_sleeve'
    | 'quantity';

const ALLERGENS = [
    { id: 2, name: 'Gluten' },
    { id: 5, name: 'Alcohol' },
    { id: 6, name: 'Nut' },
];

interface BoxBuilderFlowProps {
    product: ProductType;
    onClose: () => void;
}

export default function BoxBuilderFlow({ product, onClose }: BoxBuilderFlowProps) {
    const maxChocolates = product.units_per_box || 0;
    const isNinetySixBox = maxChocolates === 96;

    const [selection, setSelection] = useState<string | null>(null);
    const [allergenOption, setAllergenOption] = useState<'NONE' | 'SPECIFY' | null>(null);
    const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
    const [flavours, setFlavours] = useState<CartItemBoxFlavorSelection[]>([]);
    const [remainingChocolates, setRemainingChocolates] = useState(maxChocolates);
    const [isPack, setIsPack] = useState(false);
    const [hotChocolate, setHotChocolate] = useState<Product | null>(null);
    const [chocolateBark, setChocolateBark] = useState<Product | null>(null);
    const [giftCard, setGiftCard] = useState<Product | null>(null);
    const [loveSleeve, setLoveSleeve] = useState<boolean | null>(null);
    const [giftMessage, setGiftMessage] = useState('');
    const [quantity, setQuantity] = useState(1);

    const [currentStep, setCurrentStep] = useState<StepId>('experience');
    const [animDir, setAnimDir] = useState<'up' | 'down'>('up');

    const router = useRouter();
    const [addToCart, { isLoading }] = useAddCartItemMutation();
    const [updateCart] = useUpdateCartMutation();
    const { data: allProducts } = useGetProductsQuery();

    const indulgencePackProductId = ID_MAP[product.units_per_box || 0];
    const indulgencePackProduct = allProducts?.find(p => p.id === indulgencePackProductId);
    const isIndulgencePackSoldOut = Boolean(indulgencePackProduct?.sold_out);
    const hasUpgradeOption = !isNinetySixBox && !isIndulgencePackSoldOut;

    const hotChocolates = allProducts?.filter(p => p.category?.slug === 'hot-chocolate') ?? [];
    const barks = allProducts?.filter(p => p.category?.slug === 'chocolate-barks') ?? [];
    const giftCards = allProducts?.filter(p => p.category?.slug === 'gift-cards') ?? [];
    const loveSleeveProduct = allProducts?.find(p => p.id === LOVE_SLEEVE_PRODUCT_ID);

    const getPackPrice = () => {
        switch (product.units_per_box) {
            case 9: return 9.5;
            case 15: return 7.5;
            case 24: return 5;
            case 48: return 5;
            default: return 10;
        }
    };

    const getActiveSteps = (overrideIsPack?: boolean): StepId[] => {
        const pack = overrideIsPack !== undefined ? overrideIsPack : isPack;
        const s: StepId[] = ['experience', 'allergens'];
        if (selection === 'PICK_AND_MIX') s.push('flavours');
        if (hasUpgradeOption) s.push('upgrade');
        if (pack) s.push('hot_chocolate', 'bark', 'gift_card', 'love_sleeve');
        s.push('quantity');
        return s;
    };

    const activeSteps = getActiveSteps();
    const currentIndex = activeSteps.indexOf(currentStep);
    const progress = activeSteps.length > 1 ? (currentIndex / (activeSteps.length - 1)) * 100 : 0;

    const go = (step: StepId, dir: 'forward' | 'back') => {
        setAnimDir(dir === 'forward' ? 'up' : 'down');
        setCurrentStep(step);
    };

    const handleNext = () => {
        setAnimDir('up');
        switch (currentStep) {
            case 'experience':
                go('allergens', 'forward');
                break;
            case 'allergens':
                if (selection === 'PICK_AND_MIX') go('flavours', 'forward');
                else if (hasUpgradeOption) go('upgrade', 'forward');
                else go('quantity', 'forward');
                break;
            case 'flavours':
                if (hasUpgradeOption) go('upgrade', 'forward');
                else go('quantity', 'forward');
                break;
            case 'upgrade':
                break;
            case 'hot_chocolate':
                go('bark', 'forward');
                break;
            case 'bark':
                go('gift_card', 'forward');
                break;
            case 'gift_card':
                go('love_sleeve', 'forward');
                break;
            case 'love_sleeve':
                go('quantity', 'forward');
                break;
        }
    };

    const handleBack = () => {
        switch (currentStep) {
            case 'experience':
                onClose();
                break;
            case 'allergens':
                go('experience', 'back');
                break;
            case 'flavours':
                go('allergens', 'back');
                break;
            case 'upgrade':
                if (selection === 'PICK_AND_MIX') go('flavours', 'back');
                else go('allergens', 'back');
                break;
            case 'hot_chocolate':
                go('upgrade', 'back');
                break;
            case 'bark':
                go('hot_chocolate', 'back');
                break;
            case 'gift_card':
                go('bark', 'back');
                break;
            case 'love_sleeve':
                go('gift_card', 'back');
                break;
            case 'quantity':
                if (isPack) go('love_sleeve', 'back');
                else if (hasUpgradeOption) go('upgrade', 'back');
                else if (selection === 'PICK_AND_MIX') go('flavours', 'back');
                else go('allergens', 'back');
                break;
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 'experience': return selection !== null;
            case 'allergens': return allergenOption !== null;
            case 'flavours': return remainingChocolates === 0;
            case 'upgrade': return false;
            case 'hot_chocolate': return hotChocolate !== null;
            case 'bark': return chocolateBark !== null;
            case 'gift_card': return true;
            case 'love_sleeve': return loveSleeve !== null;
            case 'quantity': return true;
        }
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Enter' && currentStep !== 'upgrade' && currentStep !== 'quantity' && canProceed()) {
                handleNext();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    // ── Flavour helpers ────────────────────────────────────────────────────────
    const handleAddFlavour = (flavour: FlavourType) => {
        const idx = flavours.findIndex(f => f.flavor?.id === flavour.id);
        if (idx !== -1) {
            setFlavours(prev => {
                const next = [...prev];
                next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
                return next;
            });
            setRemainingChocolates(prev => prev - 1);
        } else {
            setFlavours(prev => [...prev, { flavor: flavour, quantity: 1 }]);
            setRemainingChocolates(prev => prev - 1);
        }
    };

    const handleFlavourChange = (index: number, field: string, value: string | number) => {
        setFlavours(prev => {
            const next = [...prev];
            const oldQty = next[index].quantity;
            next[index] = { ...next[index], [field]: value };
            if (field === 'quantity') {
                setRemainingChocolates(r => r + oldQty - Number(value));
            }
            return next;
        });
    };

    const incrementQuantity = (index: number) => {
        if (remainingChocolates <= 0) return;
        handleFlavourChange(index, 'quantity', flavours[index].quantity + 1);
    };

    const decrementQuantity = (index: number) => {
        if (flavours[index].quantity <= 1) {
            const removed = flavours[index].quantity;
            setFlavours(prev => prev.filter((_, i) => i !== index));
            setRemainingChocolates(prev => prev + removed);
            return;
        }
        handleFlavourChange(index, 'quantity', flavours[index].quantity - 1);
    };

    const deleteFlavour = (index: number) => {
        const removed = flavours[index].quantity;
        setFlavours(prev => prev.filter((_, i) => i !== index));
        setRemainingChocolates(prev => prev + removed);
    };

    const handleDeleteAllFlavours = () => {
        const total = flavours.reduce((acc, f) => acc + f.quantity, 0);
        setFlavours([]);
        setRemainingChocolates(prev => prev + total);
    };

    // ── Cart submission ────────────────────────────────────────────────────────
    const handleAddToCart = async () => {
        const shouldTreatAsPack = isPack && !isIndulgencePackSoldOut;
        try {
            let cartItemRequest: CartItemRequest;
            if (shouldTreatAsPack) {
                const packProductId = ID_MAP[product.units_per_box || 0] || product.id;
                cartItemRequest = {
                    product: packProductId,
                    quantity,
                    pack_customization: {
                        selection_type: selection as 'PICK_AND_MIX' | 'RANDOM',
                        flavor_selections:
                            selection === 'PICK_AND_MIX'
                                ? flavours.filter(f => f.flavor?.id).map(f => ({ flavor: f.flavor!.id, quantity: f.quantity }))
                                : [],
                        chocolate_bark: chocolateBark?.id,
                        hot_chocolate: hotChocolate?.id,
                        gift_card: giftCard?.id,
                    },
                };
            } else {
                cartItemRequest = {
                    product: product.id,
                    quantity,
                    box_customization: {
                        selection_type: selection as 'PICK_AND_MIX' | 'RANDOM',
                        allergens: allergenOption === 'SPECIFY' ? selectedAllergens : [],
                        flavor_selections:
                            selection === 'PICK_AND_MIX'
                                ? flavours.filter(f => f.flavor?.id).map(f => ({ flavor: f.flavor!.id, quantity: f.quantity }))
                                : [],
                    },
                };
            }

            if (shouldTreatAsPack && giftMessage.trim()) {
                await updateCart({ gift_message: giftMessage }).unwrap();
            }

            await addToCart(cartItemRequest).unwrap();

            if (shouldTreatAsPack && loveSleeve) {
                await addToCart({ product: LOVE_SLEEVE_PRODUCT_ID, quantity: 1 }).unwrap();
            }

            toast.success(shouldTreatAsPack ? 'Indulgence Pack added to cart!' : 'Box added to cart!');
            router.push('/cart');
        } catch {
            toast.error('Failed to add to cart. Please try again.');
        }
    };

    // ── Shared sub-components ─────────────────────────────────────────────────
    const StepCTA = ({
        onClick,
        disabled,
        label = 'Continue',
    }: {
        onClick: () => void;
        disabled: boolean;
        label?: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-base hover:bg-primary-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
            {label}
            {!disabled && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            )}
        </button>
    );

    const SelectCard = ({
        value,
        selected,
        onClick,
        icon,
        title,
        desc,
    }: {
        value: string;
        selected: boolean;
        onClick: () => void;
        icon: string;
        title: string;
        desc: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                selected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
            }`}
        >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            {selected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </button>
    );

    const CheckBadge = () => (
        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-[200] bg-white dark:bg-main-bg-dark flex flex-col overflow-hidden">
            {/* Slim progress bar */}
            <div className="h-1 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {currentStep === 'experience' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        )}
                    </svg>
                    {currentStep === 'experience' ? 'Close' : 'Back'}
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium tabular-nums">
                        {currentIndex + 1} / {activeSteps.length}
                    </span>
                </div>

                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
                    <div
                        key={currentStep}
                        className={animDir === 'up' ? 'animate-slide-up-in' : 'animate-slide-down-in'}
                    >
                        {/* ── Step: Experience ─────────────────────────────── */}
                        {currentStep === 'experience' && (
                            <div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                                    {product.name}
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    How would you like your box?
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">
                                    Choose the experience that suits you best.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    <SelectCard
                                        value="PICK_AND_MIX"
                                        selected={selection === 'PICK_AND_MIX'}
                                        onClick={() => setSelection('PICK_AND_MIX')}
                                        icon="🎨"
                                        title="Pick & Mix"
                                        desc={`Choose your own ${maxChocolates} flavours — one by one`}
                                    />
                                    <SelectCard
                                        value="RANDOM"
                                        selected={selection === 'RANDOM'}
                                        onClick={() => setSelection('RANDOM')}
                                        icon="✨"
                                        title="Surprise Me"
                                        desc={`We'll curate ${maxChocolates} amazing bonbons just for you`}
                                    />
                                </div>

                                <StepCTA onClick={handleNext} disabled={selection === null} />
                            </div>
                        )}

                        {/* ── Step: Allergens ──────────────────────────────── */}
                        {currentStep === 'allergens' && (
                            <div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                                    Allergens
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    Any allergies we should know about?
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">
                                    We&apos;ll filter your options accordingly.
                                </p>

                                <div className="space-y-3 mb-8">
                                    {[
                                        { value: 'NONE', label: 'No restrictions', sub: 'I can eat everything — bring it on!' },
                                        { value: 'SPECIFY', label: 'I have allergies', sub: 'I need to avoid certain ingredients' },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setAllergenOption(opt.value as 'NONE' | 'SPECIFY')}
                                            className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                                                allergenOption === opt.value
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                            }`}
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{opt.label}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{opt.sub}</p>
                                            </div>
                                            {allergenOption === opt.value && <CheckBadge />}
                                        </button>
                                    ))}
                                </div>

                                {allergenOption === 'SPECIFY' && (
                                    <div className="mb-8 p-5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Select allergens to avoid:
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {ALLERGENS.map(a => (
                                                <button
                                                    key={a.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedAllergens(prev =>
                                                            prev.includes(a.id)
                                                                ? prev.filter(id => id !== a.id)
                                                                : [...prev, a.id]
                                                        )
                                                    }
                                                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                                                        selectedAllergens.includes(a.id)
                                                            ? 'border-primary bg-primary text-white'
                                                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary'
                                                    }`}
                                                >
                                                    {selectedAllergens.includes(a.id) ? '✓ ' : ''}{a.name} free
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <StepCTA onClick={handleNext} disabled={allergenOption === null} />
                            </div>
                        )}

                        {/* ── Step: Flavours ───────────────────────────────── */}
                        {currentStep === 'flavours' && (
                            <div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                                    Pick your flavours
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    Fill your {maxChocolates}-piece box
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    {remainingChocolates > 0
                                        ? `${remainingChocolates} more to go`
                                        : 'Your box is full — looking delicious!'}
                                </p>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        <span>{maxChocolates - remainingChocolates} selected</span>
                                        <span>{remainingChocolates} remaining</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-300 rounded-full"
                                            style={{
                                                width: `${((maxChocolates - remainingChocolates) / maxChocolates) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>

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

                                <div className="mt-8">
                                    <StepCTA
                                        onClick={handleNext}
                                        disabled={remainingChocolates > 0}
                                        label={
                                            remainingChocolates > 0
                                                ? `${remainingChocolates} spots left`
                                                : 'Continue'
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* ── Step: Upgrade ────────────────────────────────── */}
                        {currentStep === 'upgrade' && (
                            <div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                                    Make it special ✨
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    Upgrade to an Indulgence Pack?
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">
                                    Add £{getPackPrice().toFixed(2)} to unlock premium extras with your box.
                                </p>

                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-8 border border-amber-200 dark:border-amber-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">
                                        What&apos;s included
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            ['🍫', 'Premium chocolate bark'],
                                            ['☕', 'Luxury hot chocolate'],
                                            ['💌', 'Personalised gift card'],
                                            ['🎀', 'Optional love sleeve wrap'],
                                        ].map(([icon, label]) => (
                                            <li key={label} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm">
                                                <span className="text-lg">{icon}</span>
                                                {label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPack(false);
                                            const steps = getActiveSteps(false);
                                            setAnimDir('up');
                                            setCurrentStep(steps[steps.length - 1]);
                                        }}
                                        className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 transition-all text-left"
                                    >
                                        <p className="font-semibold text-gray-900 dark:text-white">Just the box</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Keep it simple and delicious
                                        </p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPack(true);
                                            setAnimDir('up');
                                            setCurrentStep('hot_chocolate');
                                        }}
                                        className="p-5 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 transition-all text-left"
                                    >
                                        <p className="font-semibold text-primary">Yes, upgrade! ✨</p>
                                        <p className="text-sm text-primary/70 mt-1">
                                            +£{getPackPrice().toFixed(2)} for the full experience
                                        </p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Step: Hot Chocolate ──────────────────────────── */}
                        {currentStep === 'hot_chocolate' && (
                            <ProductImageGrid
                                eyebrow="Indulgence Pack"
                                title="Choose your hot chocolate"
                                subtitle="A warming luxury hot chocolate to complete your pack."
                                products={hotChocolates}
                                selected={hotChocolate}
                                onSelect={p => {
                                    setHotChocolate(p);
                                    setTimeout(handleNext, 220);
                                }}
                            />
                        )}

                        {/* ── Step: Bark ───────────────────────────────────── */}
                        {currentStep === 'bark' && (
                            <ProductImageGrid
                                eyebrow="Indulgence Pack"
                                title="Choose your chocolate bark"
                                subtitle="A gorgeous slab of artisan chocolate bark."
                                products={barks}
                                selected={chocolateBark}
                                onSelect={p => {
                                    setChocolateBark(p);
                                    setTimeout(handleNext, 220);
                                }}
                            />
                        )}

                        {/* ── Step: Gift Card ──────────────────────────────── */}
                        {currentStep === 'gift_card' && (
                            <div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                                    Optional
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    Add a gift card?
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">
                                    Include a personalised message. Skip if you prefer.
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                    {giftCards.map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setGiftCard(giftCard?.id === p.id ? null : p)}
                                            className={`relative rounded-xl overflow-hidden border-2 aspect-square transition-all ${
                                                giftCard?.id === p.id
                                                    ? 'border-primary'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                            }`}
                                        >
                                            {p.image && (
                                                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="200px" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            {giftCard?.id === p.id && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5">
                                                <p className="text-xs text-white font-medium truncate">{p.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setGiftCard(null)}
                                        className={`rounded-xl border-2 aspect-square flex items-center justify-center transition-all ${
                                            giftCard === null
                                                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                        }`}
                                    >
                                        <div className="text-center p-2">
                                            <div className="text-2xl mb-1">🚫</div>
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">No card</p>
                                        </div>
                                    </button>
                                </div>

                                {giftCard && (
                                    <div className="mb-6">
                                        <GiftMessage onGiftMessageChange={setGiftMessage} />
                                    </div>
                                )}

                                <StepCTA onClick={handleNext} disabled={false} label="Continue" />
                            </div>
                        )}

                        {/* ── Step: Love Sleeve ────────────────────────────── */}
                        {currentStep === 'love_sleeve' && (
                            <div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                                    Optional add-on
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    Add a Love Sleeve?
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-8">
                                    A beautiful wrap for your pack — just £{LOVE_SLEEVE_PRICE.toFixed(2)} extra.
                                </p>

                                {loveSleeveProduct?.image && (
                                    <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-8">
                                        <Image
                                            src={loveSleeveProduct.image}
                                            alt="Love Sleeve"
                                            fill
                                            className="object-cover"
                                            sizes="600px"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { val: true, icon: '🎀', label: `Yes please!`, sub: `+£${LOVE_SLEEVE_PRICE.toFixed(2)}` },
                                        { val: false, icon: '👌', label: 'No thanks', sub: 'Keep it as is' },
                                    ].map(opt => (
                                        <button
                                            key={String(opt.val)}
                                            type="button"
                                            onClick={() => {
                                                setLoveSleeve(opt.val);
                                                setAnimDir('up');
                                                setCurrentStep('quantity');
                                            }}
                                            className={`p-6 rounded-xl border-2 text-center transition-all duration-200 ${
                                                loveSleeve === opt.val
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                            }`}
                                        >
                                            <div className="text-3xl mb-2">{opt.icon}</div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{opt.label}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{opt.sub}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Step: Quantity ───────────────────────────────── */}
                        {currentStep === 'quantity' && (
                            <div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                                    Almost there!
                                </p>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    How many boxes?
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-10">
                                    Order multiple and save on shipping.
                                </p>

                                <div className="flex items-center justify-center gap-8 mb-12">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        disabled={quantity <= 1}
                                        className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <span className="text-7xl font-bold text-gray-900 dark:text-white w-20 text-center tabular-nums">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(prev => Math.min(20, prev + 1))}
                                        disabled={quantity >= 20}
                                        className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Summary pill */}
                                <div className="mb-8 px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Box</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{quantity} × {product.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Type</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {selection === 'PICK_AND_MIX' ? 'Pick & Mix' : 'Surprise Me'}
                                            {isPack ? ' · Indulgence Pack' : ''}
                                        </span>
                                    </div>
                                    {allergenOption === 'SPECIFY' && selectedAllergens.length > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">Avoiding</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {ALLERGENS.filter(a => selectedAllergens.includes(a.id)).map(a => a.name).join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={isLoading}
                                    className="w-full py-4 px-6 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Adding to cart…
                                        </>
                                    ) : (
                                        'Add to Cart'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Keyboard hint */}
            {currentStep !== 'quantity' &&
                currentStep !== 'upgrade' &&
                currentStep !== 'love_sleeve' &&
                currentStep !== 'hot_chocolate' &&
                currentStep !== 'bark' && (
                    <div className="text-center py-3 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
                        Press{' '}
                        <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500 dark:text-gray-400 font-mono text-xs">
                            Enter ↵
                        </kbd>{' '}
                        to continue
                    </div>
                )}
        </div>
    );
}

// ── Product image grid (hot choc, bark) ───────────────────────────────────────
function ProductImageGrid({
    eyebrow,
    title,
    subtitle,
    products,
    selected,
    onSelect,
}: {
    eyebrow: string;
    title: string;
    subtitle: string;
    products: Product[];
    selected: Product | null;
    onSelect: (p: Product) => void;
}) {
    return (
        <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">{eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{subtitle}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map(p => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelect(p)}
                        className={`relative rounded-xl overflow-hidden border-2 aspect-square transition-all duration-200 ${
                            selected?.id === p.id
                                ? 'border-primary scale-[1.02]'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:scale-[1.01]'
                        }`}
                    >
                        {p.image && (
                            <Image src={p.image} alt={p.name} fill className="object-cover" sizes="200px" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {selected?.id === p.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
                            <p className="text-sm text-white font-semibold leading-tight">{p.name}</p>
                        </div>
                    </button>
                ))}
            </div>

            <p className="mt-5 text-sm text-gray-400 dark:text-gray-500 text-center">
                Tap a product to select and continue
            </p>
        </div>
    );
}
