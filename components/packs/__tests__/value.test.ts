import { cheapestIn, packValue, pricePerPiece } from '@/components/packs/value';
import { Product } from '@/types/products';

const product = (over: Partial<Product>): Product => ({ id: 1, name: 'x', slug: 'x', ...over });

const box24 = product({ id: 12, units_per_box: 24, current_price: '55.00' });
const bark = product({ id: 30, current_price: '9.50', category: { id: 3, name: 'Barks', slug: 'chocolate-barks' } });
const dearBark = product({ id: 31, current_price: '12.00', category: { id: 3, name: 'Barks', slug: 'chocolate-barks' } });
const soldOutBark = product({ id: 32, current_price: '1.00', sold_out: true, category: { id: 3, name: 'Barks', slug: 'chocolate-barks' } });
const hot = product({ id: 40, current_price: '8.00', category: { id: 4, name: 'Hot', slug: 'hot-chocolate' } });

describe('packValue', () => {
    it('adds up the real prices of what goes in the pack', () => {
        // £55 box + £9.50 bark + £8 hot chocolate against the £60 pack of 24.
        expect(packValue(box24, [bark, hot])).toEqual({ packPrice: 60, separatePrice: 72.5, saving: 12.5 });
    });

    it('does not count an extra that was not chosen', () => {
        expect(packValue(box24, [bark, null, undefined])?.separatePrice).toBe(64.5);
    });

    it('never claims a saving that is not there', () => {
        // Parts cheaper than the pack: say nothing rather than a negative saving.
        expect(packValue(box24, [])?.saving).toBe(0);
    });

    it('has nothing to say about a size with no pack', () => {
        expect(packValue(product({ units_per_box: 7, current_price: '20' }), [])).toBeNull();
    });
});

describe('cheapestIn', () => {
    it('picks the cheapest in-stock product, so "worth" is a floor and not a boast', () => {
        expect(cheapestIn([dearBark, soldOutBark, bark, hot], 'chocolate-barks')).toBe(bark);
    });

    it('returns null for an empty category', () => {
        expect(cheapestIn([hot], 'chocolate-barks')).toBeNull();
    });
});

describe('pricePerPiece', () => {
    it('divides a box by its pieces', () => {
        expect(pricePerPiece(product({ units_per_box: 24, current_price: '60.00' }))).toBe(2.5);
    });

    it('is not a thing for a single item', () => {
        expect(pricePerPiece(product({ units_per_box: 1, current_price: '9.00' }))).toBeNull();
        expect(pricePerPiece(product({ current_price: '9.00' }))).toBeNull();
    });
});
