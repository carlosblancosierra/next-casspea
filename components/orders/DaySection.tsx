import React, { useState } from 'react';
import { Order } from '@/types/orders';
import { getDayTotals } from './ordersUtils';
import DayHeader from './DayHeader';
import OrderCard from './OrderCard';
import DaySummary from './DaySummary';

interface DaySectionProps {
  date: string;
  orders: Order[];
  onCreateShipping: (orderId: string) => void;
  onDownloadLabel: (orderId: string) => void;
}

const DaySection: React.FC<DaySectionProps> = ({
  date,
  orders,
  onCreateShipping,
  onDownloadLabel
}) => {
  const { dayTotal } = getDayTotals(orders);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <DayHeader
        date={date}
        orders={orders}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        dayTotal={dayTotal}
      />
      {isExpanded && (
        <div className="mt-4 space-y-4 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map(order => (
              <OrderCard
                key={order.order_id}
                order={order}
                onCreateShipping={onCreateShipping}
                onDownloadLabel={onDownloadLabel}
              />
            ))}
          </div>
          <DaySummary dateOrders={orders} />
        </div>
      )}
    </div>
  );
};

export default DaySection; 