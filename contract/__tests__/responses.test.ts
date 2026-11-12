/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import { makeCart } from '@/test-utils/makeCart';
import { readContractFile } from '../contractFile';

/**
 * contract/responses/ holds real responses produced by the casspea-v2 test
 * suite (its erp/tests/test_frontend_contract.py checks the live API still
 * returns these shapes). Here they keep the storefront's own tests honest: a
 * fixture may leave fields out, but it may not invent fields or nesting the
 * API never sends — that is how a test can pass against a backend that does
 * not exist (see BUG-04 in docs/plan-rediseno-seguro.md).
 */

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

/** Paths present in `fixture` that the real response does not have. */
function inventedPaths(fixture: unknown, real: Json, at = '$'): string[] {
    if (fixture === null || fixture === undefined || real === null) return [];
    if (Array.isArray(fixture)) {
        if (!Array.isArray(real)) return [`${at} is an array, the API sends ${typeof real}`];
        return real.length ? fixture.flatMap((item, i) => inventedPaths(item, real[0], `${at}[${i}]`)) : [];
    }
    if (typeof fixture === 'object') {
        if (typeof real !== 'object' || Array.isArray(real)) return [`${at} is an object, the API sends ${typeof real}`];
        return Object.entries(fixture as Record<string, unknown>).flatMap(([key, value]) =>
            key in real ? inventedPaths(value, (real as Record<string, Json>)[key], `${at}.${key}`) : [`${at}.${key}`],
        );
    }
    return [];
}

const responsesDir = path.join(__dirname, '..', 'responses');

describe('contract/responses', () => {
    it('holds the files the storefront tests rely on', () => {
        const files = fs.readdirSync(responsesDir).filter(file => file.endsWith('.json'));
        expect(files).toEqual(expect.arrayContaining([
            'cart-empty.json',
            'cart-item-created.json',
            'checkout-session.json',
            'product-detail.json',
            'shipping-options.json',
        ]));
    });

    it('POST /api/carts/items/ answers with the whole cart, not the line that was added', () => {
        // The storefront types this response as CartItem; it is a Cart.
        const added = readContractFile<Record<string, Json>>('responses/cart-item-created.json');
        expect(added).toHaveProperty('items');
        expect(added).toHaveProperty('base_total');
        expect(added).not.toHaveProperty('product');
    });
});

describe('test fixtures only use fields the API really sends', () => {
    it('makeCart()', () => {
        const real = readContractFile<Json>('responses/cart-item-created.json');
        expect(inventedPaths(makeCart(), real)).toEqual([]);
    });
});
