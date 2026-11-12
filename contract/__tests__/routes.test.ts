/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import { expectMatchesContractFile, readContractFile } from '../contractFile';

/**
 * The URL map is a public promise: search results, ads, QR codes, Stripe and
 * every email we have ever sent point at these paths. A redesign may move
 * components around freely, but it must not drop a URL without a redirect.
 */

const ROOT = path.resolve(__dirname, '../..');
const APP_DIR = path.join(ROOT, 'app');
const PUBLIC_DIR = path.join(ROOT, 'public');

type Redirect = { source: string; destination: string; permanent?: boolean };
type InboundLink = { url: string; source: string; knownIssue?: string };

function findRoutes(dir: string, segments: string[] = []): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        if (entry.isDirectory()) {
            // _private folders are not routes; (groups) do not add a segment.
            if (entry.name.startsWith('_') || entry.name === '__tests__') return [];
            const segment = /^\(.*\)$/.test(entry.name) ? [] : [entry.name];
            return findRoutes(path.join(dir, entry.name), [...segments, ...segment]);
        }
        return /^page\.(t|j)sx?$/.test(entry.name) ? [`/${segments.join('/')}`] : [];
    });
}

const toPattern = (route: string) =>
    new RegExp(
        `^${route
            .replace(/\[\[\.\.\.[^\]]+\]\]/g, '.*')
            .replace(/\[\.\.\.[^\]]+\]/g, '.+')
            .replace(/\[[^\]]+\]/g, '[^/]+')}$`,
    );

/** What the app does with a path: serve it, redirect it, or 404. */
function isServed(rawPath: string, routes: string[], redirects: Redirect[], seen = new Set<string>()): boolean {
    let pathname = rawPath.split('?')[0];
    // trailingSlash is off, so Next answers /x/ with a redirect to /x.
    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    if (seen.has(pathname)) return false;
    seen.add(pathname);

    if (routes.some(route => toPattern(route).test(pathname))) return true;
    const file = path.join(PUBLIC_DIR, pathname);
    if (file.startsWith(PUBLIC_DIR) && fs.existsSync(file) && fs.statSync(file).isFile()) return true;
    const redirect = redirects.find(r => r.source === pathname);
    return redirect ? isServed(redirect.destination, routes, redirects, seen) : false;
}

const routes = findRoutes(APP_DIR).sort();
let redirects: Redirect[] = [];

beforeAll(async () => {
    const nextConfig = require(path.join(ROOT, 'next.config.js'));
    redirects = nextConfig.redirects ? await nextConfig.redirects() : [];
});

describe('route inventory', () => {
    it('no route from contract/routes.json has disappeared', () => {
        const committed = readContractFile<string[]>('routes.json');
        const missing = committed.filter(route => !routes.includes(route) && !isServed(route, routes, redirects));
        // A route may move, but only behind a redirect in next.config.js.
        expect(missing).toEqual([]);
    });

    it('matches contract/routes.json (run with UPDATE_CONTRACT=1 after adding a page)', () => {
        expectMatchesContractFile('routes.json', routes);
    });

    it('every redirect lands on a page that exists', () => {
        const broken = redirects.filter(r => !isServed(r.destination, routes, redirects));
        expect(broken).toEqual([]);
    });
});

/**
 * Links written into the storefront's own code: hrefs, router.push and
 * router.replace, redirect() and *_PATH constants. BUG-14 was two of these
 * pointing at /checkout/error, which did not exist. Only plain strings are
 * checked: a link built with ${...} cannot be resolved here.
 */
const SOURCE_DIRS = ['app', 'components', 'hooks', 'utils'];
const LINK_PATTERN = /(?:href=\{?\s*|\.(?:push|replace)\(\s*|\bredirect\(\s*|_PATH\s*=\s*)(['"`])(\/[^'"`$\s]*)\1/g;

/** Linked pages that need content (legal text, a discount code) before they can exist. */
const KNOWN_MISSING_PAGES: Record<string, string> = {
    '/privacy-policy':
        'no privacy policy page yet: the newsletter and landing forms, the landing footer and the Thermomix giveaway terms link to it',
    '/terms': 'no terms page yet: the landing footer links to it',
    '/landing/fathers-day/thank-you': "the Father's Day form sends people here after they sign up, but the page was never made",
};

function sourceFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sourceFiles(full);
        return /\.(t|j)sx?$/.test(entry.name) && !/\.test\.(t|j)sx?$/.test(entry.name) ? [full] : [];
    });
}

/** Every plain internal link in the code, with the files it appears in. */
function internalLinks(): Map<string, string[]> {
    const links = new Map<string, string[]>();
    for (const file of SOURCE_DIRS.flatMap(dir => sourceFiles(path.join(ROOT, dir)))) {
        for (const match of Array.from(fs.readFileSync(file, 'utf8').matchAll(LINK_PATTERN))) {
            const link = match[2].split(/[?#]/)[0] || '/';
            links.set(link, [...(links.get(link) ?? []), path.relative(ROOT, file)]);
        }
    }
    return links;
}

/** Next also serves files such as app/favicon.ico from the root. */
function isAppFile(link: string): boolean {
    const file = path.join(APP_DIR, link);
    return file.startsWith(APP_DIR) && fs.existsSync(file) && fs.statSync(file).isFile();
}

describe('links inside the storefront', () => {
    const links = internalLinks();
    const isKnown = (link: string) => Object.prototype.hasOwnProperty.call(KNOWN_MISSING_PAGES, link);

    it('every hard-coded link lands on a page that exists', () => {
        const broken = Array.from(links)
            .filter(([link]) => !isKnown(link) && !isServed(link, routes, redirects) && !isAppFile(link))
            .map(([link, files]) => `${link} (${Array.from(new Set(files)).join(', ')})`);
        expect(broken).toEqual([]);
    });

    for (const [link, reason] of Object.entries(KNOWN_MISSING_PAGES)) {
        // Fails on purpose today. When the page is made this starts passing,
        // test.failing turns red, and the entry must be removed.
        it.failing(`${link} (${reason})`, () => {
            expect(isServed(link, routes, redirects)).toBe(true);
        });
    }

    it('lists no missing page that nothing links to any more', () => {
        expect(Object.keys(KNOWN_MISSING_PAGES).filter(link => !links.has(link))).toEqual([]);
    });
});

describe('links that other systems send people to', () => {
    const links = readContractFile<InboundLink[]>('inbound-links.json');

    for (const link of links) {
        if (link.knownIssue) {
            // Fails on purpose today. When the fix lands this starts passing,
            // test.failing turns red, and the knownIssue entry must be removed.
            it.failing(`${link.url} (${link.knownIssue})`, () => {
                expect(isServed(link.url, routes, redirects)).toBe(true);
            });
        } else {
            it(`${link.url} is served (${link.source})`, () => {
                expect(isServed(link.url, routes, redirects)).toBe(true);
            });
        }
    }
});
