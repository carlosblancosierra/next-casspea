import React from 'react';
import CartItem from '@/components/cart/CartItem';
import { CartItem as CartItemType } from '@/types/carts';

interface CartItemTableProps {
  cartEntries: CartItemType[];
}

const CartItemTable: React.FC<CartItemTableProps> = ({ cartEntries }) => {
  return (
    <div className="space-y-6">
      {cartEntries.length > 0 ? (
        cartEntries.map((entry) => <CartItem key={entry.id} entry={entry} />)
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center"></p>
      )}
    </div>
  );
};

export default CartItemTable;
