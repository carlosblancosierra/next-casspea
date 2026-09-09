/** The experiment currently running on box product pages. */
export const BOX_BUILDER_EXPERIMENT = 'box_builder';

/**
 * Control is the existing step-by-step builder. Every failure path resolves
 * to it, so a broken experiment degrades to today's shop rather than to a
 * blank page.
 */
export type BoxBuilderVariant = 'control' | 'quick';

export interface VariantResponse {
    variant: string;
}

export interface ExperimentVariantResult {
    variant: string;
    visitors: number;
    add_to_carts: number;
    orders: number;
    revenue: string;
    add_to_cart_rate: number | null;
    order_rate: number | null;
    revenue_per_visitor: string | null;
}

export interface ExperimentResults {
    key: string;
    name: string;
    active: boolean;
    variants: ExperimentVariantResult[];
}

/** Funnel steps the server cannot observe on its own. */
export const BUILDER_ADD_TO_CART = 'builder_add_to_cart';
