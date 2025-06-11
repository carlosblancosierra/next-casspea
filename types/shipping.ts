export interface ShippingOption {
    id: number;
    name: string;
    delivery_speed: string;
    price: number;
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
