import type { Order } from '@/types/orders';

/** Minimal order for admin-screen tests; override what each test cares about. */
export const makeOrder = (overrides: Partial<Order> = {}): Order => ({
    order_id: 'AB12',
    status: 'processing',
    created: '2026-01-01T10:00:00Z',
    updated: '2026-01-01T10:00:00Z',
    checkout_session: {
        payment_status: 'paid',
        shipping_address: {
            address_type: 'SHIPPING',
            full_name: 'Test Customer',
            phone: '07000000000',
            street_address: '1 Test Street',
            city: 'London',
            postcode: 'SW1A 1AA',
            country: 'GB',
            first_name: 'Test',
            last_name: 'Customer',
        },
        shipping_option: { id: 1, name: 'Tracked 24', price: '5.99' },
        total_with_shipping: '54.99',
        cart: {
            items: [],
            discounted_total: '49.00',
        },
        ...overrides.checkout_session,
    },
    ...overrides,
});
