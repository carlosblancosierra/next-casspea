/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { config, middleware, passwordFrom } from '../middleware';

const URL_ = 'https://www.casspea.co.uk/advent-calendar';
const basic = (user: string, password: string) => `Basic ${btoa(`${user}:${password}`)}`;
const request = (authorization?: string) =>
    new NextRequest(URL_, { headers: authorization ? { authorization } : {} });

const ORIGINAL = process.env.ADVENT_PREVIEW_PASSWORD;
afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.ADVENT_PREVIEW_PASSWORD;
    else process.env.ADVENT_PREVIEW_PASSWORD = ORIGINAL;
});

describe('the private Advent landing', () => {
    it('guards both variants and nothing else', () => {
        expect(config.matcher).toEqual(['/advent-calendar', '/advent-calendar/:path*']);
    });

    it('answers 404 when no password is configured, so a bad build never shows it', () => {
        delete process.env.ADVENT_PREVIEW_PASSWORD;
        const res = middleware(request(basic('x', 'anything')));
        expect(res.status).toBe(404);
    });

    it('asks for the password, and never lets a CDN keep the answer', () => {
        process.env.ADVENT_PREVIEW_PASSWORD = 'mince-pie';
        const res = middleware(request());
        expect(res.status).toBe(401);
        expect(res.headers.get('www-authenticate')).toMatch(/^Basic realm=/);
        expect(res.headers.get('cache-control')).toBe('private, no-store');
    });

    it('turns away a wrong password', () => {
        process.env.ADVENT_PREVIEW_PASSWORD = 'mince-pie';
        expect(middleware(request(basic('anyone', 'mince-pi'))).status).toBe(401);
        expect(middleware(request(basic('anyone', 'mince-pie!'))).status).toBe(401);
        expect(middleware(request('Bearer mince-pie')).status).toBe(401);
    });

    it('lets the right password through, with any username, uncached and unindexed', () => {
        process.env.ADVENT_PREVIEW_PASSWORD = 'mince-pie';
        const res = middleware(request(basic('enrique', 'mince-pie')));
        expect(res.status).toBe(200);
        expect(res.headers.get('x-middleware-next')).toBe('1');
        expect(res.headers.get('cache-control')).toBe('private, no-store');
        expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    });
});

describe('passwordFrom', () => {
    it('reads the password after the first colon, so it may contain colons', () => {
        expect(passwordFrom(basic('u', 'a:b'))).toBe('a:b');
        expect(passwordFrom('Basic not-base64!!')).toBeNull();
        expect(passwordFrom(null)).toBeNull();
    });
});
