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
