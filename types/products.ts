export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    active?: boolean;
    created?: string;
    updated?: string;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    category?: ProductCategory;

    base_price?: string;
    stripe_price_id?: string;
    slug: string;
    weight?: number;  // in grams

    active?: boolean;
    sold_out?: boolean;

    units_per_box?: number;

    main_color?: string;
    secondary_color?: string;

    seo_title?: string;
    seo_description?: string;

    image?: string;
    image_webp?: string;
    thumbnail?: string;
    thumbnail_webp?: string;

    created?: string;
    updated?: string;
}