import { Allergen } from "./allergens";

export interface FlavourCategory {
    id: number;
    name: string;
    active: boolean;
    slug: string;
    /** Launch date (YYYY-MM-DD). Before it the category's flavours are "coming soon". */
    available_from?: string | null;
    /** Shown as its own section on the home and flavours page. */
    featured?: boolean;
    featured_title?: string;
    featured_message?: string;
    featured_cta_label?: string;
    featured_cta_url?: string;
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
    /** Shown but not on sale yet: its category launches on `available_from`. */
    coming_soon?: boolean;
    available_from?: string | null;
}
