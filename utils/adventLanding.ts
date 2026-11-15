import type { Flavour } from '@/types/flavours';
import type { Product } from '@/types/products';
import { ADVENT_PATH, ADVENT_SLUG } from '@/components/advent/content';

/**
 * The Advent Calendar landing's live switch, set in the Django admin
 * (Products → Advent landing).
 *
 * Live: /advent-calendar is public and every link to the calendar on the home
 * page and in the shop goes there. Not live: only staff signed in on the shop
 * can open it (the API says so), and the links go to the product page.
 */

/** How long a page keeps the switch before asking again. */
export const ADVENT_LIVE_REVALIDATE_SECONDS = 60;

export const ADVENT_PRODUCT_PATH = `/shop-now/${ADVENT_SLUG}`;

/** What /api/products/advent-landing/ answers. */
export interface AdventLandingContent {
    live: boolean;
    /** The calendar; its photos are the landing's photos. */
    product: Product | null;
    /** The calendar's exclusive flavours, in the order they were created. */
    flavours: Flavour[];
}

const api = (path: string) => `${process.env.NEXT_PUBLIC_HOST}/api/products/advent-landing/${path}`;

/** The switch, read on the server. Off whenever the API does not answer. */
export async function getAdventLandingLive(): Promise<boolean> {
    try {
        const res = await fetch(api('status/'), { next: { revalidate: ADVENT_LIVE_REVALIDATE_SECONDS } });
        if (!res.ok) return false;
        const data = (await res.json()) as { live?: unknown };
        return data.live === true;
    } catch (err) {
        console.error('[advent-landing] status fetch failed:', err);
        return false;
    }
}

/**
 * The landing's content, read on the server without a user. The API only
 * answers this while the landing is live; otherwise it is null and the page
 * asks for it from the browser, with the signed-in user's token.
 */
export async function getPublicAdventLanding(): Promise<AdventLandingContent | null> {
    try {
        const res = await fetch(api(''), { next: { revalidate: ADVENT_LIVE_REVALIDATE_SECONDS } });
        if (!res.ok) return null;
        return (await res.json()) as AdventLandingContent;
    } catch (err) {
        console.error('[advent-landing] content fetch failed:', err);
        return null;
    }
}

/** Where a link to the Advent calendar should go. */
export function adventHref(live: boolean): string {
    return live ? ADVENT_PATH : ADVENT_PRODUCT_PATH;
}

/** A product's page, except the calendar, which goes to the landing once it is live. */
export function productHref(slug: string, live: boolean): string {
    return slug === ADVENT_SLUG ? adventHref(live) : `/shop-now/${slug}`;
}

/** The same, for a configured link (the home hero): only the calendar's product page changes. */
export function resolveAdventLink(href: string, live: boolean): string {
    return href === ADVENT_PRODUCT_PATH ? adventHref(live) : href;
}
