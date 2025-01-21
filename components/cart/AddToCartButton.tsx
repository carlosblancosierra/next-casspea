import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

interface AddToCartButtonProps {
    onClick: () => void;
    isLoading: boolean;
    isDisabled: boolean;
    selection: string | null;
    remainingChocolates: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
    onClick,
    isLoading,
    isDisabled,
    selection,
    remainingChocolates
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            className={`w-full flex items-center justify-center bg-primary text-white py-3 px-4 rounded-md
                hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary-2 focus:ring-offset-2
                ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : ''}
                transition-colors duration-200`}
        >
            {isLoading ? 'Adding to Cart...' : (
                <>
                    <FiShoppingCart className="mr-2 w-5 h-5" />
                    Add to Cart
                </>
            )}
        </button>
    );
};

export default AddToCartButton;
