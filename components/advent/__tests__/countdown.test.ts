import { timeLeft, pad } from '../countdown';
import { ORDER_DEADLINE } from '../content';

describe('timeLeft', () => {
    const deadline = ORDER_DEADLINE.getTime();

    it('is 12:00 London time on Thursday 26 November 2026 (GMT, so UTC)', () => {
        expect(ORDER_DEADLINE.toISOString()).toBe('2026-11-26T12:00:00.000Z');
        expect(ORDER_DEADLINE.toLocaleString('en-GB', { timeZone: 'Europe/London', weekday: 'long', hour: '2-digit' }))
            .toBe('Thursday, 12');
    });

    it('splits what is left into days, hours, minutes and seconds', () => {
        const now = deadline - (2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5_000);
        expect(timeLeft(deadline, now)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5, closed: false });
    });

    it('stops at zero and reports the window closed', () => {
        expect(timeLeft(deadline, deadline + 1)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, closed: true });
        expect(timeLeft(deadline, deadline).closed).toBe(true);
    });

    it('pads to two digits', () => {
        expect(pad(4)).toBe('04');
        expect(pad(12)).toBe('12');
    });
});
