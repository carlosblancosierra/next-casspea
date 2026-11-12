import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutErrorPage from '@/app/checkout/error/page';
import AddressPage from '@/app/checkout/address/page';
import { useGetSessionQuery } from '@/redux/features/checkout/checkoutApiSlice';
import { useSetAddressesMutation } from '@/redux/features/addresses/addressApiSlice';

/**
 * BUG-14: the address step and the embedded checkout's result page sent
 * people to /checkout/error, as do casspea-v2's StripeSuccessView and
 * StripeCancelView, and the page did not exist. The page exists now, and the
 * address step keeps the customer on the form instead.
 */

const push = jest.fn();
const replace = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push, replace }) }));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn(), info: jest.fn() } }));
jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({ useGetSessionQuery: jest.fn() }));
jest.mock('@/redux/features/addresses/addressApiSlice', () => ({ useSetAddressesMutation: jest.fn() }));
// The form's own fields are not under test; the session pre-fills the address.
jest.mock('@/components/address/AddressForm', () => ({ __esModule: true, default: () => null }));

const shippingAddress = {
    full_name: 'Ada Lovelace',
    phone: '07700900123',
    street_address: '1 Test Street',
    city: 'London',
    postcode: 'SW1A 1AA',
};

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe('/checkout/error', () => {
    it('explains what happened and offers a way back', () => {
        render(<CheckoutErrorPage />);
        expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
        expect(screen.getByText(/confirmation email/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Back to your basket' })).toHaveAttribute('href', '/cart');
        expect(screen.getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '/contact');
    });
});

describe('/checkout/address when saving fails', () => {
    it('stays on the form and says so', async () => {
        (useGetSessionQuery as jest.Mock).mockReturnValue({
            data: { id: 1, email: 'ada@example.com', shipping_address: shippingAddress, billing_address: null },
            isLoading: false,
        });
        const setAddresses = jest.fn(() => ({ unwrap: () => Promise.reject({ status: 500 }) }));
        (useSetAddressesMutation as jest.Mock).mockReturnValue([setAddresses, {}]);

        render(<AddressPage />);
        await userEvent.click(screen.getByRole('button', { name: 'Continue to Review Order' }));

        expect(setAddresses).toHaveBeenCalledTimes(1);
        expect(await screen.findByText('Failed to save addresses. Please try again.')).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
    });
});
