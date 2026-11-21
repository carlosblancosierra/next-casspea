import { getActivePromo, PRE_BLACK_FRIDAY } from '@/components/blackfriday/campaign';

describe('getActivePromo', () => {
    it('is off before the pre-sale starts', () => {
        expect(getActivePromo(new Date('2026-11-20T23:59:59Z'))).toBeNull();
    });

    it('runs the 15% pre-sale from 21 November', () => {
        expect(getActivePromo(new Date('2026-11-21T00:00:00Z'))).toBe(PRE_BLACK_FRIDAY);
        expect(getActivePromo(new Date('2026-11-26T23:59:59Z'))).toBe(PRE_BLACK_FRIDAY);
    });

    it('stops the pre-sale when Black Friday starts on the 27th', () => {
        expect(getActivePromo(new Date('2026-11-27T00:00:00Z'))).toBeNull();
    });

    it('says nothing about what comes after the pre-sale', () => {
        // The Black Friday offer must not be readable in the bundle early.
        const { label, headline } = PRE_BLACK_FRIDAY;
        expect(`${label} ${headline}`).not.toMatch(/20%/);
    });
});
