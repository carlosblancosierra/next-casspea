import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import {
    disableNewShippingPreview,
    enableNewShippingPreview,
    isNewShippingFlow,
} from '../featureFlags';

// Minimal localStorage stand-in for the node test environment
const store = new Map<string, string>();
(globalThis as any).window = {
    localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => { store.set(k, String(v)); },
        removeItem: (k: string) => { store.delete(k); },
    },
};

afterAll(() => {
    delete (globalThis as any).window;
});

describe('new shipping flow flag', () => {
    beforeEach(() => store.clear());

    it('is off by default', () => {
        expect(isNewShippingFlow(false)).toBe(false);
    });

    it('is on for everyone once the live flag is flipped, ignoring the preview', () => {
        expect(isNewShippingFlow(true)).toBe(true);
    });

    it('turns on per browser via the /cart2 preview and off again on exit', () => {
        enableNewShippingPreview();
        expect(isNewShippingFlow(false)).toBe(true);

        disableNewShippingPreview();
        expect(isNewShippingFlow(false)).toBe(false);
    });
});
