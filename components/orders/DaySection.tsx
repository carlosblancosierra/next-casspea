import React, { useState } from 'react';
import { Order } from '@/types/orders';
import { getDayTotals } from './ordersUtils';
import DayHeader from './DayHeader';
import OrderCard from './OrderCard';
import DaySummary from './DaySummary';
import { Product } from '@/types/products';
interface DaySectionProps {
  date: string;
  orders: Order[];
  onCreateShipping: (orderId: string) => void;
  onDownloadLabel: (orderId: string) => void;
  products: Product[];
}

const DaySection: React.FC<DaySectionProps> = ({
  date,
  orders,
  onCreateShipping,
  onDownloadLabel,
  products
}) => {
  const { dayTotal } = getDayTotals(orders);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="main-bg dark:bg-main-bg-dark rounded-lg shadow">
      <DayHeader
        date={date}
        orders={orders}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        dayTotal={dayTotal}
      />
      {isExpanded && (
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map(order => (
              <OrderCard
                key={order.order_id}
                order={order}
                onCreateShipping={onCreateShipping}
                onDownloadLabel={onDownloadLabel}
                products={products}
              />
            ))}
          </div>
          <DaySummary dateOrders={orders} products={products} />
        </div>
      )}
    </div>
  );
};

export default DaySection; 