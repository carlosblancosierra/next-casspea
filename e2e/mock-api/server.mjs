/**
 * A small stand-in for the casspea-v2 API, for the E2E tests.
 *
 * Responses copy the shapes in contract/responses (see catalogue.mjs), and the
 * rules the journeys depend on follow casspea-v2: carts and checkout sessions
 * per browser, a guest session saved only once it has an email (BUG-10), the
 * £6 shipping discount from £56, discount codes with a minimum order, no
 * collection for a fixed-dispatch cart (BUG-19), and a client page behind a
 * code. Anything else answers 404 and is logged, so a page calling an
 * endpoint the mock does not know shows up in the tests.
 *
 * Run: node e2e/mock-api/server.mjs (port MOCK_API_PORT, default 4010).
 * /__e2e/state shows the calling browser's cart, session and the Stripe
 * sessions it asked for.
 */
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import * as C from './catalogue.mjs';

const PORT = Number(process.env.MOCK_API_PORT || 4010);
const NOW = '2026-01-01T00:00:00Z';
const ADDRESS_TEMPLATE = C.contract('address-created.json').shipping_address;
const STORE_STATUS = C.contract('store-status.json');

let nextId = 1;
const newId = () => nextId++;
const sessions = new Map();

function newState() {
    return {
        cart: { id: newId(), items: [], discount: null, gift_message: '', shipping_date: null, pickup_date: null, pickup_time: null },
        checkout: { id: null, email: null, shipping_address: null, billing_address: null, shipping_option: null },
        client: { unlocked: false, attempts: 0 },
        stripeSessions: [],
    };
}

const money = n => (Math.round(n * 100) / 100).toFixed(2);

function cartJson({ cart }) {
    const code = cart.discount;
    const discount = code ? C.discounts[code] : null;
    const base = cart.items.reduce((sum, item) => sum + Number(item.product.current_price) * item.quantity, 0);
    const discountable = cart.items.filter(item => !item.product.block_discount_codes);
    const valid = !!discount && base >= discount.min_order_value && discountable.length > 0;
    const percent = valid && discount.discount_type === 'PERCENTAGE' ? discount.amount : 0;

    const items = cart.items.map(item => {
        const itemBase = Number(item.product.current_price) * item.quantity;
        const itemDiscounted = percent && !item.product.block_discount_codes ? itemBase * (1 - percent / 100) : itemBase;
        return {
            id: item.id,
            quantity: item.quantity,
            product: item.product,
            selected_custom_option_key: item.selected_custom_option_key ?? null,
            box_customization: item.box_customization,
            pack_customization: item.pack_customization,
            base_price: money(itemBase),
            discounted_price: money(itemDiscounted),
            savings: money(itemBase - itemDiscounted),
        };
    });

    let total = base;
    if (valid) {
        total = percent
            ? base - (discountable.reduce((s, i) => s + Number(i.product.current_price) * i.quantity, 0) * percent) / 100
            : Math.max(base - discount.amount, 0);
    }
    return {
        id: cart.id,
        items,
        discount: code
            ? {
                  id: code, title: discount.title, code, stripe_id: `coupon_${code}`, discount_type: discount.discount_type,
                  amount: discount.amount, exclusions: [], active: true, start_date: null, end_date: null,
                  min_order_value: discount.min_order_value, created: NOW, updated: NOW,
              }
            : null,
        gift_message: cart.gift_message,
        shipping_date: cart.shipping_date,
        pickup_date: cart.pickup_date,
        pickup_time: cart.pickup_time,
        base_total: money(base),
        discounted_total: money(total),
        total_savings: money(Math.ceil((base - total) * 100) / 100),
        is_discount_valid: valid,
        created: NOW,
        updated: NOW,
    };
}

function shippingPrice(option, cartTotal) {
    const original = Number(option.price);
    return cartTotal >= C.SHIPPING_DISCOUNT_THRESHOLD ? Math.max(original - C.SHIPPING_DISCOUNT_AMOUNT, 0) : original;
}

