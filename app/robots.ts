import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/checkout/', '/cart', '/orders', '/auth/', '/dev/', '/addresses'],
        },
        sitemap: 'https://www.casspea.co.uk/sitemap.xml',
    };
}
