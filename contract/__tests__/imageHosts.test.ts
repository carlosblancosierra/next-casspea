/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';

/**
 * next/image only optimises images from the hosts in next.config.js. That
 * list is a security boundary (BUG-15 in docs/plan-rediseno-seguro.md: it used
 * to be '**', any host on the internet) and a promise to the shop: every image
 * host the code uses has to be on it, or those images stop loading.
 */

const ROOT = path.resolve(__dirname, '../..');

type RemotePattern = { protocol?: string; hostname: string };

const nextConfig = require(path.join(ROOT, 'next.config.js'));
const patterns: RemotePattern[] = nextConfig.images?.remotePatterns ?? [];

function sourceFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(full);
        return /\.(t|j)sx?$/.test(entry.name) ? [full] : [];
    });
}

describe('next/image remote hosts', () => {
    it('lists exact hosts only, never a wildcard', () => {
        expect(patterns.length).toBeGreaterThan(0);
        for (const pattern of patterns) {
            expect(pattern.hostname).not.toMatch(/\*/);
            expect(pattern.protocol).toBe('https');
        }
    });

    it('allows every remote image the code links to', () => {
        const allowed = new Set(patterns.map(pattern => pattern.hostname));
        const used = new Set<string>();
        for (const dir of ['app', 'components', 'config']) {
            for (const file of sourceFiles(path.join(ROOT, dir))) {
                const source = fs.readFileSync(file, 'utf8');
                const links = source.matchAll(/https:\/\/([a-z0-9.-]+)\/[^\s'"`)]+\.(?:png|jpe?g|webp|gif|avif)/gi);
                Array.from(links).forEach(match => used.add(match[1]));
            }
        }
        expect(Array.from(used).filter(host => !allowed.has(host))).toEqual([]);
    });

    it('allows the bucket the API stores product images in', () => {
        // casspea-v2/erp/settings.py: AWS_S3_CUSTOM_DOMAIN = f'{bucket}.s3.amazonaws.com'
        expect(patterns.map(pattern => pattern.hostname)).toContain('casspea-v2.s3.amazonaws.com');
    });
});
