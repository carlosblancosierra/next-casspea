import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCart } from '@/redux/features/carts/cartSlice';

const CartSummary: React.FC = () => {
  const cart = useAppSelector(selectCart);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <p className="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>

      <div className="space-y-4">
        <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">${cart?.total}</dd>
        </dl>

        <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
          <dd className="text-base font-medium text-green-600">-$0.00</dd>
        </dl>

        {/* <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Shipping</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">$0.00</dd>
        </dl> */}
      </div>

      <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
        <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
        <dd className="text-base font-bold text-gray-900 dark:text-white">${cart?.total}</dd>
      </dl>

      <a
        href="#"
        className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700"
      >
        Proceed to Checkout
      </a>
    </div>
  );
};

export default CartSummary;
