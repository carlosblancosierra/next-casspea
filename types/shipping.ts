// Matches the backend ShippingOptionSerializer: prices are decimal strings
// (e.g. "5.99") and `price` is what the customer pays after any cart-total
// shipping discount.
export interface ShippingOption {
    id: number;
    name: string;
    delivery_speed: string;
    price: string;
    original_price?: string;
    discounted_price?: string;
    discount_amount?: string;
    estimated_days_min: number;
    estimated_days_max: number;
    /**
     * True only where the carrier contractually commits to the date (Royal Mail
     * Special Delivery). Everything else is an estimate and must be worded as
     * one. Optional so the UI degrades to "estimated" if the API predates the
     * field rather than silently promising a date.
     */
    guaranteed?: boolean;
    description: string;
    disabled: boolean;
    disabled_reason: string;
}

export interface ShippingCompany {
    id: number;
    name: string;
    code: string;
    website: string;
    track_url: string;
    shipping_options: ShippingOption[];
}
