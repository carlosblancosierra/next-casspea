import { consumePendingPurchase, rememberPendingPurchase, toAmount } from '@/utils/analytics';

describe('analytics helpers', () => {
	it('parses API money strings without producing NaN', () => {
		expect(toAmount('14.99')).toBe(14.99);
		expect(toAmount(undefined)).toBe(0);
		expect(toAmount('oops')).toBe(0);
	});

	it('hands the pending purchase back exactly once', () => {
		rememberPendingPurchase({ currency: 'GBP', value: 30, items: [] });
		expect(consumePendingPurchase()).toEqual({ currency: 'GBP', value: 30, items: [] });
		expect(consumePendingPurchase()).toBeNull();
	});
});

describe('track() and the GTM dataLayer', () => {
	const dataLayer = () => (window as unknown as { dataLayer: unknown[] }).dataLayer;

	beforeEach(() => {
		(window as unknown as { dataLayer: unknown[] }).dataLayer = [];
		window.sessionStorage.clear();
		window.history.replaceState(null, '', '/');
	});

	it('pushes ecommerce events as GA4 ecommerce objects, clearing the last one first', () => {
		const { track } = jest.requireActual('@/utils/analytics');
		track('view_item', { currency: 'GBP', value: 59.99, items: [{ item_id: '7', item_name: 'Advent' }] });

		expect(dataLayer()).toEqual([
			{ ecommerce: null },
			{
				event: 'view_item',
				ecommerce: { currency: 'GBP', value: 59.99, items: [{ item_id: '7', item_name: 'Advent' }] },
				attribution: {},
			},
		]);
	});

	it('pushes leads flat, and keeps the campaign after the query string is gone', () => {
		const { track } = jest.requireActual('@/utils/analytics');
		window.history.replaceState(null, '', '/advent-calendar?utm_source=google&utm_campaign=advent&fbclid=abc');
		track('view_item', {});
		window.history.replaceState(null, '', '/cart');
		track('generate_lead', { source: 'exit-intent', form_code: 'advent-2026' });

		expect(dataLayer().at(-1)).toEqual({
			event: 'generate_lead',
			source: 'exit-intent',
			form_code: 'advent-2026',
			attribution: { utm_source: 'google', utm_campaign: 'advent', fbclid: 'abc' },
		});
	});

	it('leaves events GA4 does not know about out of the dataLayer', () => {
		const { track } = jest.requireActual('@/utils/analytics');
		track('api_error', { endpoint: 'x' });
		expect(dataLayer()).toEqual([]);
	});
});

describe('first and last touch attribution', () => {
	const DAY = 24 * 60 * 60 * 1000;
	const cookiebot = (statistics: boolean | undefined) => {
		(window as unknown as { Cookiebot?: unknown }).Cookiebot =
			statistics === undefined ? undefined : { hasResponse: true, consent: { statistics } };
	};
	const visit = (url: string) => {
		window.history.replaceState(null, '', url);
		const { getAttributionTouches } = jest.requireActual('@/utils/analytics');
		return getAttributionTouches();
	};

	beforeEach(() => {
		jest.useFakeTimers({ now: new Date('2026-11-01T10:00:00Z') });
		window.sessionStorage.clear();
		window.localStorage.clear();
		cookiebot(true);
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
		cookiebot(undefined);
		window.history.replaceState(null, '', '/');
	});

	it('keeps the first touch and moves the last one to the newest campaign', () => {
		visit('/advent-calendar?utm_source=google&utm_medium=cpc&utm_campaign=advent&gclid=g1');
		jest.setSystemTime(new Date('2026-11-05T10:00:00Z'));
		visit('/?utm_source=facebook&utm_medium=paid_social&utm_campaign=xmas&fbclid=f1');
		jest.setSystemTime(new Date('2026-11-06T10:00:00Z'));
		const touches = visit('/checkout');

		expect(touches.first_touch).toEqual({
			utm_source: 'google',
			utm_medium: 'cpc',
			utm_campaign: 'advent',
			gclid: 'g1',
			landing_path: '/advent-calendar',
			touched_at: '2026-11-01T10:00:00.000Z',
		});
		expect(touches.last_touch).toMatchObject({ utm_source: 'facebook', utm_campaign: 'xmas', fbclid: 'f1' });

		const { attributionProperties } = jest.requireActual('@/utils/analytics');
		expect(attributionProperties(touches)).toEqual({
			first_utm_source: 'google',
			first_utm_medium: 'cpc',
			first_utm_campaign: 'advent',
			first_gclid: 'g1',
			last_utm_source: 'facebook',
			last_utm_medium: 'paid_social',
			last_utm_campaign: 'xmas',
		});
	});

	it('survives the tab closing with consent, and forgets touches older than 30 days', () => {
		visit('/?utm_source=google&utm_campaign=advent');
		window.sessionStorage.clear();
		expect(visit('/').first_touch).toMatchObject({ utm_source: 'google' });

		jest.setSystemTime(Date.now() + 31 * DAY);
		expect(visit('/')).toEqual({ first_touch: null, last_touch: null });
		const fresh = visit('/?utm_source=newsletter');
		expect(fresh.first_touch).toMatchObject({ utm_source: 'newsletter' });
	});

	it('never touches localStorage without statistics consent', () => {
		cookiebot(false);
		const getItem = jest.spyOn(Storage.prototype, 'getItem');
		const setItem = jest.spyOn(Storage.prototype, 'setItem');

		const touches = visit('/?utm_source=google&utm_campaign=advent');
		expect(touches.last_touch).toMatchObject({ utm_source: 'google' });

		const usedLocal = [...getItem.mock.contexts, ...setItem.mock.contexts].some(ctx => ctx === window.localStorage);
		expect(usedLocal).toBe(false);
		expect(window.localStorage.getItem('casspea_attribution')).toBeNull();
		expect(window.sessionStorage.getItem('casspea_attribution')).not.toBeNull();
	});

	it('adds first and last touch to begin_checkout and purchase in PostHog only', () => {
		const posthog = jest.requireActual('posthog-js').default;
		const capture = jest.spyOn(posthog, 'capture').mockImplementation(() => undefined);
		const prevKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
		(process.env as Record<string, string | undefined>).NEXT_PUBLIC_POSTHOG_KEY = 'phc_test';
		try {
			visit('/?utm_source=google&utm_medium=cpc&utm_campaign=advent&gclid=g1');
			const { track } = jest.requireActual('@/utils/analytics');
			track('purchase', { value: 30 });
			track('view_item', { value: 30 });

			expect(capture).toHaveBeenNthCalledWith(1, 'purchase', expect.objectContaining({
				value: 30,
				first_utm_source: 'google',
				first_gclid: 'g1',
				last_utm_campaign: 'advent',
			}));
			expect(capture).toHaveBeenNthCalledWith(2, 'view_item', { value: 30 });
		} finally {
			(process.env as Record<string, string | undefined>).NEXT_PUBLIC_POSTHOG_KEY = prevKey;
		}
	});
});
