import React from 'react';
import CartItemTable from './CartItemTable';
import CartSummary from './CartSummary';
import CartCheckout from './CartCheckout';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import Spinner from '@/components/common/Spinner';
import Link from 'next/link';

const Cart: React.FC = () => {
  const { data: cart, isLoading, error } = useGetCartQuery();

  if (isLoading) {
    return (
      <div className=" dark:bg-gray-900 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(80vh)] flex items-center justify-center">
          <div className="flex items-center justify-center min-h-screen">
                <Spinner md />
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading cart</div>;
  }

  return (
    <div className=" dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {cart?.items && cart.items.length > 0 ? (
          <div className="md:grid md:grid-cols-[3fr,1fr] md:gap-8">
            <CartItemTable cartEntries={cart.items} />
            <CartCheckout />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(80vh)]">
            <p className="text-gray-500 dark:text-gray-400 text-center">Your cart is empty.</p>
            <Link
              href="/shop-now/"
              className="inline-flex items-center justify-center rounded-md bg-pink-600 px-4 py-3 text-sm font-semibold text-white"
            >
              <span>Keep Shopping</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
