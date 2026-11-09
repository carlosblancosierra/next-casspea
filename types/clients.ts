import { Product } from './products';

export interface ClientFlavour {
    id: number;
    name: string;
    slug: string;
    mini_description?: string;
    image?: string | null;
}

export interface ClientPageItem {
    id: number;
    product: Product;
    flavour: ClientFlavour | null;
    order: number;
}

/** What /api/clients/<slug>/ returns before the access code is entered. */
export interface LockedClientPage {
    name: string;
    slug: string;
    logo: string | null;
    brand_color: string;
    locked: true;
}

export interface UnlockedClientPage extends Omit<LockedClientPage, 'locked'> {
    welcome_message: string;
    locked: false;
    items: ClientPageItem[];
}

export type ClientPage = LockedClientPage | UnlockedClientPage;
