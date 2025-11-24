import React, { useState } from 'react';
import { PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { Order } from '@/types/orders';
import { formatDate, formatSelectionType, formatShippingAddress } from './ordersUtils';
import { Product } from '@/types/products';
import { useSendTrackingCodeMailMutation } from '@/redux/features/orders/ordersApiSlice';
import { toast } from 'react-toastify';

const getCustomization = (boxCustomization: any, packCustomization: any) =>
  boxCustomization ?? packCustomization;

const AllergenBadges: React.FC<{ allergens?: { id: number; name: string }[] }> = ({ allergens }) => {
  if (!allergens || allergens.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {allergens.map((allergen) => (
        <span
          key={allergen.id}
          className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-orange-600 ring-1 ring-inset ring-orange-500/10"
        >
          {allergen.name} Free
        </span>
      ))}
    </div>
  );
};

const FlavorSection: React.FC<{ flavorSelections?: { flavor_name: string; quantity: number }[] }> = ({
  flavorSelections,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!flavorSelections || flavorSelections.length === 0) return null;
  return (
    <div className="flex flex-col mt-2">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-1"
      >
        Flavours {isOpen ? '▼' : '▶'}
      </button>
      {isOpen &&
        flavorSelections.map((flavor, i) => (
          <div key={i} className="text-sm text-gray-500 pl-4 flex justify-between">
            <span>{flavor.flavor_name || 'Unknown Flavour'}</span>
            <span className="text-gray-400">×{flavor.quantity}</span>
          </div>
        ))}
    </div>
  );
};

const BoxCustomizationExtras: React.FC<{ customization: any, products: Product[] }> = ({ customization, products }) => {
  if (!customization) return null;
  const { hot_chocolate, chocolate_bark, gift_card } = customization;
  if (!hot_chocolate && !chocolate_bark && !gift_card) return null;

  const getProductName = (id: number, defaultName: string) => {
    const prod = products.find(p => p.id === id);
    return prod ? prod.name : defaultName;
  };

  return (
    <div className="mt-2 flex flex-col">
      {hot_chocolate ? (
        <div className="text-sm text-gray-500">
          Hot Chocolate: {getProductName(hot_chocolate, "Hot Chocolate")}
        </div>
      ) : null}
      {chocolate_bark ? (
        <div className="text-sm text-gray-500">
          Chocolate Bark: {getProductName(chocolate_bark, "Chocolate Bark")}
        </div>
      ) : null}
      {gift_card ? (
        <div className="text-sm text-gray-500">
          Gift Card: {getProductName(gift_card, "Gift Card")}
        </div>
      ) : null}
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  onCreateShipping: (orderId: string) => void;
  onDownloadLabel: (orderId: string) => void;
  products: Product[];
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

const OrderCard: React.FC<OrderCardProps> = ({ order, onCreateShipping, onDownloadLabel, products }) => {
  const { time } = formatDate(order.created);
  const [isCreating, setIsCreating] = useState(false);
  const [sendTrackingCodeMail, { isLoading: sendingTrackingMail }] = useSendTrackingCodeMailMutation();

  const handleSendTrackingMail = async () => {
    try {
      await sendTrackingCodeMail({ order_id: order.order_id }).unwrap();
      toast.success('Tracking code email sent successfully!');
    } catch (error) {
      console.error('Failed to send tracking code email:', error);
      toast.error('Failed to send tracking code email');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-main-bg-dark rounded-lg shadow-sm overflow-hidden">
      {/* Header with Order ID and Status */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Order Details
        </h3>
        <PaymentStatus status={order.checkout_session?.payment_status} />
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
              {order.checkout_session?.cart?.items?.map((item, index) => {
                const customization = getCustomization(item.box_customization, item.pack_customization);
                return (
                  <div key={index} className="mb-2">
                    <div className="font-medium">
                      {item.product?.name || 'Unknown Product'} {item.quantity && `(x${item.quantity})`}
                    </div>
                    {customization && (
                      <div className="text-sm text-gray-500">
                        {formatSelectionType(customization.selection_type)}
                      </div>
                    )}
                    <AllergenBadges allergens={customization?.allergens} />
                    <FlavorSection flavorSelections={customization?.flavor_selections} />
                    {item.pack_customization && <BoxCustomizationExtras customization={item.pack_customization} products={products} />}
                  </div>
                );
              })}
            </dd>
          </div>
          {/* Shipping Date */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Shipping Date</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              <ShippingBadge date={order.checkout_session?.cart?.shipping_date} />
            </dd>
          </div>
          {/* Pickup Date & Time if present */}
          {order.checkout_session?.cart?.pickup_date && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Pickup Date</dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                {order.checkout_session.cart.pickup_date}
                {order.checkout_session.cart.pickup_time && (
                  <> at {order.checkout_session.cart.pickup_time}</>
                )}
              </dd>
            </div>
          )}
          {/* Shipping Address */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Delivery Address</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              {formatShippingAddress(order.checkout_session?.shipping_address)}
            </dd>
          </div>
          {/* Discount if present */}
          {order.checkout_session?.cart?.discount && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">
                Discount Applied
              </dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                {order.checkout_session.cart.discount}
              </dd>
            </div>
          )}
          {/* Gift Message if present */}
          {order.checkout_session?.cart?.gift_message && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">
                Gift Message
              </dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                {order.checkout_session.cart.gift_message}
              </dd>
            </div>
          )}
          {/* Shipping Option */}
          {order.checkout_session?.shipping_option && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Shipping Option</dt>
              <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
                {order.checkout_session.shipping_option.name} - £{order.checkout_session.shipping_option.price}
              </dd>
            </div>
          )}
          {/* Order Total */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 bg-gray-50 dark:bg-main-bg-dark">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Order Total</dt>
            <dd className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              £{order.checkout_session.total_with_shipping.toFixed(2)}
            </dd>
          </div>

          {/* Customer Orders Summary */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">Customer Orders</dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              {order.past_orders && order.past_orders.length > 0
                ? `${order.past_orders.length + 1} total orders, past: (${order.past_orders.join(', ')})`
                : '1 total order, no past orders'}
            </dd>
          </div>

          {/* Shipping Details & Actions */}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-900 dark:text-gray-200">
              Shipping Details
            </dt>
            <dd className="mt-1 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2 sm:mt-0">
              {order.shipping_order_id ? (
                <div className="space-y-3">
                  {/* Shipping Order ID */}
                  <div>
                    <span className="font-medium">Shipping Order ID: </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {order.shipping_order_id}
                    </span>
                  </div>

                  {/* Tracking Number if available */}
                  {order.tracking_number && (
                    <div>
                      <span className="font-medium">Tracking Number: </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {order.tracking_number}
                      </span>
                    </div>
                  )}

                  {/* Actions: Download Label, Track Package, and Send Tracking Code Mail */}
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={() => onDownloadLabel(order.order_id)}
                      className="w-full inline-flex items-center gap-1 px-3 py-2 rounded bg-main-bg dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      Download Label
                    </button>
                    {order.tracking_number && (
                      <a
                        href={`https://www.royalmail.com/track-your-item#/tracking-results/${order.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center gap-1 px-3 py-2 rounded bg-blue-50 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                      >
                        Track Package
                      </a>
                    )}
                    <button
                      onClick={handleSendTrackingMail}
                      disabled={sendingTrackingMail}
                      className="w-full inline-flex items-center gap-1 px-3 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      {sendingTrackingMail ? 'Sending...' : 'Send Tracking Code Mail'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (isCreating) return;
                      setIsCreating(true);
                      try {
                        await onCreateShipping(order.order_id);
                      } finally {
                        setIsCreating(false);
                      }
                    }}
                    disabled={isCreating}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-main-bg dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                      isCreating ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <PlusIcon className="h-5 w-5" />
                    {isCreating ? 'Creating...' : 'Create Shipping Order'}
                  </button>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No shipping order created yet
                  </p>
                </div>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default OrderCard; 