import { Flavour } from '@/types/flavours';

/**
 * Server-side fetch for the active flavours. Used by the flavours page and the
 * home flavour grid so both share one cache window and one code path.
 * Returns [] on any error so callers can render an empty state.
 */
export async function getFlavours(): Promise<Flavour[]> {
    const url = `${process.env.NEXT_PUBLIC_HOST}/api/flavours/`;
    try {
        const res = await fetch(url, { next: { revalidate: 300 } });
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
