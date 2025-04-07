import React, { useState } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { CartItem as CartItemType } from '@/types/carts';
import FlavourSelectionGrid from './FlavourSelectionGrid';
import { useChangeCartItemQuantityMutation, useRemoveCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import { toast } from 'react-toastify';

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
      <div className="grid grid-cols-2 md:grid-cols-[1fr,3fr] gap-4 border border-gray-200 bg-main-bg p-4 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
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

            <p className="text-base font-bold text-gray-900 dark:text-white">£{entry.product.base_price}</p>

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

      {/* Updated Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-main-bg rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Remove Item
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Are you sure you want to remove {entry.product.name} from your cart?
                </p>
              </div>
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={() => {
                    handleRemove();
                    setIsDeleteModalOpen(false);
                  }}
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 mr-3"
                >
                  Yes, remove item
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  type="button"
                  className="text-gray-500 bg-main-bg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItem;