function sessionJson(state) {
    const cart = cartJson(state);
    const option = state.checkout.shipping_option ? C.shippingOptionById(state.checkout.shipping_option) : null;
    const shipping = option ? shippingPrice(option, Number(cart.discounted_total)) : 0;
    return {
        id: state.checkout.id,
        shipping_address: state.checkout.shipping_address,
        billing_address: state.checkout.billing_address,
        cart_total: cart.discounted_total,
        shipping_option: option,
        shipping_cost: money(shipping),
        total_with_shipping: money(Number(cart.discounted_total) + shipping),
        email: state.checkout.email,
        phone: null,
        created: NOW,
        updated: NOW,
        payment_status: 'pending',
        stripe_payment_intent: null,
        stripe_session_id: null,
        cart: state.cart.id,
    };
}

const isFixedDispatchCart = ({ cart }) => cart.items.some(item => item.product.fixed_dispatch_date);
const PICKUP_REFUSAL = 'Your order contains an item we post on a fixed day, so it cannot be collected in store.';

function parseQuantity(value) {
    const quantity = typeof value === 'number' ? value : /^\d+$/.test(String(value)) ? Number(value) : NaN;
    if (!Number.isInteger(quantity)) return { error: { quantity: 'Quantity must be a whole number' } };
    if (quantity < 1) return { error: { quantity: 'Quantity must be greater than 0' } };
    return { quantity };
}

function address(data, type) {
    const [first_name = '', ...rest] = String(data.full_name ?? '').split(' ');
    return {
        ...ADDRESS_TEMPLATE,
        ...data,
        id: newId(),
        address_type: type,
        first_name,
        last_name: rest.join(' '),
        created: NOW,
        updated: NOW,
    };
}

const UNAUTHORISED = [401, { detail: 'Authentication credentials were not provided.' }];

