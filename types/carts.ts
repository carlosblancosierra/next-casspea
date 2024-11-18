import { Product } from '@/types/products';
import { Allergen } from '@/types/allergens';
import { Flavour } from '@/types/flavours';

export interface Cart {
    id: number;
    items: CartItem[];
    total: number;
}

export interface CartItem {
    id: number;
    quantity: number;
    product: number;
    box_customization?: CartItemBoxCustomization;
}

export interface CartItemBoxCustomization {
    id: number;
    selection_type: 'RANDOM' | 'PICK_AND_MIX';
    allergens?: number[];
    flavor_selections?: CartItemBoxFlavorSelection[];
}

export interface CartItemBoxFlavorSelection {
    id: number;
    flavor: number;
    quantity: number;
}
