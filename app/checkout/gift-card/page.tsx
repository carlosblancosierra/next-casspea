'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GiftMessage from '@/components/cart/GiftMessage';
import SelectableGiftCard from '@/components/store/SelectableGiftCard';
import { useAddCartItemMutation, useGetCartQuery, useUpdateCartMutation, useRemoveCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import { useGetSessionQuery } from '@/redux/features/checkout/checkoutApiSlice';

const GiftCardPage = () => {
    const { data: cart, isLoading, error: cartError } = useGetCartQuery();

    const router = useRouter();
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [giftMessage, setGiftMessage] = useState('');
    const [addCartItem] = useAddCartItemMutation();
    const [updateCart] = useUpdateCartMutation();
    const [removeCartItem] = useRemoveCartItemMutation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    

    useEffect(() => {
        if (cart?.gift_message) {
            setGiftMessage(cart.gift_message);
        }
    }, [cart]);

    useEffect(() => {
        if (cart && cart.items && cart.items.some(item => !!(item as any).pack_customization)) {
            router.push('/checkout/address');
        }
    }, [cart, router]);

    const giftCardOptions = [
        { id: '137', name: 'Thank You', image: '/gift-cards/thank-you.jpeg' },
        { id: '106', name: 'Happy Birthday', image: '/gift-cards/happy-birthday.jpeg', },
        { id: '105', name: 'Congratulations', image: '/gift-cards/congratulations.jpeg' },
        { id: '104', name: 'I Love You', image: '/gift-cards/love-you.jpeg' },
    ];

    const handleAddGiftCard = async () => {
        if (!selectedCard) {
            setError('Please select a gift card option.');
            return;
        }
        setIsProcessing(true);
        setError(null);
        try {
            if (giftMessage.trim() !== '') {
                await updateCart({ gift_message: giftMessage }).unwrap();
            }

            const giftCardOptionIds = giftCardOptions.map(option => parseInt(option.id, 10));
            const newSelectedId = parseInt(selectedCard, 10);
            const existingGiftCard = cart?.items.find(item => giftCardOptionIds.includes(item.product.id));

            if (existingGiftCard) {
                if (existingGiftCard.product.id === newSelectedId) {
                    router.push('/checkout/address');
                    return;
                } else {
                    await removeCartItem(existingGiftCard.id).unwrap();
                }
            }

            const cartItemRequest = {
                product: newSelectedId,
                quantity: 1
            };
            await addCartItem(cartItemRequest).unwrap();
            router.push('/checkout/address');
        } catch (err) {
            console.error(err);
            setError('Failed to add gift card. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleContinueWithoutGiftCard = async () => {
        try {
            const giftCardOptionIds = giftCardOptions.map(option => parseInt(option.id, 10));
            const existingGiftCard = cart?.items.find(item => giftCardOptionIds.includes(item.product.id));
            if (existingGiftCard) {
                await removeCartItem(existingGiftCard.id).unwrap();
            }
        } catch (err) {
            console.error('Error removing gift card:', err);
        }
        router.push('/checkout/address');
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div style={{ display: isLoading ? 'block' : 'none' }}>
                <div>Loading...</div>
            </div>
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                <h1 className="text-2xl font-bold mb-4 text-primary-text">
                    Enhance Your Order with a Gift Card
                </h1>
                <p className="mb-4 text-primary-text">
                    Add a personal touch to your order! Choose one of our beautifully designed gift cards for just £1.25 each to include a heartfelt message for your recipient.
                </p>
                <div className="mb-6">
                    <GiftMessage onGiftMessageChange={setGiftMessage} initialMessage={giftMessage} />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-primary-text">
                    Choose a Gift Card
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {giftCardOptions.map((card) => (
                        <SelectableGiftCard
                            key={card.id}
                            title={card.name}
                            image={card.image}
                            selected={selectedCard === card.id}
                            onSelect={() => setSelectedCard(card.id)}
                        />
                    ))}
                </div>
                {error && (
                    <p className="text-primary-text mb-4">{error}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button 
                        onClick={handleAddGiftCard} 
                        disabled={isProcessing} 
                        className="w-full sm:w-auto bg-primary text-primary-text px-4 py-2 rounded-md hover:bg-primary-2 sm:order-2"
                    >
                        {isProcessing ? 'Adding...' : 'Add Gift Card'}
                    </button>
                    <button 
                        onClick={handleContinueWithoutGiftCard} 
                        disabled={isProcessing} 
                        className="w-full sm:w-auto bg-gray-300 text-primary-text px-4 py-2 rounded-md hover:bg-gray-400 sm:order-1"
                    >
                        Continue Without Gift Card
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GiftCardPage;
