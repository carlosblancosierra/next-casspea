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
