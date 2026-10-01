import { render, screen } from '@testing-library/react';
import ReadOnlyCartItem from '@/components/cart/ReadOnlyCartItem';
import type { CartItem } from '@/types/carts';

const entry = {
    id: 1,
    quantity: 2,
    product: { id: 4, name: 'Signature Box of 9', image: null } as any,
    // The API sends line totals: 2 x £14.99
    base_price: '29.98',
    discounted_price: '29.98',
    savings: '0.00',
    box_customization: {
        id: 1,
        cart_item: 1,
        selection_type: 'PICK_AND_MIX',
        flavor_selections: [
            { id: 1, quantity: 9, flavor: { id: 7, name: 'Salted Caramel' } },
        ],
    },
} as unknown as CartItem;

describe('ReadOnlyCartItem', () => {
    it('shows the line total without multiplying by quantity again', () => {
        render(<ReadOnlyCartItem entry={entry} />);

        // Regression: this used to render £59.96 (29.98 * 2)
        expect(screen.getByText('£29.98')).toBeInTheDocument();
        expect(screen.queryByText('£59.96')).not.toBeInTheDocument();
    });

    it('lists pick & mix flavour selections', () => {
        render(<ReadOnlyCartItem entry={entry} />);

        expect(screen.getByText(/9x Salted Caramel/)).toBeInTheDocument();
        expect(screen.getByText('Pick & Mix')).toBeInTheDocument();
    });

    it('renders quantity and product name', () => {
        render(<ReadOnlyCartItem entry={entry} />);
        expect(screen.getByText('2 x Signature Box of 9')).toBeInTheDocument();
    });
});
