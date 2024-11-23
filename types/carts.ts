import { Product } from '@/types/products';
import { Allergen } from '@/types/allergens';
import { Flavour } from '@/types/flavours';

export interface Cart {
    id: number;
    user?: number;
    session_id?: string;
    // discount?: Discount;
    gift_message?: string;
    shipping_date?: string;
    active: boolean;
    items: CartItem[];
    total: string;
    created?: string;
    updated?: string;
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
    id: number;
    box_customization: number;
    flavor: Flavour;
    quantity: number;
    created: string;
    updated: string;
}
