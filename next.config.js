/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Help was split into separate FAQ and Contact pages; keep old links,
    // bookmarks and search results working.
    async redirects() {
        return [{ source: '/help', destination: '/faq', permanent: true }];
    },
    env: {
        GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    },
}

module.exports = nextConfig;
