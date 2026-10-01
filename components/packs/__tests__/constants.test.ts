import { ID_MAP, PACK_ID_TO_UNITS, PACK_QUERY_PARAM, packRedirectTarget } from '@/components/packs/constants';

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

describe('packRedirectTarget', () => {
    const signature = { id: 1, slug: 'signature-boxes' };
    const box24 = { id: 12, slug: 'box-of-24', units_per_box: 24, active: true, category: signature };
    const box9 = { id: 4, slug: 'box-of-9', units_per_box: 9, active: true, category: signature };
    const pack24 = {
        id: 172,
        slug: 'indulgence-pack-24',
        units_per_box: 24,
        active: true,
        category: { id: 9, slug: 'packs' },
    };

    it('sends a pack to its own box, in pack mode', () => {
        expect(packRedirectTarget(pack24, [box9, box24, pack24])).toBe('/shop-now/box-of-24?pack=1');
    });

    it('leaves an ordinary box alone', () => {
        expect(packRedirectTarget(box24, [box9, box24, pack24])).toBeNull();
    });

    it('never picks the pack itself, even though it carries units_per_box', () => {
        // Without this the pack matches itself, redirects to its own page, and
        // that page redirects again — forever.
        expect(packRedirectTarget(pack24, [pack24])).toBeNull();
    });

    it('does nothing when the box is not on sale', () => {
        // No box to build it in is not a reason to 404 a page.
        const retired = { ...box24, active: false };
        expect(packRedirectTarget(pack24, [retired, pack24])).toBeNull();
    });

    it('recognises the box by category id as well as slug, like the product page does', () => {
        const renamed = { ...box24, category: { id: 1, slug: 'renamed-boxes' } };
        expect(packRedirectTarget(pack24, [renamed, pack24])).toBe('/shop-now/box-of-24?pack=1');
    });
});
