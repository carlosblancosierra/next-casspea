import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import CheckoutConfirm from '@/components/checkout/CheckoutConfirm';
import AddressPage from '@/app/checkout/address/page';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetSessionQuery } from '@/redux/features/checkout/checkoutApiSlice';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { makeCart } from '@/test-utils/makeCart';

/**
 * Since casspea-v2 BUG-10, a guest who has not given an email gets an unsaved
 * checkout session (id null) instead of a 500. Someone who opens a later step
 * directly could then fill it in and only fail at the end: "Failed to process
 * payment" on the confirm step, a 400 on the address step. Both steps now send
 * such a guest back to the cart, where the email is asked for.
 */

const replace = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), replace }) }));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn(), info: jest.fn() } }));
jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useUpdateCartMutation: jest.fn(() => [jest.fn(), {}]),
}));
jest.mock('@/redux/features/shipping/shippingApiSlice', () => ({ useGetShippingOptionsQuery: jest.fn() }));
jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({
    useGetSessionQuery: jest.fn(),
    useCreateStripeCheckoutSessionMutation: jest.fn(() => [jest.fn(), {}]),
    useUpdateShippingOptionMutation: jest.fn(() => [jest.fn(), {}]),
}));
jest.mock('@/redux/features/addresses/addressApiSlice', () => ({ useSetAddressesMutation: jest.fn(() => [jest.fn(), {}]) }));
jest.mock('@/hooks/useStoreStatus', () => ({
    useStoreStatus: () => ({ isOpen: true, isClosed: false, deadlineIso: null, reopenLabel: '' }),
}));
jest.mock('@/components/checkout/CheckoutDetails', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/address/AddressForm', () => ({ __esModule: true, default: () => null }));

const unsavedGuestSession = { id: null, email: null, shipping_address: null, billing_address: null, payment_status: 'pending' };
const savedSession = { ...unsavedGuestSession, id: 7, email: 'ada@example.com' };

beforeEach(() => {
    jest.clearAllMocks();
    (useGetCartQuery as jest.Mock).mockReturnValue({ data: makeCart(), isLoading: false, error: undefined });
    (useGetShippingOptionsQuery as jest.Mock).mockReturnValue({ data: [], isLoading: false });
});

const withSession = (data: object) =>
    (useGetSessionQuery as jest.Mock).mockReturnValue({ data, isLoading: false, error: undefined });

describe.each([
    ['the confirm step', () => <CheckoutConfirm />, /continue to secure payment/i],
    ['the address step', () => <AddressPage />, /continue to review order/i],
])('%s', (_, renderStep, buttonName) => {
    it('sends a guest without an email back to the cart', async () => {
        withSession(unsavedGuestSession);
        render(renderStep());

        await waitFor(() => expect(replace).toHaveBeenCalledWith('/cart'));
        expect(toast.info).toHaveBeenCalledWith('Please enter your email to continue to checkout.');
        expect(screen.queryByRole('button', { name: buttonName })).not.toBeInTheDocument();
    });

    it('lets a guest who gave their email carry on', () => {
        withSession(savedSession);
        render(renderStep());

        expect(screen.getByRole('button', { name: buttonName })).toBeInTheDocument();
        expect(replace).not.toHaveBeenCalled();
    });
});