/** [method, path pattern, handler(state, match, body, url)] → [status, body] */
const routes = [
    ['GET', /^\/__e2e\/health\/?$/, () => [200, { ok: true }]],
    ['GET', /^\/__e2e\/state\/?$/, state => [200, { cart: cartJson(state), session: sessionJson(state), stripeSessions: state.stripeSessions }]],

    ['GET', /^\/api\/products\/?$/, () => [200, C.products.filter(p => p.active)]],
    ['GET', /^\/api\/products\/categories\/?$/, () => [200, C.categories]],
    ['GET', /^\/api\/products\/categories\/([^/]+)\/?$/, (s, [, slug]) => {
        const category = C.categories.find(c => c.slug === slug);
        return category ? [200, category] : [404, { detail: 'Not found.' }];
    }],
    ['GET', /^\/api\/products\/admin\/.*$/, () => UNAUTHORISED],
    ['GET', /^\/api\/products\/([^/]+)\/?$/, (s, [, slug]) => {
        const product = C.productBySlug(slug);
        return product ? [200, product] : [404, { detail: 'Not found.' }];
    }],
    ['GET', /^\/api\/flavours\/?$/, () => [200, C.flavours]],

    ['GET', /^\/api\/carts\/?$/, state => [200, cartJson(state)]],
    ['POST', /^\/api\/carts\/?$/, (state, m, body) => {
        const { cart } = state;
        if (body.remove_discount) cart.discount = null;
        if (typeof body.discount_code === 'string') {
            if (body.discount_code === '') cart.discount = null;
            else {
                const code = Object.keys(C.discounts).find(c => c.toLowerCase() === body.discount_code.toLowerCase());
                if (!code) return [400, { discount_code: 'Invalid discount code provided.' }];
                const base = Number(cartJson(state).base_total);
                const { min_order_value } = C.discounts[code];
                if (base < min_order_value) {
                    return [400, { discount_code: `Add £${min_order_value} or more to your order to use this discount code.` }];
                }
                cart.discount = code;
            }
        }
        for (const key of ['gift_message', 'shipping_date', 'pickup_date', 'pickup_time']) {
            if (key in body) cart[key] = body[key];
        }
        return [200, { detail: 'Cart updated successfully', cart: cartJson(state) }];
    }],
    ['POST', /^\/api\/carts\/items\/?$/, (state, m, body) => {
        const product = C.productById(body.product);
        if (!product) return [400, { product: 'Product not found' }];
        const { quantity, error } = parseQuantity(body.quantity ?? 1);
        if (error) return [400, error];
        if (product.sold_out) return [400, { product: 'This product is sold out' }];
        state.cart.items.push({
            id: newId(),
            quantity,
            product,
            selected_custom_option_key: body.selected_custom_option_key ?? null,
            box_customization: body.box_customization ? { id: newId(), allergens: [], flavor_selections: [], ...body.box_customization } : null,
            pack_customization: body.pack_customization ? { id: newId(), ...body.pack_customization } : null,
        });
        return [201, cartJson(state)];
    }],
    [/^(PUT|PATCH)$/, /^\/api\/carts\/items\/(\d+)\/(?:change-quantity\/?)?$/, (state, [, id], body) => {
        const item = state.cart.items.find(i => String(i.id) === id);
        if (!item) return [404, { detail: 'Not found.' }];
        if ('quantity' in body) {
            const { quantity, error } = parseQuantity(body.quantity);
            if (error) return [400, error];
            item.quantity = quantity;
        }
        return [200, cartJson(state)];
    }],
    ['DELETE', /^\/api\/carts\/items\/(\d+)\/(?:remove\/?)?$/, (state, [, id]) => {
        state.cart.items = state.cart.items.filter(i => String(i.id) !== id);
        return [200, cartJson(state)];
    }],

    ['GET', /^\/api\/checkout\/store-status\/?$/, () => [200, STORE_STATUS]],
    ['GET', /^\/api\/checkout\/session\/?$/, state => [200, sessionJson(state)]],
    ['POST', /^\/api\/checkout\/session\/?$/, (state, m, body) => {
        if (typeof body.email === 'string' && body.email) {
            state.checkout.email = body.email;
            state.checkout.id ??= newId();
        }
        if (!state.checkout.id) return [400, { error: 'Email is required for guest checkout' }];
        if (body.shipping_option_id) {
            const option = C.shippingOptionById(body.shipping_option_id);
            if (!option) return [400, { error: 'Invalid shipping option' }];
            if (option.delivery_speed === 'PICKUP' && isFixedDispatchCart(state)) return [400, { error: PICKUP_REFUSAL }];
            state.checkout.shipping_option = option.id;
        }
        return [200, sessionJson(state)];
    }],
    ['POST', /^\/api\/checkout\/session\/([^/]+)\/shipping-option\/?$/, (state, [, id], body) => {
        if (!state.checkout.id || String(state.checkout.id) !== id) return [404, { error: 'Checkout session not found' }];
        const option = C.shippingOptionById(body.shipping_option_id);
        if (!option) return [400, { error: 'Invalid shipping option' }];
        if (option.delivery_speed === 'PICKUP' && isFixedDispatchCart(state)) return [400, { error: PICKUP_REFUSAL }];
        state.checkout.shipping_option = option.id;
        if (body.pickup_date && body.pickup_time) {
            state.cart.pickup_date = body.pickup_date;
            state.cart.pickup_time = body.pickup_time;
        }
        return [200, sessionJson(state)];
    }],
    ['GET', /^\/api\/shipping\/options\/?$/, state => [200, C.shippingCompanies(Number(cartJson(state).discounted_total))]],

    ['GET', /^\/api\/addresses\/?$/, () => [200, []]],
    ['POST', /^\/api\/addresses\/?$/, (state, m, body) => {
        if (!state.checkout.id) return [400, { error: 'Email is required for guest checkout' }];
        if (body.shipping_address) state.checkout.shipping_address = address(body.shipping_address, 'SHIPPING');
        if (body.billing_address) state.checkout.billing_address = address(body.billing_address, 'BILLING');
        return [201, {
            shipping_address: state.checkout.shipping_address,
            billing_address: state.checkout.billing_address,
            checkout_session: sessionJson(state),
        }];
    }],

    ['POST', /^\/api\/checkout\/stripe\/create-session\/?$/, state => {
        const session = sessionJson(state);
        if (!session.id) return [500, { error: 'An unexpected error occurred' }];
        if (!session.shipping_address) return [400, { error: 'Shipping address is required' }];
        if (!state.cart.items.length) return [400, { error: 'Cart is empty' }];
        if (session.shipping_option?.delivery_speed === 'PICKUP' && isFixedDispatchCart(state)) {
            return [400, { error: PICKUP_REFUSAL }];
        }
        const id = `cs_test_e2e_${newId()}`;
        state.stripeSessions.push({ id, session, cart: cartJson(state) });
        return [200, { url: `https://checkout.stripe.com/c/pay/${id}` }];
    }],

    ['GET', /^\/api\/clients\/([^/]+)\/?$/, (state, [, slug]) => {
        if (slug !== C.CLIENT_SLUG) return [404, { detail: 'Not found.' }];
        return [200, state.client.unlocked ? C.clientPageUnlocked : C.clientPageLocked];
    }],
    ['POST', /^\/api\/clients\/([^/]+)\/unlock\/?$/, (state, [, slug], body) => {
        if (slug !== C.CLIENT_SLUG) return [404, { detail: 'Not found.' }];
        state.client.attempts += 1;
        if (state.client.attempts > 10) return [429, { detail: 'Request was throttled.' }];
        if (body.code !== C.CLIENT_CODE) return [400, { code: 'That code is not right.' }];
        state.client.unlocked = true;
        return [200, C.clientPageUnlocked];
    }],

    ['POST', /^\/api\/leads\/(subscribe|generic-lead)\/?$/, () => [201, { message: 'Subscribed successfully' }]],
    ['POST', /^\/api\/leads\/unsubscribe\/?$/, () => [200, { message: 'You have been unsubscribed.' }]],
    ['POST', /^\/api\/experiments\/assign\/?$/, () => [200, { variant: 'control' }]],
    ['POST', /^\/api\/experiments\/event\/?$/, () => [201, {}]],
    ['GET', /^\/api\/personalized\/templates\/?$/, () => [200, []]],
    ['GET', /^\/api\/personalized\/templates\/([^/]+)\/?$/, () => [404, { detail: 'Not found.' }]],
    ['POST', /^\/api\/users\/jwt\/(verify|refresh)\/?$/, () => [401, { detail: 'Token is invalid or expired' }]],

    // Staff-only screens: a guest is turned away, as by the real API.
    [/^(GET|POST)$/, /^\/api\/(orders|addresses\/(stats|sms-contacts)|experiments\/[^/]+\/results|clients\/admin|royalmail)(\/.*)?$/, () => UNAUTHORISED],
];

