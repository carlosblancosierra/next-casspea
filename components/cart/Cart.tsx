import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCartEntries } from '@/redux/features/carts/cartSlice';
import CartItemTable from './CartItemTable';
import CartSummary from './CartSummary';
import CartCheckout from './CartCheckout';

const Cart: React.FC = () => {
  const cartEntries = useAppSelector(selectCartEntries);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <CartItemTable cartEntries={cartEntries} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CartSummary />
            <CartCheckout />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
