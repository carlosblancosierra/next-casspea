import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectCart } from '@/redux/features/carts/cartSlice';

const CartSummary: React.FC = () => {
  const cart = useAppSelector(selectCart);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(parseFloat(value));
  };

  return (
    <div className="hidden md:block space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm
      dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <p className="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>

      <div className="space-y-4">
        <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">
            {/* {formatCurrency(cart.base_total)} */}
            {cart.base_total}
          </dd>
        </dl>

        {cart.discount && (
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
              Discount ({cart.discount.code})
            </dt>
            <dd className="text-base font-medium text-green-600">
              -{formatCurrency(cart.total_savings)}
            </dd>
          </dl>
        )}

        {/* Uncomment when shipping is implemented
        <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Shipping</dt>
          <dd className="text-base font-medium text-gray-900 dark:text-white">
            {formatCurrency('0')}
          </dd>
        </dl> */}
      </div>

      <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2
        dark:border-gray-700">
        <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
        <dd className="text-base font-bold text-gray-900 dark:text-white">
          {formatCurrency(cart.discounted_total)}
        </dd>
      </dl>
    </div>
  );
};

export default CartSummary;
