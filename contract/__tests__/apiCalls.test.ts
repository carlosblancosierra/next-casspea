/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { expectMatchesContractFile } from '../contractFile';

/**
 * Every request the storefront can send to the Django API, recorded by
 * actually running each RTK Query endpoint against a fake fetch.
 *
 * The list is the contract with casspea-v2: its test suite reads a copy of
 * contract/frontend-api-calls.json and checks that each call still resolves
 * to a view that accepts that method. A redesign that renames an endpoint,
 * changes a method or drops a trailing slash fails here before it fails in
 * production.
 */

jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));

const ROOT = path.resolve(__dirname, '../..');
const API_HOST = 'http://api.test';

/**
 * One representative argument per endpoint. A new endpoint must be added here
 * (the first test below fails until it is), which is what keeps the contract
 * file complete.
 */
const SAMPLE_ARGS: Record<string, unknown> = {
    // addresses
    getAddresses: undefined,
    getAddressesStats: undefined,
    getSmsContacts: undefined,
    downloadSmsContactsCsv: undefined,
    setAddresses: { shipping_address: { full_name: 'A Customer' } },
    // auth
    login: { email: 'customer@example.com', password: 'secret' },
    logout: undefined,
    verify: { token: 'token' },
    // cart
    getCart: undefined,
    updateCart: { gift_message: 'Happy birthday' },
    addCartItem: { product: 1, quantity: 1 },
    updateCartItem: { id: 101, cartItem: { quantity: 2 } },
    deleteCartItem: 101,
    changeCartItemQuantity: { id: 101, quantity: 2 },
    removeCartItem: 101,
    // checkout
    getStoreStatus: undefined,
    getSession: undefined,
    updateSession: { email: 'customer@example.com' },
    createStripeCheckoutSession: undefined,
    createEmbeddedCheckoutSession: undefined,
    getEmbeddedCheckoutSessionResult: 'cs_test_123',
    updateShippingOption: { checkoutSessionId: 7, data: { shipping_option_id: 3 } },
    // client pages
    getClientPage: 'acme',
    unlockClientPage: { slug: 'acme', code: '1234' },
    // experiments
    assignVariant: { experiment: 'box_builder' },
    recordExperimentEvent: { experiment: 'box_builder', name: 'builder_add_to_cart' },
    getExperimentResults: 'box_builder',
    // flavours
    getFlavours: undefined,
    getShowcaseFlavours: undefined,
    // orders (staff)
    getOrders: undefined,
    getOrdersSummary: undefined,
    getOrder: 'CP26-ABCDE',
    sendTrackingCodeMail: { order_id: 'CP26-ABCDE' },
    getDailyUnitsSold: undefined,
    // personalised chocolates
    getTemplates: undefined,
    getTemplateDetail: 'heart',
    sendRequest: {
        template_slug: 'heart',
        email: 'customer@example.com',
        comments: '',
        custom_design_names: [],
        flavours: [],
        quantity: 1,
    },
    // products
    getProducts: undefined,
    getProduct: 'signature-box',
    getProductsByCategory: 'boxes',
    getActiveProducts: undefined,
    getCategories: undefined,
    getCategory: 'boxes',
    getSummerBreakStatus: undefined,
    runSummerBreakAction: { action: 'load', dry_run: true },
    // Royal Mail (staff)
    createRoyalMailOrder: { order_id: 'CP26-ABCDE' },
    // shipping
    getShippingOptions: undefined,
    // leads
    subscribeToNewsletter: { email: 'customer@example.com' },
    subscribeGenericLead: { email: 'customer@example.com', lead_type: 'generic' },
};

/**
 * Endpoints that skip the shared base query, so they reach neither the API
 * host nor the auth headers. Listed rather than silently ignored; delete the
 * entry together with the endpoint.
 */
const NOT_ON_BASE_QUERY: Record<string, string> = {
    downloadRoyalMailLabel:
        'axios with a relative URL, so it would hit the Next.js host without a token. ' +
        'Unused: the orders screen downloads labels with fetch in useOrderActions. Delete it.',
};

type ApiCall = { endpoint: string; method: string; path: string };

function findSliceFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === '__tests__' ? [] : findSliceFiles(full);
        return /ApiSlice\.tsx?$/.test(entry.name) ? [full] : [];
    });
}

const has = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);

describe('frontend → backend API calls', () => {
    const calls: ApiCall[] = [];
    let endpointNames: string[] = [];

    beforeAll(async () => {
        (process.env as Record<string, string>).NEXT_PUBLIC_HOST = API_HOST;
        // The base query reads the CSRF cookie and the JWT from the browser.
        const storage: Record<string, string> = {};
        Object.assign(globalThis, {
            document: { cookie: 'csrftoken=test-csrf' },
            localStorage: {
                getItem: (key: string) => storage[key] ?? null,
                setItem: (key: string, value: string) => { storage[key] = value; },
                removeItem: (key: string) => { delete storage[key]; },
            },
        });

        let captured: Request[] = [];
        jest.spyOn(globalThis, 'fetch').mockImplementation(async input => {
            captured.push(input as Request);
            return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
        });

        // Imported after NEXT_PUBLIC_HOST is set: the base URL is read at import time.
        const { apiSlice } = await import('@/redux/services/apiSlice');
        const { default: authReducer } = await import('@/redux/features/auth/authSlice');
        for (const file of findSliceFiles(path.join(ROOT, 'redux'))) await import(file);

        const store = configureStore({
            reducer: { [apiSlice.reducerPath]: apiSlice.reducer, auth: authReducer },
            middleware: getDefault =>
                getDefault({ serializableCheck: false, immutableCheck: false }).concat(apiSlice.middleware),
        });

        const endpoints = apiSlice.endpoints as unknown as Record<
            string,
            { initiate: (arg: unknown) => unknown }
        >;
        endpointNames = Object.keys(endpoints).sort();

        for (const name of endpointNames) {
            if (has(NOT_ON_BASE_QUERY, name) || !has(SAMPLE_ARGS, name)) continue;
            captured = [];
            const pending = store.dispatch(endpoints[name].initiate(SAMPLE_ARGS[name]) as never) as unknown as
                PromiseLike<unknown> & { unsubscribe?: () => void; reset?: () => void };
            await pending;
            pending.unsubscribe?.();
            pending.reset?.();
            for (const request of captured) {
                const url = new URL(request.url);
                calls.push({ endpoint: name, method: request.method, path: `${url.pathname}${url.search}` });
            }
        }

        // Unsubscribed queries stay cached for 60s on a timer, which would keep
        // Jest alive after the run. Resetting the API state clears those timers.
        store.dispatch(apiSlice.util.resetApiState());
    });

    afterAll(() => jest.restoreAllMocks());

    it('every endpoint has a sample argument, so the contract covers it', () => {
        const unregistered = endpointNames.filter(
            name => !has(SAMPLE_ARGS, name) && !has(NOT_ON_BASE_QUERY, name),
        );
        expect(unregistered).toEqual([]);
    });

    it('lists no endpoint that no longer exists', () => {
        const stale = [...Object.keys(SAMPLE_ARGS), ...Object.keys(NOT_ON_BASE_QUERY)].filter(
            name => !endpointNames.includes(name),
        );
        expect(stale).toEqual([]);
    });

    it('each endpoint sends exactly one request, to the API host', () => {
        const counts = calls.reduce<Record<string, number>>((acc, call) => {
            acc[call.endpoint] = (acc[call.endpoint] ?? 0) + 1;
            return acc;
        }, {});
        const expected = Object.keys(SAMPLE_ARGS).filter(name => endpointNames.includes(name));
        expect(Object.keys(counts).sort()).toEqual(expected.sort());
        expect(Object.values(counts).every(count => count === 1)).toBe(true);
        expect(calls.every(call => call.path.startsWith('/api/'))).toBe(true);
    });

    it('matches contract/frontend-api-calls.json (run with UPDATE_CONTRACT=1 to accept a change)', () => {
        const sorted = [...calls].sort((a, b) => a.endpoint.localeCompare(b.endpoint));
        expectMatchesContractFile('frontend-api-calls.json', sorted);
    });
});
