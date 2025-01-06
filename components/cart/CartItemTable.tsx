import React from 'react';
import CartItem from '@/components/cart/CartItem';
import { CartItem as CartItemType } from '@/types/carts';
import Link from 'next/link';

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
      <Link href="/store" className="text-blue-500 hover:underline bg-pink-500 px-4 py-2 rounded-md">
        Keep Shopping
      </Link>
    </div>
  );
};

export default CartItemTable;
