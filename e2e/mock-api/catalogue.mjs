/**
 * The shop's catalogue for the E2E mock API. Every object starts from a real
 * API response in contract/responses (produced by casspea-v2's test suite)
 * and only overrides values, so the storefront is tested against the shapes
 * the API guarantees, never against invented ones.
 */
import { readFileSync } from 'node:fs';

export const contract = name =>
    JSON.parse(readFileSync(new URL(`../../contract/responses/${name}`, import.meta.url), 'utf8'));

const productTemplate = contract('product-detail.json');
const categoryTemplate = contract('product-categories.json')[0];
const flavourTemplate = contract('flavours.json')[0];
const companyTemplate = contract('shipping-options.json')[0];
const optionTemplate = companyTemplate.shipping_options[0];

const category = (id, name, slug) => ({ id, name, slug, image: null, image_webp: null });

const SIGNATURE_BOXES = category(1, 'Signature Boxes', 'signature-boxes');
const GIFT_CARDS = category(8, 'Gift Cards', 'gift-cards');
const ADVENT = category(10, 'Advent Calendars', 'advent-calendars');

function product(overrides) {
    const price = overrides.base_price ?? productTemplate.base_price;
    return {
        ...productTemplate,
        gallery_images: [],
        custom_options: [],
        alert_message: null,
        badge_active: false,
        preorder: false,
        preorder_price: null,
        preorder_finish_date: null,
        is_preorder_active: false,
        sold_out: false,
        active: true,
        current_price: price,
        stripe_price_id: `price_e2e_${overrides.slug}`,
        ...overrides,
    };
}

const box = (id, units, price, image) =>
    product({
        id,
        name: `Signature Box of ${units} Hand Made Chocolates`,
        slug: `${units}-bonbons`,
        description: `A box of ${units} hand-made bonbons.`,
        seo_title: `Box of ${units}`,
        seo_description: `A box of ${units} hand-made bonbons.`,
        category: SIGNATURE_BOXES,
        base_price: price,
        units_per_box: units,
        weight: units * 15,
        image,
        thumbnail: image,
    });

/** The day the advent calendars are posted, thirty days from now. */
const inThirtyDays = () => new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);

export const products = [
    box(4, 9, '14.99', '/box-9.jpg'),
    box(2, 15, '22.99', '/box-15.png'),
    box(3, 24, '34.99', '/box-24.png'),
    box(1, 48, '74.99', '/box-48.png'),
    product({
        id: 50,
        name: 'Advent Calendar',
        slug: 'advent-calendar',
        category: ADVENT,
        base_price: '49.99',
        units_per_box: 24,
        fixed_dispatch_date: inThirtyDays(),
        disable_flavour_selection: true,
        image: '/box-24.png',
        thumbnail: '/box-24.png',
    }),
    // The gift-card step adds these ids (app/checkout/gift-card/page.tsx).
    ...[
        [137, 'Thank You'],
        [106, 'Happy Birthday'],
        [105, 'Congratulations'],
        [104, 'I Love You'],
    ].map(([id, name]) =>
        product({
            id,
            name: `${name} Card`,
            slug: `card-${id}`,
            category: GIFT_CARDS,
            base_price: '2.50',
            units_per_box: 1,
            weight: 10,
            image: null,
            thumbnail: null,
        }),
    ),
];

export const productBySlug = slug => products.find(p => p.slug === slug);
export const productById = id => products.find(p => String(p.id) === String(id));

export const categories = [SIGNATURE_BOXES, ADVENT, GIFT_CARDS].map((c, i) => ({
    ...categoryTemplate,
    ...c,
    description: `${c.name} from CassPea.`,
    order: i,
    active: true,
    products: products.filter(p => p.category.slug === c.slug),
}));

const allergenTemplate = flavourTemplate.allergens[0];
const ALLERGENS = {
    milk: { ...allergenTemplate, id: 1, name: 'Milk Solids', slug: 'milk' },
    nuts: { ...allergenTemplate, id: 2, name: 'Nuts', slug: 'nuts' },
};

export const flavours = [
    ['Salted Caramel', ['milk']],
    ['Raspberry', ['milk']],
    ['Pistachio', ['milk', 'nuts']],
    ['Hazelnut Praline', ['milk', 'nuts']],
    ['Passion Fruit', []],
    ['Dark Ganache', []],
].map(([name, allergens], i) => ({
    ...flavourTemplate,
    id: i + 1,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    allergens: allergens.map(slug => ALLERGENS[slug]),
    coming_soon: false,
}));

/** £ cart total from which every shipping option costs £6 less (casspea-v2 settings). */
export const SHIPPING_DISCOUNT_THRESHOLD = 56;
export const SHIPPING_DISCOUNT_AMOUNT = 6;

const option = (id, name, delivery_speed, price, min, max, description) => ({
    ...optionTemplate,
    id,
    name,
    delivery_speed,
    price,
    original_price: price,
    discounted_price: price,
    discount_amount: '0.00',
    estimated_days_min: min,
    estimated_days_max: max,
    description,
    disabled: false,
    disabled_reason: '',
});

const baseCompanies = [
    {
        ...companyTemplate,
        shipping_options: [
            option(2, 'Regular 48', 'REGULAR', '3.99', 2, 3, 'Tracked delivery in two to three working days (free on orders over £56)'),
            option(3, 'Tracked 24', 'PRIORITY', '5.99', 1, 2, 'Tracked delivery the next working day'),
        ],
    },
    {
        ...companyTemplate,
        id: 2,
        name: 'CassPea',
        code: 'casspea',
        website: 'https://www.casspea.co.uk',
        track_url: '',
        shipping_options: [option(7, 'Store pickup', 'PICKUP', '0.00', 0, 0, 'Collect from 104 Bedford Hill, SW12')],
    },
];

/** Shipping options as the API prices them for a cart total, in pounds. */
export function shippingCompanies(cartTotal) {
    const discounted = cartTotal !== null && cartTotal >= SHIPPING_DISCOUNT_THRESHOLD;
    return baseCompanies.map(company => ({
        ...company,
        shipping_options: company.shipping_options.map(o => {
            const original = Number(o.price);
            const price = discounted ? Math.max(original - SHIPPING_DISCOUNT_AMOUNT, 0) : original;
            return {
                ...o,
                price: price.toFixed(2),
                discounted_price: price.toFixed(2),
                discount_amount: (original - price).toFixed(2),
            };
        }),
    }));
}

export const shippingOptionById = id =>
    baseCompanies.flatMap(c => c.shipping_options).find(o => String(o.id) === String(id));

export const discounts = {
    E2E10: { title: '10% off', discount_type: 'PERCENTAGE', amount: 10, min_order_value: 0 },
    BIG20: { title: '20% off orders over £50', discount_type: 'PERCENTAGE', amount: 20, min_order_value: 50 },
};

/** The client page: contract/responses/client-page-*.json with its code. */
export const CLIENT_SLUG = 'acme';
export const CLIENT_CODE = 'ACME-2026';
export const clientPageLocked = contract('client-page-locked.json');
export const clientPageUnlocked = contract('client-page-unlocked.json');
