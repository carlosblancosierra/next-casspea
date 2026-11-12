// Hosts next/image may fetch and optimise. Only our own buckets: '**' let
// anyone run the optimiser on any image from anywhere, and Next 14 has
// unpatched remote-code-execution advisories in exactly that code path
// (BUG-15 in docs/plan-rediseno-seguro.md). A new image host goes here.
const IMAGE_HOSTS = [
    // Product, flavour, category and client-page images: the API's media
    // storage (AWS_S3_CUSTOM_DOMAIN in casspea-v2/erp/settings.py), in both
    // the global and the regional form of the bucket's address.
    'casspea-v2.s3.amazonaws.com',
    'casspea-v2.s3.eu-west-2.amazonaws.com',
    // Payment method icons (components/common/PaymentMethods.tsx).
    'casspea-static-eu.s3.eu-west-1.amazonaws.com',
    // Media served by Django itself, when S3 is switched off.
    'api.casspea.co.uk',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: IMAGE_HOSTS.map(hostname => ({ protocol: 'https', hostname })),
    },
    // Help was split into separate FAQ and Contact pages; keep old links,
    // bookmarks and search results working.
    async redirects() {
        return [{ source: '/help', destination: '/faq', permanent: true }];
    },
    env: {
        GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
        // Sentry project casspea-web. A DSN is public by design (it only lets
        // you send events), so Amplify builds get it built in; local builds
        // send nothing unless NEXT_PUBLIC_SENTRY_DSN is set.
        NEXT_PUBLIC_SENTRY_DSN:
            process.env.NEXT_PUBLIC_SENTRY_DSN ??
            (process.env.AWS_APP_ID
                ? 'https://eeda0ca8b0b43d8a26e17d7757ce1ae5@o4512420674535424.ingest.us.sentry.io/4512420747476992'
                : ''),
    },
}

// Wraps the build so Sentry starts in the browser and on the server (see
// instrumentation.ts and instrumentation-client.ts). Source maps are uploaded
// only when SENTRY_AUTH_TOKEN is set in Amplify; without it Sentry still
// reports errors, just with minified stack traces.
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG || 'carlosblanco',
    project: process.env.SENTRY_PROJECT || 'casspea-web',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    // Amplify's commit id ties each error to the deploy that caused it.
    release: { name: process.env.AWS_COMMIT_ID },
    sourcemaps: {
        disable: !process.env.SENTRY_AUTH_TOKEN,
        // Uploaded to Sentry, then removed so the public site doesn't serve them.
        deleteSourcemapsAfterUpload: true,
    },
    silent: !process.env.CI,
    telemetry: false,
});
