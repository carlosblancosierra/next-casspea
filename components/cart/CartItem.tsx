import React from 'react';
import { FiMinus, FiPlus, FiHeart, FiTrash2 } from 'react-icons/fi'; // Import icons
import { CartItem as CartItemType } from '@/types/carts';
import FlavourSelectionGrid from './FlavourSelectionGrid';

interface CartItemProps {
  entry: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ entry }) => {
  const boxSize = entry.product.units_per_box;

  return (
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
        {/* <p>
          <span className="items-center text-xs font-medium text-gray-900 hover:underline dark:text-gray-300">
            {entry.product.category?.name}
          </span>
        </p> */}

        <p
          className="text-md !leading-5 font-medium text-gray-900 hover:underline dark:text-white"
        >
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

        <p className="text-base font-bold text-gray-900 dark:text-white">${entry.product.base_price}</p>

        {/* <div className="flex items-center justify-between !mt-1">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <FiMinus className="text-gray-900 dark:text-white" />
            </button>
            <input
              type="text"
              className="w-10 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none dark:text-white"
              value={entry.quantity}
              readOnly
            />
            <button
              type="button"
              className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <FiPlus className="text-gray-900 dark:text-white" />
            </button>
          </div>
        </div> */}

        <div className="flex items-center gap-4">
          {/* <button
            type="button"
            className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
          >
            <FiTrash2 className="mr-1.5 h-5 w-5" />
            Remove
          </button> */}
        </div>
      </div>

      {/* Third Column: Flavour Selection Grid */}
      <div className="col-span-2 md:order-2 md:col-span-1">
        {entry.box_customization?.selection_type == 'PICK_AND_MIX' && (
          <FlavourSelectionGrid flavours={entry.box_customization.flavor_selections || []} boxSize={boxSize} />
        )}
      </div>
    </div>
  );
};

export default CartItem;
