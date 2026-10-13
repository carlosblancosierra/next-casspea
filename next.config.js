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
    // /help used to hold both the contact details and the FAQs; it is now two
    // pages. Old links and search results land on the FAQs, which was most of
    // what the page held.
    async redirects() {
        return [
            { source: '/help', destination: '/faqs', permanent: true },
        ];
    },
    env: {
        GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    },
}

module.exports = nextConfig;
