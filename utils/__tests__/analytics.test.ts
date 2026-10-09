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
