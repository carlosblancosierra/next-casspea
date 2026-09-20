import { getDayTotals } from '@/components/orders/ordersUtils';
import { makeOrder } from '@/test-utils/makeOrder';
import type { Order } from '@/types/orders';

const orderWithTotal = (total: string | number): Order =>
    makeOrder({
        checkout_session: {
            ...makeOrder().checkout_session,
            total_with_shipping: total,
        },
    });

describe('getDayTotals', () => {
    it('sums day totals when the API sends numbers', () => {
        const { dayTotal } = getDayTotals([orderWithTotal(12.5), orderWithTotal(5)]);
        expect(dayTotal).toBe(17.5);
    });

    it('sums day totals when the API sends decimal strings (never concatenates)', () => {
        const { dayTotal } = getDayTotals([orderWithTotal('12.50'), orderWithTotal('5.00')]);
        expect(dayTotal).toBe(17.5);
    });

    it('treats malformed totals as zero', () => {
        const { dayTotal } = getDayTotals([orderWithTotal('not-a-price'), orderWithTotal('10.00')]);
        expect(dayTotal).toBe(10);
    });
});

/**
 * An order containing one item, shaped the way the orders API sends it.
 * Only the fields getDayTotals reads are given, hence the cast.
 */
const orderWithItem = (item: Record<string, unknown>): Order =>
    makeOrder({
        checkout_session: {
            ...makeOrder().checkout_session,
            cart: { items: [item], discounted_total: '49.00' },
        },
    } as unknown as Partial<Order>);

describe('getDayTotals production counts', () => {
    const flavours = (...names: string[]) =>
        names.map(name => ({ flavor_name: name, quantity: 3 }));

    it('counts pick & mix flavours in a plain box', () => {
        const { flavors } = getDayTotals([
            orderWithItem({
                quantity: 1,
                product: { name: 'Box of 9', units_per_box: 9 },
                box_customization: {
                    selection_type: 'PICK_AND_MIX',
                    flavor_selections: flavours('Salted Caramel', 'Pistachio', 'Dark'),
                },
            }),
        ]);

        expect(flavors).toEqual({ 'Salted Caramel': 3, Pistachio: 3, Dark: 3 });
    });

    it('counts pick & mix flavours inside an indulgence pack', () => {
        const { flavors } = getDayTotals([
            orderWithItem({
                quantity: 1,
                product: { name: 'Indulgence Pack 9', units_per_box: 9 },
                // A pack has no box_customization at all, so keying the branch
                // on box_customization.selection_type silently counted nothing
                // — the kitchen would under-make every pack in the batch.
                pack_customization: {
                    selection_type: 'PICK_AND_MIX',
                    flavor_selections: flavours('Salted Caramel', 'Pistachio', 'Dark'),
                },
            }),
        ]);

        expect(flavors).toEqual({ 'Salted Caramel': 3, Pistachio: 3, Dark: 3 });
    });

    it('counts a surprise pack as chocolates to make', () => {
        const { randomBoxes } = getDayTotals([
            orderWithItem({
                quantity: 2,
                product: { name: 'Indulgence Pack 15', units_per_box: 15 },
                pack_customization: { selection_type: 'RANDOM', allergens: [] },
            }),
        ]);

        expect(randomBoxes).toEqual({ Random: 30 });
    });

    it('keeps allergen-free surprise boxes in their own bucket', () => {
        const { randomBoxes } = getDayTotals([
            orderWithItem({
                quantity: 1,
                product: { name: 'Box of 9', units_per_box: 9 },
                box_customization: {
                    selection_type: 'RANDOM',
                    allergens: [{ id: 6, name: 'Nut' }],
                },
            }),
        ]);

        expect(randomBoxes).toEqual({ 'Random (Nut Free)': 9 });
    });

    it('multiplies flavours by the line quantity', () => {
        const { flavors } = getDayTotals([
            orderWithItem({
                quantity: 3,
                product: { name: 'Box of 9', units_per_box: 9 },
                box_customization: {
                    selection_type: 'PICK_AND_MIX',
                    flavor_selections: [{ flavor_name: 'Dark', quantity: 9 }],
                },
            }),
        ]);

        expect(flavors).toEqual({ Dark: 27 });
    });
});
