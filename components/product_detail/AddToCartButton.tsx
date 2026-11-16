import React from 'react';
import { List, Spinner } from '@/components/common';
import { buttonClasses } from '@/components/common/Button';

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
            className={buttonClasses({ size: 'lg', fullWidth: true })}
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
