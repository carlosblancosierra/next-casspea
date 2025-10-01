import { CartItemRequest } from "@/types/carts";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { Product as ProductType } from '@/types/products';
import { useAddCartItemMutation } from "@/redux/features/carts/cartApiSlice";
import ColoredList from "../common/ColoredList";
import AllergenSelection from './AllergenSelection';

interface ProductFormGeneralProps {
    product: ProductType;
}

const ProductFormGeneral: React.FC<ProductFormGeneralProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    // Allergen state
    const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
    const [allergenOption, setAllergenOption] = useState<'NONE' | 'SPECIFY' | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Use the same mutation from cartApiSlice
    const [addToCart, { isLoading }] = useAddCartItemMutation();

    const handleAddToCart = async () => {
        try {
            // Build the payload required by your backend
            const cartItemRequest: CartItemRequest = {
                product: product.id,
                quantity,
                ...(product.can_pick_allergens ? {
                    box_customization: {
                        selection_type: 'RANDOM', // or undefined if not needed
                        allergens: allergenOption === 'SPECIFY' ? selectedAllergens : [],
                    }
                } : {})
            };

            // Actually call the mutation
            await addToCart(cartItemRequest).unwrap();

            // Feedback to user, then redirect to cart
            toast.success(`${product.name} added to cart!`);
            router.push('/cart');
        } catch (error) {
            toast.error('Failed to add item to cart');
            console.error('Add to cart error:', error);
        }
    };

    const prideBoxList = [
        // { text: "Meet the pride flavours!", colorKey: "black" },
        { text: "Red - Rhubarb and Custard", colorKey: "red" },
        { text: "Orange- Apple Pie", colorKey: "orange" },
        { text: "Yellow - Passion Fruit and Mango Caramel", colorKey: "yellow" },
        { text: "Green - Mint and Dark Chocolate", colorKey: "green" },
        { text: "Blue - Guava Cheesecake", colorKey: "blue" },
    ];

    const allergens = [
        { name: 'Gluten', id: 2 },
        { name: 'Alcohol', id: 5 },
        { name: 'Nut', id: 6 },
        // Add more allergens as needed
    ];

    return (
        <form>
            <div className="mt-4">
                {product.slug == "pride-box" && (
                <ColoredList
                    className="mb-4"
                    items={
                        product.slug === "pride-box"
                            ? prideBoxList
                            : product.description?.split('\n') || []
                    }
                    title="Meet the Pride Flavours!"
                    subtitle="Each box contains 15 bonbons, comprising three of each flavour."
                    useCustomColors={product.slug === "pride-box"}
                />
                )}
                {!product.sold_out && (
                    <>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Quantity
                        </label>
                        <select
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-main-bg dark:bg-gray-800 shadow-sm focus:border-primary-2 focus:ring-primary-2 sm:text-sm"
                        >
                            {Array.from({ length: 10 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </>
                )}
            </div>

            {/* Allergen selection if product.allergen_options is true */}
            {product.can_pick_allergens && (
                <div className="mt-4">
                    <AllergenSelection
                        allergens={allergens}
                        selectedAllergens={selectedAllergens}
                        setSelectedAllergens={setSelectedAllergens}
                        allergenOption={allergenOption}
                        setAllergenOption={setAllergenOption}
                    />
                </div>
            )}

            {product.slug === "advent-calendar" && (
                <div className="mt-4">
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Shipping begins on Nov 21st.
                    </p>
                </div>
            )}

            {product.sold_out ? (
                <button
                    type="button"
                    disabled
                    className="mt-8 w-full py-3 rounded bg-gray-400 text-white cursor-not-allowed flex items-center justify-center text-sm gap-2"
                >
                    Sold Out
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleAddToCart}
                    className="mt-8 w-full py-3 rounded bg-primary-2 text-white dark:bg-primary cursor-pointer flex items-center justify-center text-sm gap-2"
                >
                    Add to Cart
                </button>
            )}
        </form>
    );
};

export default ProductFormGeneral;
