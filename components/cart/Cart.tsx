import React from 'react';
import CartItemTable from './CartItemTable';
import CartSummary from './CartSummary';
import CartCheckout from './CartCheckout';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import Spinner from '@/components/common/Spinner';

const Cart: React.FC = () => {
  const { data: cart, isLoading, error } = useGetCartQuery();

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(80vh)] flex items-center justify-center">
          <Spinner className="mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading cart</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {cart?.items && cart.items.length > 0 ? (
          <div className="space-y-8">
            <CartItemTable cartEntries={cart.items} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CartSummary />
              <CartCheckout />
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
