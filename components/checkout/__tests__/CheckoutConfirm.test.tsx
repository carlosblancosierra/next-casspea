import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutConfirm from '@/components/checkout/CheckoutConfirm';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { makeCart } from '@/test-utils/makeCart';

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
}));

jest.mock('@/redux/features/shipping/shippingApiSlice', () => ({
    useGetShippingOptionsQuery: jest.fn(),
}));

jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({
    useGetSessionQuery: jest.fn(() => ({ data: { id: 1 }, isLoading: false, error: undefined })),
    useUpdateSessionMutation: jest.fn(() => [jest.fn(), {}]),
    useCreateStripeCheckoutSessionMutation: jest.fn(() => [jest.fn(), {}]),
    useUpdateShippingOptionMutation: jest.fn(() => [jest.fn(), {}]),
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

    it('shows no total until a delivery option is chosen', () => {
        render(<CheckoutConfirm />);

        expect(screen.queryByText(/Total incl. delivery/i)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /continue to secure payment/i })).toBeDisabled();
    });

    it('adds the chosen delivery price to the cart total, matching the backend', async () => {
        render(<CheckoutConfirm />);

        const option = screen.getAllByRole('radio')
            .find(r => (r as HTMLInputElement).value === '3') as HTMLInputElement;
        await userEvent.click(option);

        // total_with_shipping = cart.discounted_total + shipping price
        // 29.98 + 5.99 = 35.97
        expect(await screen.findByText('£35.97')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /continue to secure payment/i })).toBeEnabled();
    });
});
