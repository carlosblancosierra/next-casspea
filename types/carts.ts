import { ProductType } from '@/types/products';
import { FlavourSelectionType } from '@/types/flavours';

export interface CartEntry {
    id: number;
    product: ProductType;
    quantity: number;
    active: boolean;
    flavours?: FlavourSelectionType[];
    selection?: 'RANDOM' | 'PICK';
    selectedAllergens?: string[];
}
