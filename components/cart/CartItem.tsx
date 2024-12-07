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
      <div className="grid grid-cols-[2fr,3fr] md:grid-cols-[1.5fr,1.5fr,2fr] gap-4 border border-gray-200 bg-white p-4 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
        {/* First Column: Product Image */}
        <a href="#" className="col-span-1 md:col-span-1">
          <img
            className="w-full dark:hidden"
            src={entry.product.image || 'https://via.placeholder.com/150'}
            alt={entry.product.name}
          />
          <img
            className="w-full hidden dark:block"
            src={entry.product.image || 'https://via.placeholder.com/150'}
            alt={entry.product.name}
          />
        </a>

        {/* Second Column: Product Info and Actions */}
        <div className="col-span-1 space-y-2 md:order-3 md:col-span-1">
          <p className="text-md !leading-5 font-medium text-gray-900 hover:underline dark:text-white">
            {entry.product.name}
          </p>

          <p className="flex flex-wrap items-center gap-2">
            <span className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {entry.box_customization?.selection_type === 'PICK_AND_MIX' && 'Pick & Mix'}
              {entry.box_customization?.selection_type === 'RANDOM' && 'Surprise Me'}
            </span>

            {entry.box_customization?.allergens?.map((allergen) => (
              <span
                key={allergen.id}
                className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
              >
                {allergen.name} Free
              </span>
            ))}
          </p>

          <p className="text-base font-bold text-gray-900 dark:text-white">
            ${entry.product.base_price}
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2 !mt-4">
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

          {/* Remove Button */}
          <div className="flex items-center !mt-4">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isLoading}
              className="flex items-center text-red-600 hover:text-red-800
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
            >
              <FiTrash2 className="w-4 h-4 mr-1.5" />
              <span className="text-sm font-medium">Remove</span>
            </button>
          </div>
        </div>

        {/* Third Column: Flavour Selection Grid */}
        <div className="col-span-2 md:order-2 md:col-span-1">
          {entry.box_customization?.selection_type === 'PICK_AND_MIX' && (
            <FlavourSelectionGrid
              flavours={entry.box_customization.flavor_selections || []}
              boxSize={boxSize}
            />
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
