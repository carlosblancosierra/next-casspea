import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { Product as ProductType } from '@/types/products';

interface ProductFormGeneralProps {
    product: ProductType;
}

const ProductFormGeneral: React.FC<ProductFormGeneralProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleAddToCart = () => {
        const CartItem = {
            id: product.id,
            product,
            quantity,
            active: true,
        };

        toast.success(`${product.name} added to cart!`);

        setTimeout(() => {
            router.push('/cart');
        }, 1000);
    };

    return (
        <form>
            <div className="mt-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Quantity
                </label>
                <select
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus:border-primary-2 focus:ring-primary-2 sm:text-sm"
                >
                    {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                onClick={handleAddToCart}
                className="mt-8 w-full py-3 rounded bg-primary-2 text-white dark:bg-primary cursor-pointer flex items-center justify-center text-sm gap-2"
            >
                Add to Cart
            </button>
        </form>
    );
};

export default ProductFormGeneral;
