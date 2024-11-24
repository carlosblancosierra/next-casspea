import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import selectCartEntries from '@/redux/features/carts/cartSlice';
import CartItemTable from './CartItemTable';
import CartSummary from './CartSummary';

const Cart: React.FC = () => {
  const cartEntries = useAppSelector(selectCartEntries);

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-2xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Shopping Cart</h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          {/* Cart Entries */}
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-6xl">
            <CartItemTable cartEntries={cartEntries} />
          </div>

          {/* Order Summary */}
          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <CartSummary cartEntries={cartEntries} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
