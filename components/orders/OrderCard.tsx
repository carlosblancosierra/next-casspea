import React, { useState } from 'react';
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

const ShippingBadge = ({ date }: { date?: string | null }) => {
  if (!date) {
    return (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
        ASAP
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/30">
      {new Date(date).toLocaleDateString()}
    </span>
  );
};

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
      {status || 'Unknown'}
    </span>
  );
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onCreateShipping, onDownloadLabel }) => {
  const { time } = formatDate(order.created);
  const [openFlavors, setOpenFlavors] = useState<Record<number, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
      {/* Header with Order ID and Status */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Order Details
          </h3>
          <PaymentStatus status={order.checkout_session?.payment_status} />
        </div>
      </div>
      {/* Order Details */}
      <div className="border-t border-gray-100 dark:border-gray-700">
        <dl className="divide-y divide-gray-100 dark:divide-gray-700">
          {/* Order ID */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Order ID</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              {order.order_id}
            </dd>
          </div>
          {/* Order Time */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Order Time</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              {time}
            </dd>
          </div>
          {/* Items Section */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Items</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              {order.checkout_session?.cart?.items?.map((item, index) => (
                <div key={index} className="mb-2">
                  <div className="font-medium">
                    {item.product?.name} {item.quantity && `(x${item.quantity})`}
                  </div>
                  {item.box_customization && (
                    <div className="text-sm text-gray-500">
                      {formatSelectionType(item.box_customization.selection_type)}
                    </div>
                  )}
                  {/* Flavours */}
                  <div className="flex flex-col">
                    <button
                      onClick={() =>
                        setOpenFlavors(prev => ({
                          ...prev,
                          [item.product?.id || 0]:
                            !prev[item.product?.id || 0]
                        }))
                      }
                      className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-1"
                    >
                      Flavors {openFlavors[item.product?.id || 0] ? '▼' : '▶'}
                    </button>
                    {openFlavors[item.product?.id || 0] &&
                      item.box_customization?.flavor_selections?.map((flavor, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-500 pl-4 flex justify-between"
                        >
                          <span>{flavor.flavor_name}</span>
                          <span className="text-gray-400">×{flavor.quantity}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </dd>
          </div>
          {/* Shipping Date */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Shipping Date</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              <ShippingBadge date={order.checkout_session?.cart?.shipping_date} />
            </dd>
          </div>
          {/* Shipping Address */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Delivery Address</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              {formatShippingAddress(order.checkout_session?.shipping_address)}
            </dd>
          </div>
          {/* Discount if present */}
          {order.checkout_session?.discount && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Discount Applied</dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                {order.checkout_session.discount}
              </dd>
            </div>
          )}
          {/* Email */}
          {order.checkout_session?.email && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Email</dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                {order.checkout_session.email}
              </dd>
            </div>
          )}
          {/* Gift Message if present */}
          {order.checkout_session?.cart?.gift_message && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Gift Message</dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                {order.checkout_session.cart.gift_message}
              </dd>
            </div>
          )}
          {/* Shipping Option */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Shipping Option</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              {order.checkout_session.shipping_option.name} - £{order.checkout_session.shipping_option.price}
            </dd>
          </div>
          {/* Order Total */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 bg-gray-50 dark:bg-gray-900">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Order Total</dt>
            <dd className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              £{order.checkout_session.total_with_shipping.toFixed(2)}
            </dd>
          </div>
          {/* Shipping Actions */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Shipping</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0 flex gap-2">
              {order.shipping_order_id ? (
                <button
                  onClick={() => onDownloadLabel(order.order_id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded"
                >
                  Download Label
                </button>
              ) : (
                <button
                  onClick={async () => {
                    if (isCreating) return;
                    setIsCreating(true);
                    try {
                      await onCreateShipping(order.order_id);
                      window.location.reload();
                    } catch (error) {
                      setIsCreating(false);
                    }
                  }}
                  disabled={isCreating}
                  className={`bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-2 rounded ${
                    isCreating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isCreating ? 'Creating...' : 'Create Shipping Order'}
                </button>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default OrderCard; 