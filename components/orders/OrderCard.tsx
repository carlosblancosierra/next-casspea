import React from 'react';
import { Order } from '@/types/orders';
import { formatDate, formatSelectionType, formatShippingAddress } from './ordersUtils';

interface OrderCardProps {
  order: Order;
  onCreateShipping: (orderId: string) => void;
  onDownloadLabel: (orderId: string) => void;
}

const PaymentStatus = ({ status }: { status?: string }) => {
  if (status === 'paid') return null;
  return (
    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
      UNPAID
    </span>
  );
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onCreateShipping, onDownloadLabel }) => {
  const { time } = formatDate(order.created);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden p-4">
      {/* Order Info */}
      <div className="mb-2">
        <div className="text-sm font-bold">Order ID: {order.order_id}</div>
        <div className="text-sm text-gray-600">Order Time: {time}</div>
        <PaymentStatus status={order.checkout_session?.payment_status} />
      </div>

      {/* Delivery Address & Shipping Option */}
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        Delivery Address: {formatShippingAddress(order.checkout_session?.shipping_address)}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        Shipping Option: {order.checkout_session.shipping_option.name} - £{order.checkout_session.shipping_option.price}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        Order Total: £{order.checkout_session.total_with_shipping.toFixed(2)}
      </div>

      {/* Shipping Order Actions */}
      <div className="flex gap-2 mt-4">
        {order.shipping_order_id ? (
          <button
            onClick={() => onDownloadLabel(order.order_id)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded"
            disabled={false}
          >
            Download Label
          </button>
        ) : (
          <button
            onClick={() => onCreateShipping(order.order_id)}
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-2 rounded"
            disabled={false}
          >
            Create Shipping Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard; 