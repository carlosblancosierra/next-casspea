export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    order?: number;
    active?: boolean;
    created?: string;
    updated?: string;
    products?: Product[];
}

export interface ProductGalleryImage {
    id: number;
    image: string;
    image_webp?: string;
    thumbnail: string;
    thumbnail_webp?: string;
    alt_text?: string;
    order?: number;
}

export interface Product {
    id: number;
    name: string;
    name_short?: string;
    description?: string;
    category?: ProductCategory;

    base_price?: string;
    stripe_price_id?: string;
    current_price?: string;
    slug: string;
    weight?: number;  // in grams
    box_weight?: number;  // in grams

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

    preorder?: boolean;
    preorder_finish_date?: string;
    preorder_price?: string;
    is_preorder_active?: boolean;

    pickup_only?: boolean;
    pickup_from_date?: string;
    alert_message?: string;

    can_pick_allergens?: boolean;

    gallery_images?: ProductGalleryImage[];

    created?: string;
    updated?: string;
}
