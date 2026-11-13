/**
 * @jest-environment node
 */
import { configureStore } from '@reduxjs/toolkit';

// apiSlice builds its base URL when it is imported.
(process.env as Record<string, string>).NEXT_PUBLIC_HOST = 'https://api.test';
const { apiSlice } = require('@/redux/services/apiSlice') as typeof import('@/redux/services/apiSlice');
const { checkoutApiSlice } = require('@/redux/features/checkout/checkoutApiSlice') as typeof import('@/redux/features/checkout/checkoutApiSlice');

/**
 * A guest stuck in a loop: the cart page reads the checkout session before
 * they give an email, so the cache holds an unsaved session (id null). They
 * give their email, the POST saves it, and the next step read the old cached
 * copy, saw id null and sent them back to the cart to give their email again.
 * Saving the email has to replace the cached session.
 */

const unsaved = { id: null, email: null, shipping_address: null, billing_address: null, payment_status: 'pending' };
const saved = { ...unsaved, id: 7, email: 'ada@example.com' };

const json = (body: unknown) =>
    Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }));

describe('checkout session cache', () => {
    let serverSession: object;

    beforeEach(() => {
        // apiSlice reads the CSRF cookie and the JWT from the browser.
        Object.assign(globalThis, {
            document: { cookie: '' },
            localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
        });
        serverSession = unsaved;
        jest.spyOn(globalThis, 'fetch').mockImplementation((input) => {
            const method = typeof input === 'object' && 'method' in input ? input.method : 'GET';
            if (method === 'POST') serverSession = saved;
            return json(serverSession);
        });
    });

    it('holds the saved session once the guest has given their email', async () => {
        const store = configureStore({
            reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
            middleware: gDM => gDM().concat(apiSlice.middleware),
        });

        // The cart page reads the session first: the guest has no email yet.
        const sub = store.dispatch(checkoutApiSlice.endpoints.getSession.initiate());
        await sub;
        expect(checkoutApiSlice.endpoints.getSession.select()(store.getState()).data).toMatchObject({ id: null });

        await store.dispatch(checkoutApiSlice.endpoints.updateSession.initiate({ email: 'ada@example.com' })).unwrap();

        // What the next step reads straight from the cache.
        expect(checkoutApiSlice.endpoints.getSession.select()(store.getState()).data).toMatchObject({
            id: 7,
            email: 'ada@example.com',
        });
        sub.unsubscribe();
    });
});
