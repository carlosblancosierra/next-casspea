import { Address } from "./addresses";
import { CartItem } from "./carts";

export interface Order {
  order_id: string;
  shipping_order_id?: string;
  tracking_number?: string;
  status: string;
  created: string;
  updated: string;
  shipped?: string;
  delivered?: string;
  checkout_session: {
    payment_status: string;
    shipping_address: Address;
    shipping_option: {
      id: number;
      name: string;
      price: string;
    };
    total_with_shipping: number;
    cart: {
      items: CartItem[];
      discount?: string | null;
      gift_message?: string | null;
      shipping_date?: string | null;
      discounted_total: string;
    };
  };
  past_orders?: string[];
}