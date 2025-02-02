import React, { useState } from 'react';
import { Order } from '@/types/orders';
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
      <DayHeader
        date={date}
        orders={orders}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="mt-4 space-y-4 px-1">
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
          <DaySummary orders={orders} />
        </div>
      )}
    </div>
  );
};

export default DaySection; 