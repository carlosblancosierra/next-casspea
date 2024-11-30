import { Product } from '@/types/products';
import { Allergen } from '@/types/allergens';
import { Flavour } from '@/types/flavours';
import { Discount } from '@/types/discounts';

export interface Cart {
    id: number;
    user?: number;
    session_id?: string;
    discount?: Discount;
    gift_message?: string;
    shipping_date?: string;
    active: boolean;
    items: CartItem[];
    total: string;
    created?: string;
    updated?: string;
}

export interface CartUpdate {
    gift_message?: string;
    shipping_date?: string;
    discount_code?: string;
    remove_discount?: boolean;
}

export interface CartUpdateResponse {
    details: string;
    cart: Cart;
}

export interface CartItem {
    id: number;
    cart?: number;
    product: Product;
    quantity: number;
    box_customization?: CartItemBoxCustomization;
    created: string;
    updated: string;
}

export interface CartItemBoxCustomization {
    id: number;
    cart_item: number;
    selection_type: 'RANDOM' | 'PICK_AND_MIX';
    allergens?: Allergen[];
    flavor_selections?: CartItemBoxFlavorSelection[];
    created?: string;
    updated?: string;
}

export interface CartItemBoxFlavorSelection {
    flavor: Flavour;
    quantity: number; // Quantity of the flavor
}

export interface CartItemRequest {
    product: number; // Product ID
    quantity: number; // Quantity of the product
    box_customization?: {
        selection_type: 'PICK_AND_MIX' | 'RANDOM';
        allergens?: number[];
        flavor_selections?: CartItemBoxFlavorSelection[];
    };
}
