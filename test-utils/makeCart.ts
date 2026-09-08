import type { Cart } from '@/types/carts';

/** Minimal cart for component tests; override what each test cares about. */
export const makeCart = (overrides: Partial<Cart> = {}): Cart => ({
    id: 1,
    items: [
        {
            id: 1,
            quantity: 2,
            product: { id: 4, name: 'Signature Box of 9' } as any,
            base_price: '29.98',
            discounted_price: '29.98',
            savings: '0.00',
        } as any,
    ],
    base_total: '29.98',
    discounted_total: '29.98',
    total_savings: '0.00',
    is_discount_valid: false,
    created: '2026-01-01T00:00:00Z',
    updated: '2026-01-01T00:00:00Z',
    ...overrides,
});
