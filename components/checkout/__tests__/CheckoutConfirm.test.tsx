import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutConfirm from '@/components/checkout/CheckoutConfirm';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { makeCart } from '@/test-utils/makeCart';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useUpdateCartMutation: jest.fn(() => [
        jest.fn(() => ({ unwrap: () => Promise.resolve({}) })),
        {},
    ]),
}));

jest.mock('@/redux/features/shipping/shippingApiSlice', () => ({
    useGetShippingOptionsQuery: jest.fn(),
}));

const createStripeSession = jest.fn(() => ({ unwrap: () => Promise.resolve({ url: '' }) }));

jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({
    useGetSessionQuery: jest.fn(() => ({ data: { id: 1 }, isLoading: false, error: undefined })),
    useUpdateSessionMutation: jest.fn(() => [jest.fn(), {}]),
    useCreateStripeCheckoutSessionMutation: jest.fn(() => [createStripeSession, {}]),
    useUpdateShippingOptionMutation: jest.fn(() => [
        jest.fn(() => ({ unwrap: () => Promise.resolve({}) })),
        {},
    ]),
}));

jest.mock('@/hooks/useStoreStatus', () => ({
    useStoreStatus: () => ({ isOpen: true, isClosed: false, deadlineIso: null, reopenLabel: '' }),
}));

jest.mock('@/components/checkout/CheckoutDetails', () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock('@/components/checkout/CheckoutStorePickUp', () => ({
    __esModule: true,
    default: () => null,
}));

const mockUseGetCartQuery = useGetCartQuery as jest.Mock;
const mockUseGetShippingOptionsQuery = useGetShippingOptionsQuery as jest.Mock;

const companies = [
    {
        id: 1,
        name: 'Royal Mail',
        code: 'rm',
        shipping_options: [
            {
                id: 3,
                name: 'Tracked 24',
                delivery_speed: 'PRIORITY',
                price: '5.99',
                original_price: '5.99',
                discount_amount: '0.00',
                estimated_days_min: 1,
                estimated_days_max: 2,
            },
            {
                id: 34,
                name: 'Store pickup',
                delivery_speed: 'PICKUP',
                price: '0.00',
                original_price: '0.00',
                discount_amount: '0.00',
                estimated_days_min: 0,
                estimated_days_max: 0,
            },
        ],
    },
];

describe('CheckoutConfirm total', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // 2 x £14.99, no discount
        mockUseGetCartQuery.mockReturnValue({
            data: makeCart({ discounted_total: '29.98' }),
            isLoading: false,
            error: undefined,
        });
        mockUseGetShippingOptionsQuery.mockReturnValue({ data: companies, isLoading: false });
    });

    it('shows no total until a delivery option is chosen, but stays clickable', () => {
        render(<CheckoutConfirm />);

        expect(screen.queryByText(/Total incl. delivery/i)).not.toBeInTheDocument();
        // A button disabled for missing input explains nothing and is skipped by
        // screen readers. It stays clickable and says what is missing instead;
        // only an in-flight payment disables it.
        expect(screen.getByRole('button', { name: /continue to secure payment/i })).toBeEnabled();
        expect(screen.getByText(/choose a delivery option to continue/i)).toBeInTheDocument();
    });

    it('adds the chosen delivery price to the cart total, matching the backend', async () => {
        render(<CheckoutConfirm />);

        // Options only appear once "when do you need it?" is answered.
        await userEvent.click(screen.getByRole('radio', { name: 'As soon as possible' }));

        const option = screen.getAllByRole('radio')
            .find(r => (r as HTMLInputElement).value === '3') as HTMLInputElement;
        await userEvent.click(option);

        // total_with_shipping = cart.discounted_total + shipping price
        // 29.98 + 5.99 = 35.97
        expect(await screen.findByText('£35.97')).toBeInTheDocument();
        expect(screen.queryByText(/choose a delivery option to continue/i)).not.toBeInTheDocument();
    });

    it('switching back to shipping really clears the pick, not just the radios', async () => {
        render(<CheckoutConfirm />);

        await userEvent.click(screen.getByRole('radio', { name: 'As soon as possible' }));
        const option = screen.getAllByRole('radio')
            .find(r => (r as HTMLInputElement).value === '3') as HTMLInputElement;
        await userEvent.click(option);

        await userEvent.click(screen.getByRole('radio', { name: 'Collect in store' }));
        await userEvent.click(screen.getByRole('radio', { name: 'Ship to me' }));

        // The callback had no way to say "nothing", so the parent kept the
        // pickup id. Nothing was ticked on screen, this hint stayed hidden,
        // and Continue answered "Please select a pickup date and time slot" —
        // to someone who had just chosen shipping.
        expect(screen.getByText(/choose a delivery option to continue/i)).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: /continue to secure payment/i }));
        expect(toast.error).toHaveBeenCalledWith('Please select a shipping method');
        expect(createStripeSession).not.toHaveBeenCalled();
    });

    it('clicking with nothing chosen does not start a payment', async () => {
        render(<CheckoutConfirm />);

        await userEvent.click(screen.getByRole('button', { name: /continue to secure payment/i }));

        // The button being clickable is a UX choice; it must not weaken the
        // guarantee that nobody reaches Stripe without choosing delivery.
        expect(createStripeSession).not.toHaveBeenCalled();
    });
});
