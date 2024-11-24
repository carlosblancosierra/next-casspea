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
    flavor: number; // ID of the flavor
    quantity: number; // Quantity of the flavor
}

export interface CartItemRequest {
    product: number; // Product ID
    quantity: number; // Quantity of the product
    box_customization?: {
        selection_type: 'PICK_AND_MIX' | 'RANDOM'; // Type of selection
        allergens?: number[]; // Array of allergen IDs
        flavor_selections?: CartItemBoxFlavorSelection[]; // Optional flavor selections
    };
}
