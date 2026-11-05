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
    mclaren: {
        slug: 'mclaren',
        name: 'McLaren',
        // Drop the logo in public/clients/mclaren.png and set
        // logo: '/clients/mclaren.png'. Until then the initial is shown.
        brandColor: '#FF8000',
        welcomeMessage:
            "Welcome! Choose your favourite flavours and how many of each you'd like, then add them to your cart.",
        highlights: [],
        flavourCount: 4,
        quantityStep: 10,
        unitPrice: 1.8,
    },
};

export const getClientPage = (slug: string): ClientPageConfig | undefined =>
    CLIENT_PAGES[slug];
