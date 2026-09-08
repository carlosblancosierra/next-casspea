import { formatCurrency } from '@/utils/currency';

describe('formatCurrency', () => {
    it('formats API string prices as GBP', () => {
        expect(formatCurrency('14.99')).toBe('£14.99');
        expect(formatCurrency('0')).toBe('£0.00');
        expect(formatCurrency('104.97')).toBe('£104.97');
    });

    it('formats numbers as GBP', () => {
        expect(formatCurrency(5)).toBe('£5.00');
        expect(formatCurrency(0.99)).toBe('£0.99');
    });

    it('adds thousands separators', () => {
        expect(formatCurrency('1250.5')).toBe('£1,250.50');
    });

    it('never renders NaN for malformed or missing values', () => {
        expect(formatCurrency('')).toBe('£0.00');
        expect(formatCurrency('not-a-price')).toBe('£0.00');
        expect(formatCurrency(null)).toBe('£0.00');
        expect(formatCurrency(undefined)).toBe('£0.00');
    });
});
