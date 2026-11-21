import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CartCheckout from '@/components/cart/CartCheckout';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetSessionQuery } from '@/redux/features/checkout/checkoutApiSlice';
import type { Cart } from '@/types/carts';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useUpdateCartMutation: jest.fn(() => [
        jest.fn(() => ({ unwrap: () => Promise.resolve({}) })),
        {},
    ]),
}));

jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({
    useGetSessionQuery: jest.fn(() => ({ data: undefined, isLoading: false })),
    useUpdateSessionMutation: jest.fn(() => [
        jest.fn(() => ({ unwrap: () => Promise.resolve({}) })),
        {},
    ]),
}));

jest.mock('@/hooks/useStoreStatus', () => ({
    useStoreStatus: () => ({ isClosed: false, reopenLabel: '' }),
}));

// The discount form has its own suite; this is about whether it is reachable.
jest.mock('@/components/cart/DiscountForm', () => ({
    __esModule: true,
    default: () => <div data-testid="discount-form" />,
}));

const mockCart = useGetCartQuery as jest.Mock;

const baseCart = {
    items: [{ id: 1, quantity: 1, product: { id: 1, name: 'Box of 24' } }],
    base_total: '39.99',
    discounted_total: '39.99',
} as unknown as Cart;

describe('CartCheckout discount panel', () => {
    beforeEach(() => jest.clearAllMocks());

    it('opens with the box ticked when a code is already on the cart', () => {
        // Otherwise a reload hides the form, and with it the applied code and
        // the only way to remove it.
        mockCart.mockReturnValue({
            data: { ...baseCart, discount: { code: 'WELCOME10' } },
            isLoading: false,
        });

        render(<CartCheckout />);

        expect(screen.getByLabelText(/Add Discount Code/i)).toBeChecked();
        expect(screen.getByTestId('discount-form')).toBeInTheDocument();
    });

    it('says an already-discounted item keeps its price, without naming a campaign', () => {
        // The copy used to read "Your Summer Break box stays at 25% off". That
        // sale is over; block_discount_codes is a generic flag and any product
        // can carry it.
        mockCart.mockReturnValue({
            data: {
                ...baseCart,
                items: [{ id: 1, quantity: 1, product: { id: 1, name: 'Clearance box', block_discount_codes: true } }],
            },
            isLoading: false,
        });

        render(<CartCheckout />);

        expect(screen.getByText(/already discounted/i)).toBeInTheDocument();
        expect(screen.queryByText(/Summer Break/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/25% off/i)).not.toBeInTheDocument();
    });

    it('says nothing when every item can take a code', () => {
        mockCart.mockReturnValue({ data: baseCart, isLoading: false });

        render(<CartCheckout />);

        expect(screen.queryByText(/already discounted/i)).not.toBeInTheDocument();
    });

    it('stays closed when there is no code', () => {
        mockCart.mockReturnValue({ data: baseCart, isLoading: false });

        render(<CartCheckout />);

        expect(screen.getByLabelText(/Add Discount Code/i)).not.toBeChecked();
        expect(screen.queryByTestId('discount-form')).not.toBeInTheDocument();
    });
});

describe('CartCheckout on a client order', () => {
    const clientCart = { ...baseCart, is_client_order: true } as Cart;

    beforeEach(() => jest.clearAllMocks());

    it('hides the discount code, even one already on the cart', () => {
        mockCart.mockReturnValue({
            data: { ...clientCart, discount: { code: 'WELCOME10' } },
            isLoading: false,
        });

        render(<CartCheckout />);

        expect(screen.queryByLabelText(/Add Discount Code/i)).not.toBeInTheDocument();
        expect(screen.queryByTestId('discount-form')).not.toBeInTheDocument();
        expect(screen.queryByText(/WELCOME10/)).not.toBeInTheDocument();
    });

    it.each([
        [true, '/checkout/address'],
        [false, '/checkout/gift-card'],
    ])('client order %s goes to %s', async (isClientOrder, path) => {
        (useGetSessionQuery as jest.Mock).mockReturnValue({ data: { email: 'a@example.com' }, isLoading: false });
        mockCart.mockReturnValue({ data: { ...baseCart, is_client_order: isClientOrder }, isLoading: false });

        render(<CartCheckout />);
        fireEvent.click(screen.getByRole('button', { name: /checkout/i }));

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith(path));
    });
});
