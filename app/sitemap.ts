import type { MetadataRoute } from 'next';
import { getCategories, getProducts, isAdventLandingLive } from '@/utils/products';
import { sitemapEntries } from '@/utils/seo';

// Rebuilt at most hourly: products change in the admin, not by the minute.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [products, categories, advent] = await Promise.all([
        getProducts({ revalidate: 3600 }),
        getCategories({ revalidate: 3600 }),
        // The status, not the content: the content's 404 when switched off is not cached over a good copy.
        isAdventLandingLive({ revalidate: 3600 }),
    ]);
    return sitemapEntries({ products, categories, adventLive: advent });
}
