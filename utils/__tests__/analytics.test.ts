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

describe('trackAdsPurchase', () => {
	const w = window as Window & { gtag?: jest.Mock };
	afterEach(() => {
		delete w.gtag;
		jest.resetModules();
	});

	it('sends the purchase conversion with value, order id and the email for enhanced conversions', () => {
		jest.isolateModules(() => {
			jest.doMock('@/utils/googleTags', () => ({
				...jest.requireActual('@/utils/googleTags'),
				GOOGLE_ADS_ID: 'AW-11208730912',
			}));
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const { trackAdsPurchase } = require('@/utils/analytics');
			w.gtag = jest.fn();
			trackAdsPurchase('cs_1', { currency: 'GBP', value: 30, items: [], email: 'a@b.co' });
			expect(w.gtag).toHaveBeenNthCalledWith(1, 'set', 'user_data', { email: 'a@b.co' });
			expect(w.gtag).toHaveBeenNthCalledWith(2, 'event', 'conversion', {
				send_to: 'AW-11208730912/eqyOCMKevcYaEKDS3uAp',
				value: 30,
				currency: 'GBP',
				transaction_id: 'cs_1',
			});
		});
	});
});
