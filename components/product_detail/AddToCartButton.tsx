import React from 'react';
import { List, Spinner } from '@/components/common';

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
    const getButtonText = () => {
        if (!selection) return 'Choose your box type to continue';
        if (isLoading) return 'Adding...';
        if (selection === 'PICK_AND_MIX' && remainingChocolates > 0)
            return `Select ${remainingChocolates} more chocolate${remainingChocolates > 1 ? 's' : ''}`;
        return 'Add to Cart';
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            className={`
                w-full py-4 rounded-lg text-sm font-medium
                transition-all duration-200 ease-in-out
                flex items-center justify-center gap-2
                ${!selection
                    ? 'bg-gray-100 secondary-text dark:bg-gray-800 dark:secondary-text cursor-not-allowed'
                    : isDisabled
                        ? 'bg-gray-100 secondary-text dark:bg-gray-800 dark:secondary-text cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary dark:bg-primary-2 dark:hover:bg-primary'
                }
                disabled:cursor-not-allowed disabled:opacity-50
            `}
        >
            {!selection ? (
                'Choose your box type to continue'
            ) : isLoading ? (
                <>
                    <Spinner className="animate-spin h-5 w-5" />
                    Adding to cart...
                </>
            ) : selection === 'PICK_AND_MIX' && remainingChocolates > 0 ? (
                `Select ${remainingChocolates} more chocolate${remainingChocolates > 1 ? 's' : ''}`
            ) : (
                'Add to Cart'
            )}
        </button>
    );
};

export default AddToCartButton;
