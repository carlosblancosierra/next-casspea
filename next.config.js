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
    },
}

// Wraps the build so Sentry starts in the browser and on the server (see
// instrumentation.ts and instrumentation-client.ts). Source maps are uploaded
// only when SENTRY_AUTH_TOKEN, SENTRY_ORG and SENTRY_PROJECT are set in
// Amplify; without them Sentry still reports errors, just with minified
// stack traces.
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
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
