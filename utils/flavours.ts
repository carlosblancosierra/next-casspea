import { Flavour, FlavourCategory } from '@/types/flavours';

/**
 * Server-side fetch for the active flavours. Used by the flavours page and the
 * home flavour grid so both share one cache window and one code path.
 * Returns [] on any error so callers can render an empty state.
 */
/**
 * @param opts.revalidate  Seconds to cache the response for, or `false` to
 *   always fetch fresh (`cache: 'no-store'`). Defaults to 300s. The flavours
 *   page passes `false` so admin changes show immediately; the home grid uses
 *   the default cache since it's high-traffic and changes rarely.
 */
/**
 * @param opts.includeComingSoon  Also return flavours whose category has not
 *   launched yet (e.g. Christmas before 1 December). Only for pages that show
 *   flavours off; anything that lets a customer pick must leave it off.
 */
export async function getFlavours(
    opts: { revalidate?: number | false; includeComingSoon?: boolean } = {},
): Promise<Flavour[]> {
    const { revalidate = 300, includeComingSoon = false } = opts;
    const url = `${process.env.NEXT_PUBLIC_HOST}/api/flavours/${includeComingSoon ? '?include=coming_soon' : ''}`;
    try {
        const res = await fetch(
            url,
            revalidate === false ? { cache: 'no-store' } : { next: { revalidate } },
        );
        if (!res.ok) {
            console.error(`[getFlavours] ${res.status} ${res.statusText} from ${url}`);
            return [];
        }
        return res.json();
    } catch (err) {
        // Surfaces the real cause in the dev/server console instead of a silent
        // empty grid (e.g. NEXT_PUBLIC_HOST unset -> "undefined/api/...", or the
        // API not reachable from the server at request time).
        console.error(`[getFlavours] fetch failed for ${url}:`, err);
        return [];
    }
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

/** "2026-12-01" -> "1 December". Read from the string so no time zone can move the day. */
export function formatLaunchDate(isoDate?: string | null): string | null {
    const match = isoDate?.match(/^\d{4}-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const month = MONTHS[Number(match[1]) - 1];
    return month ? `${Number(match[2])} ${month}` : null;
}

/** Badge text for a flavour that is shown but not on sale yet, else null. */
export function comingSoonLabel(flavour: Flavour): string | null {
    if (!flavour.coming_soon) return null;
    const date = formatLaunchDate(flavour.available_from ?? flavour.category?.available_from);
    return date ? `Coming ${date}` : 'Coming soon';
}

export interface FlavourFilter {
    /** Only the flavours in this category. */
    categorySlug?: string;
    /** Leave out the featured categories, which have a section of their own. */
    excludeFeatured?: boolean;
}

export function filterFlavours(list: Flavour[], { categorySlug, excludeFeatured }: FlavourFilter = {}): Flavour[] {
    return list.filter(f => {
        if (categorySlug && f.category?.slug !== categorySlug) return false;
        if (excludeFeatured && f.category?.featured) return false;
        return true;
    });
}

export interface FeaturedFlavourSection {
    category: FlavourCategory;
    title: string;
    flavours: Flavour[];
}

/** The featured categories in the list, each with its flavours, in the order they first appear. */
export function getFeaturedSections(list: Flavour[]): FeaturedFlavourSection[] {
    const sections = new Map<string, FeaturedFlavourSection>();
    for (const flavour of list) {
        const category = flavour.category;
        if (!category?.featured) continue;
        let section = sections.get(category.slug);
        if (!section) {
            section = { category, title: category.featured_title || category.name, flavours: [] };
            sections.set(category.slug, section);
        }
        section.flavours.push(flavour);
    }
    return Array.from(sections.values());
}
