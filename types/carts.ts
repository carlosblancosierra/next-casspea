import { Product } from '@/types/products';
import { Allergen } from '@/types/allergens';
import { Flavour } from '@/types/flavours';
import { Discount } from '@/types/discounts';

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


export interface CartItemBoxCustomization {
    id: number;
    cart_item: number;
    selection_type: 'RANDOM' | 'PICK_AND_MIX';
    allergens?: Allergen[];
    flavor_selections?: CartItemBoxFlavorSelection[];
    created?: string;
    updated?: string;
}

export interface CartItemPackCustomization {
    id: number;
    cart_item: number;
    selection_type: 'RANDOM' | 'PICK_AND_MIX';
    flavor_selections?: CartItemBoxFlavorSelection[];
    hot_chocolate?: number;
    chocolate_bark?: number;
    gift_card?: number;
}

export interface CartItemBoxFlavorSelectionRequest {
    flavor: number;  // Just the flavor ID
    quantity: number;
}

export interface CartItemRequest {
    product: number;
    quantity: number;
    box_customization?: {
        selection_type: 'PICK_AND_MIX' | 'RANDOM';
        allergens?: number[];
        flavor_selections?: CartItemBoxFlavorSelectionRequest[] | null;
    };
    pack_customization?: {
        selection_type: 'PICK_AND_MIX' | 'RANDOM';
        flavor_selections?: CartItemBoxFlavorSelectionRequest[] | null;
        hot_chocolate?: number;
        chocolate_bark?: number;
        gift_card?: number;
    };
}

export interface Cart {
    id: number;
    user?: number;
    session_id?: string;
    discount?: Discount;
    gift_message?: string | null;
    shipping_date?: string | null;
    pickup_date?: string | null;
    pickup_time?: string | null;
    items: CartItem[];
    base_total: string;
    discounted_total: string;
    total_savings: string;
    is_discount_valid: boolean;
    created: string;
    updated: string;
}

export interface CartItem {
    id: number;
    cart?: number;
    product: Product;
    quantity: number;
    box_customization?: CartItemBoxCustomization;
    base_price: string;
    discounted_price: string;
    savings: string;
    created: string;
    updated: string;
    pack_customization?: CartItemPackCustomization;
}

export interface CartItemBoxFlavorSelection {
    id?: number;
    flavor?: Flavour;
    quantity: number;
    flavor_name?: string; // for compatibility with new backend structure
}
