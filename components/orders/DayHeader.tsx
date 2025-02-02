import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { formatCurrency } from './ordersUtils';
import { Order } from '@/types/orders';

interface DayHeaderProps {
  date: string;
  orders: Order[];
  isExpanded: boolean;
  onToggle: () => void;
}

const DayHeader: React.FC<DayHeaderProps> = ({ date, orders, isExpanded, onToggle }) => {
  const totalSales = orders.reduce(
    (sum, order) => sum + order.checkout_session.total_with_shipping,
    0
  );

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1">
        <ChevronRightIcon
          className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`}
        />
        <span className="font-semibold text-gray-900 dark:text-gray-100">{date}</span>
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            {orders.length} orders
          </span>
          <span className="flex items-center gap-1">
            {formatCurrency(totalSales)}
          </span>
        </div>
      </div>
      <div className="sm:hidden flex flex-col items-end text-sm text-gray-500 dark:text-gray-400">
        <span>{orders.length} orders</span>
        <span>{formatCurrency(totalSales)}</span>
      </div>
    </button>
  );
};

export default DayHeader; 