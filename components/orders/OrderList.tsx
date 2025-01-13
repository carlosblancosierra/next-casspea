import { useGetOrdersQuery, OrdersQueryParams } from '@/redux/features/orders/ordersApiSlice';
import { Address } from '@/types/addresses';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon, DocumentTextIcon, CurrencyPoundIcon } from '@heroicons/react/20/solid';

interface FlavorSelection {
    flavor_name?: string;
    quantity?: number;
}

interface BoxCustomization {
    selection_type?: string;
    allergens?: number[];
    flavor_selections?: FlavorSelection[];
}

interface CartItem {
    product?: string;
    quantity?: number;
    box_customization?: BoxCustomization;
}

interface Order {
    order_id?: string;
    created?: string;
    checkout_session?: {
        payment_status?: string;
        shipping_address?: Address;
        cart?: {
            items?: CartItem[];
            discount?: string | null;
            gift_message?: string | null;
            shipping_date?: string | null;
            discounted_total?: string;
        };
    };
}

const formatDate = (dateString?: string): { date: string, time: string } => {
    if (!dateString) return { date: '-', time: '-' };
    try {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-GB'),
            time: date.toLocaleTimeString('en-GB')
        };
    } catch (error) {
        console.error('Date formatting error:', error);
        return { date: '-', time: '-' };
    }
};

const formatCurrency = (amount?: string): string => {
    if (!amount) return '£0.00';
    try {
        return `£${parseFloat(amount).toFixed(2)}`;
    } catch (error) {
        console.error('Currency formatting error:', error);
        return '£0.00';
    }
};

const getDayTotals = (orders: Order[]) => {
    const products: Record<string, number> = {};
    const flavors: Record<string, number> = {};
    const randomBoxes: Record<string, number> = {};

    orders.forEach(order => {
        order.checkout_session?.cart?.items?.forEach(item => {
            const boxCustomization = item.box_customization;
            const quantity = item.quantity || 1;
            const productName = item.product?.name || 'Unknown Product';
            const chocolatesPerBox = item.product?.units_per_box || 0;
            const totalChocolates = chocolatesPerBox * quantity;

            // Product counting
            products[productName] = (products[productName] || 0) + quantity;

            if (boxCustomization?.selection_type === 'RANDOM') {
                // Handle random boxes with allergens
                if (boxCustomization.allergens && boxCustomization.allergens.length > 0) {
                    // Convert allergen IDs to names (you'll need to provide the mapping)
                    const allergenNames = boxCustomization.allergens
                        .map(id => getAllergenName(id))
                        .sort()
                        .join(' and ');
                    const key = `Random (${allergenNames} Free)`;
                    randomBoxes[key] = (randomBoxes[key] || 0) + totalChocolates;
                } else {
                    // No allergens
                    randomBoxes['Random'] = (randomBoxes['Random'] || 0) + totalChocolates;
                }
            } else if (boxCustomization?.selection_type === 'PICK_AND_MIX') {
                // Flavor counting for pick & mix boxes
                boxCustomization?.flavor_selections?.forEach(flavor => {
                    if (flavor.flavor_name && flavor.quantity) {
                        flavors[flavor.flavor_name] = (flavors[flavor.flavor_name] || 0) +
                            (flavor.quantity * quantity);
                    }
                });
            }
        });
    });

    return { products, flavors, randomBoxes };
};

// Helper function to convert allergen IDs to names
const getAllergenName = (id: number): string => {
    const allergenMap: Record<number, string> = {
        1: 'Gluten',
        2: 'Nut',
        3: 'Dairy'
        // Add other allergen mappings as needed
    };
    return allergenMap[id] || 'Unknown';
};

const formatSelectionType = (type?: string): string => {
    switch (type) {
        case 'RANDOM':
            return 'Surprise Me';
        case 'PICK_AND_MIX':
            return 'Pick & Mix';
        default:
            return type || 'Not specified';
    }
};

const formatShippingAddress = (address?: Address): string => {
    if (!address) return '-';
    const parts = [
        `${address.first_name} ${address.last_name}`,
        address.phone,
        address.street_address,
        address.street_address2,
        [address.city, address.county, address.postcode].filter(Boolean).join(', ')
    ].filter(Boolean);

    return parts.join(' • ');
};

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

