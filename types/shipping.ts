export interface ShippingOption {
    id: number;
    name: string;
    delivery_speed: string;
    /** Discounted price as a decimal string, e.g. "5.99" or "0.00". */
    price: string;
    original_price?: string;
    discounted_price?: string;
    discount_amount?: string;
    estimated_days_min: number;
    estimated_days_max: number;
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
