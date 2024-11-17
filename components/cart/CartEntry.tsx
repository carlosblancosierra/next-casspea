import React from 'react';
import { FiMinus, FiPlus, FiHeart, FiTrash2 } from 'react-icons/fi'; // Import icons
import { CartEntry as CartEntryType } from '@/types/carts';
import FlavourSelectionGrid from './FlavourSelectionGrid';

interface CartEntryProps {
  entry: CartEntryType;
}

const CartEntry: React.FC<CartEntryProps> = ({ entry }) => {
  const boxSize = entry.product.pieces; // Adjust based on your box size logic

  return (
    <div className="grid grid-cols-2 md:grid-cols-[1.5fr,1.5fr,2fr] gap-4 border border-gray-200 bg-white p-4 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      {/* First Column: Product Image */}
      <a href="#" className="col-span-1 md:col-span-1">
        <img
          className="w-full dark:hidden"
          src={entry.product.store_image || 'https://via.placeholder.com/150'}
          alt={entry.product.name}
        />
        <img
          className="w-full hidden dark:block"
          src={entry.product.store_image || 'https://via.placeholder.com/150'}
          alt={entry.product.name}
        />
      </a>

      {/* Second Column: Product Info and Actions */}
      <div className="col-span-1 space-y-4 md:order-3 md:col-span-1">
        <a href="#" className="text-base font-medium text-gray-900 hover:underline dark:text-white">
          {entry.product.name}
        </a>
        <p>
          <span className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {entry.product.category.name}
          </span>
        </p>
        <p>
          <span className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {entry.selection}
          </span>
        </p>
        <p>
          {entry.selectedAllergens?.map((allergen) => (
            <span
              key={allergen}
              className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-2"
            >
              {allergen}
            </span>
          ))}
        </p>

        <p className="text-base font-bold text-gray-900 dark:text-white">${entry.product.price}</p>

        <div className="flex items-center justify-between">
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
        </div>

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
      <div className="col-span-2 md:order-2 px-6 md:col-span-1">
        {entry.flavours && (
          <FlavourSelectionGrid flavours={entry.flavours} boxSize={boxSize} />
        )}
      </div>
    </div>
  );
};

export default CartEntry;