const OrderCard = ({ order }: { order: Order }) => {
    const { date, time } = formatDate(order.created);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0 flex items-center gap-2">
                        {order.order_id}
                        <PaymentStatus status={order.checkout_session?.payment_status} />
                    </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">{time}</dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Items</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                        {order.checkout_session?.cart?.items?.map((item, index) => (
                            <div key={index} className="mb-2">
                                <div className="font-medium">{item.product} (x{item.quantity})</div>
                                {item.box_customization && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatSelectionType(item.box_customization.selection_type)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                        <ShippingBadge date={order.checkout_session?.cart?.shipping_date} />
                    </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                        {formatShippingAddress(order.checkout_session?.shipping_address)}
                    </dd>
                </div>

                {order.checkout_session?.cart?.discount && (
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                            {order.checkout_session.cart.discount}
                        </dd>
                    </div>
                )}

                {order.checkout_session?.cart?.gift_message && (
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Gift Message</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                            {order.checkout_session.cart.gift_message}
                        </dd>
                    </div>
                )}
            </dl>
        </div>
    );
};

const DayHeader = ({
    date,
    orders,
    isExpanded,
    onToggle
}: {
    date: string;
    orders: Order[];
    isExpanded: boolean;
    onToggle: () => void;
}) => {
    const totalSales = orders.reduce((sum, order) => {
        const amount = order.checkout_session?.cart?.discounted_total || '0';
        return sum + parseFloat(amount);
    }, 0);

    return (
        <button
            onClick={onToggle}
            className="w-full flex items-center gap-4 text-left p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
            <div className="flex items-center gap-3 flex-1">
                <ChevronRightIcon
                    className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-90' : ''
                        }`}
                />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {date}
                </span>
                <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
            <div className="sm:hidden flex flex-col items-end text-sm text-gray-500 dark:text-gray-400">
                <span>{orders.length} orders</span>
                <span>{formatCurrency(totalSales.toString())}</span>
            </div>
        </button>
    );
};

const DaySection = ({ date, orders }: { date: string; orders: Order[] }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mb-4">
            <DayHeader
                date={date}
                orders={orders}
                isExpanded={isExpanded}
                onToggle={() => setIsExpanded(!isExpanded)}
            />

            {isExpanded && (
                <div className="mt-4 space-y-4 pl-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {orders.map((order: Order) => (
                            <OrderCard key={order.order_id} order={order} />
                        ))}
                    </div>
                    <DaySummary dateOrders={orders} />
                </div>
            )}
        </div>
    );
};

const DaySummary = ({ dateOrders }: { dateOrders: Order[] }) => {
    const { products, flavors, randomBoxes } = getDayTotals(dateOrders);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-4">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Day Summary</h3>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
                <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Products Section */}
                    <div className="px-4 py-5 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Products</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {Object.entries(products).map(([name, qty]) => (
                                    <div key={name}>
                                        {name}: {qty}
                                    </div>
                                ))}
                            </div>
                        </dd>
                    </div>

                    {/* Pick & Mix Flavors Section */}
                    {Object.keys(flavors).length > 0 && (
                        <div className="px-4 py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pick & Mix Flavors</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {Object.entries(flavors).map(([name, qty]) => (
                                        <div key={name}>
                                            {name}: {qty}
                                        </div>
                                    ))}
                                </div>
                            </dd>
                        </div>
                    )}

                    {/* Random Boxes Section */}
                    {Object.keys(randomBoxes).length > 0 && (
                        <div className="px-4 py-5 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Other Flavors</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {Object.entries(randomBoxes).map(([key, qty]) => (
                                        <div key={key}>
                                            {key === 'Random'
                                                ? `Random: ${qty}`
                                                : `${key}: ${qty}`}
                                        </div>
                                    ))}
                                </div>
                            </dd>
                        </div>
                    )}
                </dl>
            </div>
        </div>
    );
};

export default function OrderList() {
    const [filters, setFilters] = useState<OrdersQueryParams>({});
    const { data: orders, isLoading, error } = useGetOrdersQuery(filters);

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
        </div>
    );

    if (error) return (
        <div className="text-center text-red-600 dark:text-red-400">
            Error loading orders
        </div>
    );

    if (!orders?.length) return (
        <div className="text-center text-gray-500 dark:text-gray-400">
            No orders found
        </div>
    );

    const groupedOrders = orders.reduce<Record<string, Order[]>>((acc, order: Order) => {
        const dateStr = formatDate(order.created).date;
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(order);
        return acc;
    }, {});

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-4">
                {Object.entries(groupedOrders)
                    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                    .map(([date, dateOrders]) => (
                        <DaySection key={date} date={date} orders={dateOrders} />
                    ))}
            </div>
        </div>
    );
}
