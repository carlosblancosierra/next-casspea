import { Allergen } from "./allergens";

export interface FlavourCategory {
    id: number;
    name: string;
    active: boolean;
    slug: string;
}

export interface Flavour {
    id: number;
    name: string;
    slug: string;
    description: string;
    mini_description: string;
    /** Long-form copy for the flavours page. Falls back to `description`. */
    story?: string;
    category?: FlavourCategory;
    allergens?: Allergen[];
    active?: boolean;
    image?: string;
    image_webp?: string;
    thumbnail?: string;
    thumbnail_webp?: string;
    featured?: boolean;
    featured_message?: string;
}
