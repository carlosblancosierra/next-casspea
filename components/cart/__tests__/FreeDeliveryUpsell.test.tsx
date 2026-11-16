import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FreeDeliveryUpsell, { FREE_DELIVERY_THRESHOLD, UPSELL_SLUG } from '@/components/cart/FreeDeliveryUpsell';
import { useAddCartItemMutation, useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { track } from '@/utils/analytics';
import { makeCart } from '@/test-utils/makeCart';

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useAddCartItemMutation: jest.fn(),
}));
jest.mock('@/redux/features/products/productApiSlice', () => ({ useGetProductsQuery: jest.fn() }));
jest.mock('@/utils/analytics', () => ({
    ...jest.requireActual('@/utils/analytics'),
    track: jest.fn(),
}));

const addCartItem = jest.fn();
const boxOf9 = { id: 4, slug: UPSELL_SLUG, name: 'Signature Box of 9', current_price: '23.00', sold_out: false };

function withCart(total: string, items = makeCart().items) {
    (useGetCartQuery as jest.Mock).mockReturnValue({ data: makeCart({ discounted_total: total, items }) });
}

beforeEach(() => {
    addCartItem.mockReset();
    addCartItem.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    (useAddCartItemMutation as jest.Mock).mockReturnValue([addCartItem, { isLoading: false }]);
    (useGetProductsQuery as jest.Mock).mockReturnValue({ data: [boxOf9] });
    (track as jest.Mock).mockClear();
});

describe('FreeDeliveryUpsell', () => {
    it('uses the £56 threshold from the shipping options', () => {
        expect(FREE_DELIVERY_THRESHOLD).toBe(56);
    });

    it('says how far the cart is from free delivery and offers the box of 9', () => {
        withCart('37.50');
        render(<FreeDeliveryUpsell />);
        expect(screen.getByText(/£18\.50 away from free UK delivery/)).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '67');
        expect(screen.getByRole('button', { name: /add a surprise box of 9 · £23\.00/i })).toBeInTheDocument();
        expect(track).toHaveBeenCalledWith('upsell_shown', { product_id: 4, remaining: 18.5, cart_total: 37.5 });
    });

    it('celebrates once the cart qualifies, with no offer', () => {
        withCart('60.50');
        render(<FreeDeliveryUpsell />);
        expect(screen.getByText(/unlocked free UK delivery/i)).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('adds a surprise box of 9 with the allergens already chosen for the cart', async () => {
        const items = [
            { ...makeCart().items[0], box_customization: { selection_type: 'RANDOM', allergens: [{ id: 3 }, { id: 7 }] } },
        ] as any;
        withCart('37.50', items);
        render(<FreeDeliveryUpsell />);
        await userEvent.click(screen.getByRole('button', { name: /add a surprise box of 9/i }));
        expect(addCartItem).toHaveBeenCalledWith({
            product: 4,
            quantity: 1,
            box_customization: { selection_type: 'RANDOM', allergens: [3, 7] },
        });
        await waitFor(() => expect(track).toHaveBeenCalledWith('upsell_added', { product_id: 4, remaining: 18.5 }));
    });

    it('shows only the progress when the box of 9 is sold out', () => {
        (useGetProductsQuery as jest.Mock).mockReturnValue({ data: [{ ...boxOf9, sold_out: true }] });
        withCart('37.50');
        render(<FreeDeliveryUpsell />);
        expect(screen.getByText(/away from free UK delivery/)).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders nothing for an empty cart', () => {
        withCart('0.00', []);
        const { container } = render(<FreeDeliveryUpsell />);
        expect(container).toBeEmptyDOMElement();
    });
});
