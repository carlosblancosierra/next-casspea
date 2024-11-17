// types/products.ts

export interface ProductCategoryType {
    name: string;
    slug: string;
    short: string;
}

export interface ProductType {
    id: number;
    name: string;
    name_short: string;
    price: string;
    slug: string;
    category: ProductCategoryType;
    store_image: string;
    images: string[];
    description?: string;
    weight: string;
    color: string;
    pieces?: string;
}
