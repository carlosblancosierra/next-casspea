import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutConfirm from '@/components/checkout/CheckoutConfirm';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetSessionQuery } from '@/redux/features/checkout/checkoutApiSlice';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { makeCart } from '@/test-utils/makeCart';
import { toast } from 'react-toastify';

/**
 * Sentry CASSPEA-API-2/3: a guest paid, came back to /checkout/confirm through
 * the browser's back/forward cache and pressed pay again. The page still held
 * the session and cart from before Stripe; on the server the cart was closed
 * and a new, empty one took its place, so every press ended in "Failed to
 * process payment" just after a payment that had gone through.
 */

const replace = jest.fn();

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn(), info: jest.fn() } }));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace }),
}));

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useUpdateCartMutation: jest.fn(() => [jest.fn(() => ({ unwrap: () => Promise.resolve({}) })), {}]),
}));

jest.mock('@/redux/features/shipping/shippingApiSlice', () => ({
    useGetShippingOptionsQuery: jest.fn(),
}));

const createStripeSession = jest.fn();

jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({
    useGetSessionQuery: jest.fn(),
    useUpdateSessionMutation: jest.fn(() => [jest.fn(), {}]),
    useCreateStripeCheckoutSessionMutation: jest.fn(() => [createStripeSession, {}]),
    useUpdateShippingOptionMutation: jest.fn(() => [jest.fn(() => ({ unwrap: () => Promise.resolve({}) })), {}]),
}));

jest.mock('@/hooks/useStoreStatus', () => ({
    useStoreStatus: () => ({ isOpen: true, isClosed: false, deadlineIso: null, reopenLabel: '' }),
}));

jest.mock('@/components/checkout/CheckoutDetails', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/checkout/CheckoutStorePickUp', () => ({ __esModule: true, default: () => null }));

const companies = [{
    id: 1, name: 'Royal Mail', code: 'rm',
    shipping_options: [{
        id: 3, name: 'Tracked 24', delivery_speed: 'PRIORITY', price: '5.99', original_price: '5.99',
        discount_amount: '0.00', estimated_days_min: 1, estimated_days_max: 2,
    }],
}];

const refetchSession = jest.fn();
const refetchCart = jest.fn();

function mockCart(cart: ReturnType<typeof makeCart>) {
    (useGetCartQuery as jest.Mock).mockReturnValue({
        data: cart, isLoading: false, isFetching: false, error: undefined, refetch: refetchCart,
    });
}

describe('CheckoutConfirm after a payment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useGetSessionQuery as jest.Mock).mockReturnValue({
            data: { id: 1 }, isLoading: false, isFetching: false, error: undefined, refetch: refetchSession,
        });
        (useGetShippingOptionsQuery as jest.Mock).mockReturnValue({ data: companies, isLoading: false });
    });

    it('reads the session and cart again when restored from the back/forward cache', () => {
        mockCart(makeCart());
        render(<CheckoutConfirm />);

        act(() => {
            const event = new Event('pageshow') as PageTransitionEvent;
            Object.defineProperty(event, 'persisted', { value: true });
            window.dispatchEvent(event);
        });

        expect(refetchSession).toHaveBeenCalled();
        expect(refetchCart).toHaveBeenCalled();
    });

    it('sends an empty basket back to the cart instead of offering to pay', () => {
        mockCart(makeCart({ items: [] }));
        render(<CheckoutConfirm />);

        expect(replace).toHaveBeenCalledWith('/cart');
        expect(toast.info).toHaveBeenCalledWith(expect.stringMatching(/basket is empty/i));
        expect(screen.queryByRole('button', { name: /continue to secure payment/i })).not.toBeInTheDocument();
    });

    it("shows the API's reason when the payment cannot start", async () => {
        mockCart(makeCart());
        createStripeSession.mockReturnValue({
            unwrap: () => Promise.reject({ status: 400, data: { error: 'Shipping address is required' } }),
        });
        render(<CheckoutConfirm />);

        await userEvent.click(screen.getByRole('radio', { name: 'As soon as possible' }));
        const option = screen.getAllByRole('radio')
            .find(r => (r as HTMLInputElement).value === '3') as HTMLInputElement;
        await userEvent.click(option);
        await userEvent.click(screen.getByRole('button', { name: /continue to secure payment/i }));

        expect(toast.error).toHaveBeenCalledWith('Shipping address is required');
    });
});
