import React, { useState } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { CartItem as CartItemType } from '@/types/carts';
import FlavourSelectionGrid from './FlavourSelectionGrid';
import { useChangeCartItemQuantityMutation, useRemoveCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

interface CartItemProps {
  entry: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ entry }) => {
  const boxSize = entry.product.units_per_box;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [changeQuantity, { isLoading: isChangingQuantity }] = useChangeCartItemQuantityMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();

  const isLoading = isChangingQuantity || isRemoving;

  const handleQuantityChange = async (change: number) => {
    const newQuantity = entry.quantity + change;
    if (newQuantity < 1) return;

    try {
      await changeQuantity({ id: entry.id, quantity: newQuantity }).unwrap();
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem(entry.id).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-[1fr,3fr] gap-4 border border-gray-200 bg-white p-4 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
        {/* First Column: Product Image */}
        <a href="#" className="col-span-1">
          <img
            className="w-full max-w-[150px] dark:hidden"
            src={entry.product.image || 'https://via.placeholder.com/150'}
            alt={entry.product.name}
          />
          <img
            className="w-full max-w-[150px] hidden dark:block"
            src={entry.product.image || 'https://via.placeholder.com/150'}
            alt={entry.product.name}
          />
        </a>

        {/* Second Column: Product Info, Actions, and Flavour Grid */}
        <div className="col-span-1 space-y-4">
          <div className="space-y-4">
            <a href="#" className="text-base font-medium text-gray-900 hover:underline dark:text-white">
              {entry.product.name}
            </a>

            <p className="flex flex-wrap items-center gap-2">
              <span className="items-center rounded-md px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                {entry.box_customization?.selection_type === 'PICK_AND_MIX' && 'Pick & Mix'}
                {entry.box_customization?.selection_type === 'RANDOM' && 'Surprise Me'}
              </span>

              {entry.box_customization?.allergens?.map((allergen) => (
                <span
                  key={allergen.id}
                  className="items-center rounded-md px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {allergen.name} Free
                </span>
              ))}
            </p>

            <p className="text-base font-bold text-gray-900 dark:text-white">${entry.product.base_price}</p>

            {/* Quantity Controls with Remove Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isLoading}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100
                         disabled:opacity-50 disabled:cursor-not-allowed
                         dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                aria-label="Remove item"
              >
                <FiTrash2 className="w-4 h-4 text-red-600" />
              </button>

              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={isLoading || entry.quantity <= 1}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100
                         disabled:opacity-50 disabled:cursor-not-allowed
                         dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                aria-label="Decrease quantity"
              >
                <FiMinus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>

              <span className="px-2 py-1 min-w-[40px] text-center font-medium text-gray-900 dark:text-white">
                {entry.quantity}
              </span>

              <button
                onClick={() => handleQuantityChange(1)}
                disabled={isLoading}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100
                         disabled:opacity-50 disabled:cursor-not-allowed
                         dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Flavour Selection Grid */}
          {entry.box_customization?.selection_type === 'PICK_AND_MIX' && (
            <div className="mt-6">
              <FlavourSelectionGrid
                flavours={entry.box_customization.flavor_selections || []}
                boxSize={boxSize}
              />
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          handleRemove();
          setIsDeleteModalOpen(false);
        }}
        title={`Are you sure you want to remove ${entry.product.name} from your cart?`}
      />
    </>
  );
};

export default CartItem;
