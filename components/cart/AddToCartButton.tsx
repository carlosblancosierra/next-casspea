import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import Button from '@/components/common/Button';

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
        <Button onClick={onClick} disabled={isDisabled} loading={isLoading} fullWidth>
            {isLoading ? 'Adding to Cart...' : (
                <>
                    <FiShoppingCart className="w-5 h-5" aria-hidden="true" />
                    Add to Cart
                </>
            )}
        </Button>
    );
};

export default AddToCartButton;
