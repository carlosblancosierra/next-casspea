import React from 'react';
import CartEntry from './CartEntry';
import { CartEntry as CartEntryType } from '@/types/carts';

interface CartEntryTableProps {
  cartEntries: CartEntryType[];
}

const CartEntryTable: React.FC<CartEntryTableProps> = ({ cartEntries }) => {
  return (
    <div className="space-y-6">
      {cartEntries.length > 0 ? (
        cartEntries.map((entry) => <CartEntry key={entry.id} entry={entry} />)
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartEntryTable;
