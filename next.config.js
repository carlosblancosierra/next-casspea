/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['casspea-static-eu.s3-accelerate.amazonaws.com',
            'flowbite.s3.amazonaws.com'
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig;