function readBody(req) {
    return new Promise(resolve => {
        let raw = '';
        req.on('data', chunk => (raw += chunk));
        req.on('end', () => {
            try {
                resolve(raw ? JSON.parse(raw) : {});
            } catch {
                resolve({});
            }
        });
    });
}

const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Vary', 'Origin');
    }
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'content-type');
        res.writeHead(204);
        res.end();
        return;
    }

    const route = routes.find(([method, pattern]) =>
        (typeof method === 'string' ? method === req.method : method.test(req.method)) && pattern.test(url.pathname),
    );
    if (!route) {
        console.warn(`[mock-api] no route for ${req.method} ${url.pathname}`);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ detail: 'Not found.' }));
        return;
    }

    const sid = /(?:^|;\s*)mock_session=([^;]+)/.exec(req.headers.cookie ?? '')?.[1];
    let id = sid && sessions.has(sid) ? sid : null;
    if (!id) {
        id = randomUUID();
        sessions.set(id, newState());
        res.setHeader('Set-Cookie', `mock_session=${id}; Path=/; SameSite=Lax; HttpOnly`);
    }

    const [, pattern, handler] = route;
    const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : {};
    const [status, payload] = handler(sessions.get(id), pattern.exec(url.pathname), body, url);
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
});

server.listen(PORT, () => console.log(`[mock-api] listening on http://localhost:${PORT}`));
