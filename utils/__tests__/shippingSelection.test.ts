import { describe, it, expect } from 'vitest';
import { reconcileShippingSelection } from '../shippingSelection';

const opt = (id: number, disabled = false) => ({ id, disabled });

describe('reconcileShippingSelection', () => {
    it('keeps a still-valid selection', () => {
        const options = [opt(1), opt(2), opt(3)];
        expect(reconcileShippingSelection(options, 2)).toBe(2);
    });

    it('falls back to the first enabled option when the selection disappeared', () => {
        // Option 2 was selected but a refetch removed it (e.g. de-duplicated free option)
        const options = [opt(1), opt(3)];
        expect(reconcileShippingSelection(options, 2)).toBe(1);
    });

    it('moves off an option that became disabled after a refetch', () => {
        // The summer heat toggle disabled the selected option
        const options = [opt(1, true), opt(2), opt(3)];
        expect(reconcileShippingSelection(options, 1)).toBe(2);
    });

    it('skips leading disabled options to the first enabled one', () => {
        const options = [opt(1, true), opt(2, true), opt(3)];
        expect(reconcileShippingSelection(options, null)).toBe(3);
    });

    it('picks the first enabled option when nothing is selected yet', () => {
        const options = [opt(10), opt(11)];
        expect(reconcileShippingSelection(options, null)).toBe(10);
    });

    it('returns null when every option is disabled', () => {
        const options = [opt(1, true), opt(2, true)];
        expect(reconcileShippingSelection(options, 1)).toBeNull();
    });

    it('returns null for an empty list', () => {
        expect(reconcileShippingSelection([], 5)).toBeNull();
    });
});
