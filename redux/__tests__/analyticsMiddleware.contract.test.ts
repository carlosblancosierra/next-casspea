import { analyticsMiddleware } from '@/redux/analyticsMiddleware';
import { track } from '@/utils/analytics';
import cartItemCreated from '@/contract/responses/cart-item-created.json';

/**
 * The analytics middleware fed with what the API really answers, taken from
 * contract/responses (produced by the casspea-v2 test suite) instead of a
 * hand-written payload. analyticsMiddleware.test.ts used to feed it a
 * CartItem-shaped payload that POST /api/carts/items/ never returns, which is
 * how BUG-04 hid behind a passing test.
 */

jest.mock('@/utils/analytics', () => ({
    ...jest.requireActual('@/utils/analytics'),
    track: jest.fn(),
}));

const fulfilledMutation = (endpointName: string, originalArgs: unknown, payload: unknown) => ({
    type: 'api/executeMutation/fulfilled',
    payload,
    meta: { requestStatus: 'fulfilled', arg: { type: 'mutation', endpointName, originalArgs } },
});

describe('analyticsMiddleware with real API responses', () => {
    beforeEach(() => (track as jest.Mock).mockClear());

    // BUG-04 (docs/plan-rediseno-seguro.md), fixed: the middleware used to read
    // `payload.product`, but the API returns the whole cart, so add_to_cart
    // was never sent and the purchase funnel had a hole exactly where a
    // redesign needs measuring.
    it('[BUG-04] reports add_to_cart when the API answers with the whole cart', () => {
        const product = cartItemCreated.items[0].product;
        const action = fulfilledMutation('addCartItem', { product: product.id, quantity: 1 }, cartItemCreated);
        analyticsMiddleware({ dispatch: jest.fn(), getState: jest.fn() })(jest.fn(a => a))(action as never);

        expect(track).toHaveBeenCalledWith('add_to_cart', expect.objectContaining({
            currency: 'GBP',
            items: [expect.objectContaining({ item_id: String(product.id), quantity: 1 })],
        }));
    });
});
