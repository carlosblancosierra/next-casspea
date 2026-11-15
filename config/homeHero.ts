/**
 * Homepage hero copy, in one place.
 *
 * The hero, the section under it and the first product row all read from
 * `HOME_HERO`. To end a campaign, point `HOME_HERO` at another object (for
 * example `EVERYDAY_HERO`) — no component needs to change.
 */

export interface HeroLink {
    label: string;
    href: string;
}

export interface HomeHeroConfig {
    /** The page's only H1. */
    heading: string;
    /** One line under the H1. */
    preview: string;
    primaryCta: HeroLink;
    /** Shown as an outline button next to the primary one. */
    secondaryCta?: HeroLink;
    /** Optional section straight after the hero, with its own H2. */
    belowHero?: {
        heading: string;
        body: string;
    };
    /** Products shown first in the first product row, by slug, before the gift boxes. */
    leadProductSlugs: string[];
}

const ADVENT_CALENDAR_HREF = '/shop-now/advent-calendar';
const GIFT_BOXES_HREF = '/shop-now/categories/signature-boxes';

const EVERYDAY_INTRO =
    'Share the love with CassPea Chocolates—perfect for personal indulgence, ' +
    'birthdays, corporate events, and special celebrations. With over 20 ' +
    'exquisite flavours, each handcrafted to perfection by our skilled ' +
    'chocolatiers, every bite is a work of art and a journey through inspired ' +
    'flavours.';

/** November 2026: Advent calendar. */
export const CHRISTMAS_HERO: HomeHeroConfig = {
    heading: 'Luxury Chocolate for Christmas, Handmade in London',
    preview:
        'Start with our Advent calendar, the only place to taste our three new ' +
        'flavours before December. Order by 26 November at noon to start on ' +
        '1 December.',
    primaryCta: { label: 'Order the Advent calendar', href: ADVENT_CALENDAR_HREF },
    secondaryCta: { label: 'Shop Christmas gifts', href: GIFT_BOXES_HREF },
    belowHero: {
        heading: 'Luxury Chocolate Gifts for Every Occasion',
        body: EVERYDAY_INTRO,
    },
    leadProductSlugs: ['advent-calendar'],
};

/** The hero as it was before the Christmas campaign. */
export const EVERYDAY_HERO: HomeHeroConfig = {
    heading: 'Luxury Chocolate Gifts, Handcrafted in London',
    preview: 'Celebrate Every Occasion with Our Signature Gift Boxes',
    primaryCta: { label: 'Shop Indulgence Now!', href: '/shop-now' },
    belowHero: {
        heading: 'Luxury Chocolate Gifts for Every Occasion',
        body: EVERYDAY_INTRO,
    },
    leadProductSlugs: [],
};

export const HOME_HERO: HomeHeroConfig = CHRISTMAS_HERO;
