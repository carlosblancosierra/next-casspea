import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartCheckout from '@/components/cart/CartCheckout';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import type { Cart } from '@/types/carts';

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

const mockUpdateSession = jest.fn((_body: unknown) => ({ unwrap: () => Promise.resolve({}) }));
const mockPush = jest.fn();

jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({
    useGetSessionQuery: jest.fn(() => ({ data: undefined, isLoading: false })),
    useUpdateSessionMutation: jest.fn(() => [mockUpdateSession, {}]),
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

describe('CartCheckout email', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.localStorage.clear();
    });

    it('remembers the email a guest checked out with for their next cart', async () => {
        // The email lives on the checkout session, which belongs to one cart,
        // so a guest was asked again on every order.
        mockCart.mockReturnValue({ data: baseCart, isLoading: false });
        const { unmount } = render(<CartCheckout />);

        await userEvent.click(screen.getByRole('button', { name: /Continue to Checkout/i }));
        await userEvent.type(screen.getByPlaceholderText(/email address/i), 'ada@example.com');
        await userEvent.click(screen.getAllByRole('button', { name: /Continue to Checkout/i }).at(-1)!);
        await waitFor(() => expect(mockPush).toHaveBeenCalled());
        unmount();

        // Next visit, new cart, no session email.
        render(<CartCheckout />);
        expect(await screen.findByText('ada@example.com')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: /Continue to Checkout/i }));
        expect(mockUpdateSession).toHaveBeenLastCalledWith({ email: 'ada@example.com' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not ask a logged-in customer for an email', async () => {
        // The API uses the account's email for a cart with a user.
        mockCart.mockReturnValue({ data: { ...baseCart, user: 3 }, isLoading: false });
        render(<CartCheckout />);

        await userEvent.click(screen.getByRole('button', { name: /Continue to Checkout/i }));

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(mockUpdateSession).toHaveBeenCalledWith({});
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/checkout/gift-card'));
    });
});
