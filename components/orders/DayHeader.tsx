import React from 'react';
import { ChevronRightIcon, DocumentTextIcon, CurrencyPoundIcon } from '@heroicons/react/20/solid';
import { formatCurrency } from './ordersUtils';
import { Order } from '@/types/orders';

interface DayHeaderProps {
  date: string;
  orders: Order[];
  isExpanded: boolean;
  onToggle: () => void;
  dayTotal: number;
}

const DayHeader: React.FC<DayHeaderProps> = ({ date, orders, isExpanded, onToggle, dayTotal }) => {
  const totalSales = orders.reduce((sum, order) => {
    const amount = order.checkout_session?.total_with_shipping || 0;
    return sum + amount;
  }, 0);

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 text-left p-4 bg-main-bg dark:bg-main-bg-dark rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1">
        <ChevronRightIcon
          className={`h-5 w-5 text-primary-text transition-transform ${isExpanded ? 'transform rotate-90' : ''}`}
        />
        <span className="font-semibold text-primary-text dark:text-primary-text">{date}</span>
        <div className="hidden sm:flex items-center gap-4 text-sm text-primary-text dark:text-primary-text">
          <span className="flex items-center gap-1">
            <DocumentTextIcon className="h-4 w-4" />
            {orders.length} orders
          </span>
          <span className="flex items-center gap-1">
            <CurrencyPoundIcon className="h-4 w-4" />
            {formatCurrency(totalSales.toString())}
          </span>
        </div>
      </div>
      <div className="sm:hidden flex flex-col items-end text-sm text-primary-text dark:text-primary-text">
        <span>{orders.length} orders</span>
        <span>{formatCurrency(totalSales.toString())}</span>
      </div>
    </button>
  );
};

export default DayHeader; 