import { Product } from './products';

export const DISCOUNT_TYPES = {
    PERCENTAGE: 'PERCENTAGE',
    FIXED_AMOUNT: 'FIXED_AMOUNT'
} as const;

export type DiscountType = typeof DISCOUNT_TYPES[keyof typeof DISCOUNT_TYPES];

export interface Discount {
    id: string;
    title: string;
    code: string;
    stripe_id: string;
    discount_type: DiscountType;
    amount: number;
    exclusions: Product[];
    active: boolean;
    start_date: string | null;
    end_date: string | null;
    min_order_value: number;
    created: string;
    updated: string;
}

