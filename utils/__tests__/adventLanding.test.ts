/**
 * @jest-environment node
 */
import {
    adventHref,
    getAdventLandingLive,
    getPublicAdventLanding,
    productHref,
    resolveAdventLink,
} from '../adventLanding';

const fetchMock = jest.fn();

beforeEach(() => {
    Object.assign(process.env, { NEXT_PUBLIC_HOST: 'http://api.test' });
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

const answer = (status: number, body: unknown) =>
    fetchMock.mockResolvedValueOnce({ ok: status < 400, status, json: async () => body });

describe('the live switch', () => {
    it('reads the API and refreshes every minute', async () => {
        answer(200, { live: true });
        await expect(getAdventLandingLive()).resolves.toBe(true);
        expect(fetchMock).toHaveBeenCalledWith(
            'http://api.test/api/products/advent-landing/status/',
            { next: { revalidate: 60 } },
        );
    });

    it('is off when the API says so, fails or is down', async () => {
        answer(200, { live: false });
        await expect(getAdventLandingLive()).resolves.toBe(false);
        answer(500, {});
        await expect(getAdventLandingLive()).resolves.toBe(false);
        fetchMock.mockRejectedValueOnce(new Error('down'));
        await expect(getAdventLandingLive()).resolves.toBe(false);
    });
});

describe('the public content', () => {
    it('is null when the API keeps it to staff (404)', async () => {
        answer(404, { detail: 'Not found.' });
        await expect(getPublicAdventLanding()).resolves.toBeNull();
    });

    it('is the API answer once live', async () => {
        answer(200, { live: true, product: null, flavours: [] });
        await expect(getPublicAdventLanding()).resolves.toEqual({ live: true, product: null, flavours: [] });
    });
});

describe('links to the calendar', () => {
    it('go to the product page until the landing is live, then to the landing', () => {
        expect(adventHref(false)).toBe('/shop-now/advent-calendar');
        expect(adventHref(true)).toBe('/advent-calendar');
        expect(productHref('advent-calendar', true)).toBe('/advent-calendar');
        expect(productHref('box-of-24', true)).toBe('/shop-now/box-of-24');
        expect(resolveAdventLink('/shop-now/advent-calendar', true)).toBe('/advent-calendar');
        expect(resolveAdventLink('/shop-now/advent-calendar', false)).toBe('/shop-now/advent-calendar');
        expect(resolveAdventLink('/shop-now/categories/signature-boxes', true)).toBe('/shop-now/categories/signature-boxes');
    });
});
