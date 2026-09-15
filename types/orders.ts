import { Address } from "./addresses";
import { CartItem } from "./carts";

// Matches the backend OrderListSerializer / CheckoutSessionSerializer.
export interface OrderShippingOption {
    id: number;
    name: string;
    price: string;
}

export interface OrderCart {
    items: CartItem[];
    discount?: string | null;
    gift_message?: string | null;
    shipping_date?: string | null;
    discounted_total: string;
    pickup_date?: string | null;
    pickup_time?: string | null;
}

export interface OrderCheckoutSession {
    payment_status: string;
    shipping_address: Address;
    shipping_option: OrderShippingOption;
    // Serialized from a SerializerMethodField returning a Decimal, which
    // DRF renders as a JSON number today — unlike the sibling price
    // fields, which are decimal strings. Typed as a union so the UI keeps
    // working if the backend is normalized to strings later.
    total_with_shipping: string | number;
    cart: OrderCart;
}

export interface Order {
    order_id: string;
    shipping_order_id?: string;
    tracking_number?: string;
    status: string;
    created: string;
    updated: string;
    shipped?: string;
    delivered?: string;
    checkout_session: OrderCheckoutSession;
    past_orders?: string[];
}

/** One row of GET /api/orders/summary/ — deliberately shallow. */
export interface OrderSummary {
    order_id: string;
    created: string;
    status: string;
    payment_status: string;
    customer_name: string;
    email: string;
    total_with_shipping: string | number;
    shipping_date?: string | null;
    shipping_option_name?: string | null;
    tracking_number?: string | null;
    shipping_order_id?: string | null;
    item_count: number;
}

/** DRF PageNumberPagination envelope. */
export interface Paginated<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
