import { ID_MAP, PACK_ID_TO_UNITS, PACK_QUERY_PARAM } from '@/components/packs/constants';

describe('pack id mapping', () => {
    it('reverses ID_MAP exactly', () => {
        // A pack slug in the store redirects to its box using this. If the two
        // drift, someone building a "pack of 24" adds a pack of 9 to the cart.
        for (const [units, packId] of Object.entries(ID_MAP)) {
            expect(PACK_ID_TO_UNITS[packId]).toBe(Number(units));
        }
        expect(Object.keys(PACK_ID_TO_UNITS)).toHaveLength(Object.keys(ID_MAP).length);
    });

    it('maps only the pack SKUs', () => {
        // A box id must not look like a pack id, or the box page would redirect
        // to itself forever.
        expect(PACK_ID_TO_UNITS[9]).toBeUndefined();
        expect(PACK_ID_TO_UNITS[170]).toBe(9);
    });

    it('names the query param once', () => {
        expect(PACK_QUERY_PARAM).toBe('pack');
    });
});
