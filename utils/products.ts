import { Product, ProductCategory } from '@/types/products';

type CacheOpts = { revalidate?: number | false };

/**
 * Server-side fetch helpers for products and categories. Mirrors utils/flavours:
 * pass `{ revalidate: false }` to always fetch fresh (`cache: 'no-store'`) so
 * admin changes show immediately; default caches for 300s. Returns a safe empty
 * value on error and logs the cause instead of failing the render.
 */
async function fetchJson<T>(path: string, fallback: T, { revalidate = 300 }: CacheOpts = {}): Promise<T> {
    const url = `${process.env.NEXT_PUBLIC_HOST}/api${path}`;
    try {
        const res = await fetch(url, revalidate === false ? { cache: 'no-store' } : { next: { revalidate } });
        if (!res.ok) {
            console.error(`[products] ${res.status} ${res.statusText} from ${url}`);
            return fallback;
        }
        return res.json();
    } catch (err) {
        console.error(`[products] fetch failed for ${url}:`, err);
        return fallback;
    }
}

export function getProducts(opts?: CacheOpts): Promise<Product[]> {
    return fetchJson<Product[]>('/products/', [], opts);
}

export function getCategories(opts?: CacheOpts): Promise<ProductCategory[]> {
    return fetchJson<ProductCategory[]>('/products/categories/', [], opts);
}

/** A category with its products. Returns null when the category isn't found. */
export async function getCategory(
    slug: string,
    opts?: CacheOpts,
): Promise<(ProductCategory & { products?: Product[] }) | null> {
    return fetchJson<(ProductCategory & { products?: Product[] }) | null>(
        `/products/categories/${slug}/`,
        null,
        opts,
    );
}

/** A single product by slug. Returns null when not found. */
export async function getProduct(slug: string, opts?: CacheOpts): Promise<Product | null> {
    return fetchJson<Product | null>(`/products/${slug}/`, null, opts);
}
