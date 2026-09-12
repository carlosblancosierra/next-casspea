import { Flavour } from '@/types/flavours';

/**
 * Server-side fetch for the active flavours. Used by the flavours page and the
 * home flavour grid so both share one cache window and one code path.
 * Returns [] on any error so callers can render an empty state.
 */
export async function getFlavours(): Promise<Flavour[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/flavours/`, {
            next: { revalidate: 300 },
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}
