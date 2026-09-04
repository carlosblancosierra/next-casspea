import { render, screen } from '@testing-library/react';
import CartItem from '@/components/cart/CartItem';
import ReadOnlyCartItem from '@/components/cart/ReadOnlyCartItem';
import type { CartItem as CartItemType } from '@/types/carts';

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useChangeCartItemQuantityMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
    useRemoveCartItemMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
}));

jest.mock('@/redux/features/products/productApiSlice', () => ({
    useGetProductQuery: jest.fn(() => ({ data: undefined, isLoading: false, error: undefined })),
    useGetProductsQuery: jest.fn(() => ({ data: [], isLoading: false, error: undefined })),
}));

/** 2 x £14.99 box. The API sends line totals, and current_price is the
 *  catalogue *unit* price — the two must not be confused. */
const makeEntry = (overrides: Partial<CartItemType> = {}): CartItemType => ({
    id: 1,
    quantity: 2,
    product: { id: 4, name: 'Signature Box of 9', current_price: '14.99', image: null } as any,
    base_price: '29.98',
    discounted_price: '29.98',
    savings: '0.00',
    created: '2026-01-01T00:00:00Z',
    updated: '2026-01-01T00:00:00Z',
    ...overrides,
} as CartItemType);

describe('CartItem price', () => {
    it('shows the line total, not the catalogue unit price', () => {
        render(<CartItem entry={makeEntry()} />);

        expect(screen.getByText('£29.98')).toBeInTheDocument();
        // £14.99 is the per-box catalogue price; showing it here understated
        // the line and contradicted the checkout confirm page.
        expect(screen.queryByText('£14.99')).not.toBeInTheDocument();
    });

    it('prefers the discounted price when the cart has a discount applied', () => {
        const entry = makeEntry({ discounted_price: '23.98', savings: '6.00' });

        render(<CartItem entry={entry} />);

        expect(screen.getByText('£23.98')).toBeInTheDocument();
        expect(screen.queryByText('£29.98')).not.toBeInTheDocument();
    });

    it('falls back to base_price when no discounted price is sent', () => {
        const entry = makeEntry({ discounted_price: '' as unknown as string });

        render(<CartItem entry={entry} />);

        expect(screen.getByText('£29.98')).toBeInTheDocument();
    });

    it('agrees with the checkout confirm page for the same entry', () => {
        const entry = makeEntry({ discounted_price: '23.98' });

        const cart = render(<CartItem entry={entry} />);
        const cartPrice = screen.getByText('£23.98');
        expect(cartPrice).toBeInTheDocument();
        cart.unmount();

        render(<ReadOnlyCartItem entry={entry} />);
        expect(screen.getByText('£23.98')).toBeInTheDocument();
    });
});
