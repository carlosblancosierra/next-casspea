/**
 * Mock client page config. Front-end only for now: later this comes from the
 * backend (a ClientPage model with its logo, colour, message and products).
 */
export interface ClientPageConfig {
    slug: string;
    name: string;
    /** Path under /public or an absolute URL. Empty shows the initials. */
    logo?: string;
    /** Client brand colour, used as an accent (hero edge and initials). */
    brandColor: string;
    welcomeMessage: string;
    highlights: string[];
    /** How many flavours from the catalogue to offer. */
    flavourCount: number;
    /** Individual chocolates can only be added in steps of this size. */
    quantityStep: number;
    /** Price of one individual chocolate, in GBP. */
    unitPrice: number;
}

export const CLIENT_PAGES: Record<string, ClientPageConfig> = {
    demo: {
        slug: 'demo',
        name: 'Northwind Studio',
        brandColor: '#0F766E',
        welcomeMessage:
            "Hi team! We've picked these chocolates for your end-of-year gifts. Choose how many of each you'd like and add them to your cart.",
        highlights: ['Dispatch from 1 December', 'Client prices applied', 'Sold in packs of 10'],
        flavourCount: 4,
        quantityStep: 10,
        unitPrice: 1.8,
    },
};

export const getClientPage = (slug: string): ClientPageConfig | undefined =>
    CLIENT_PAGES[slug];
