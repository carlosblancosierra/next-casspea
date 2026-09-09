import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutConfirm from '@/components/checkout/CheckoutConfirm';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { makeCart } from '@/test-utils/makeCart';

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

const updateCart = jest.fn(() => ({ unwrap: () => Promise.resolve({}) }));

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useUpdateCartMutation: jest.fn(() => [updateCart, {}]),
}));

jest.mock('@/redux/features/shipping/shippingApiSlice', () => ({
    useGetShippingOptionsQuery: jest.fn(),
}));

jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({
    useGetSessionQuery: jest.fn(() => ({ data: { id: 1 }, isLoading: false, error: undefined })),
    useUpdateSessionMutation: jest.fn(() => [jest.fn(), {}]),
    useCreateStripeCheckoutSessionMutation: jest.fn(() => [
        jest.fn(() => ({ unwrap: () => Promise.resolve({ url: '' }) })),
        {},
    ]),
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

// Stubbed so this file tests the wiring between the delivery step and the
// cart, rather than re-driving the date picker that its own suite covers.
jest.mock('@/components/checkout/CheckoutShippingOptions', () => ({
    __esModule: true,
    default: ({ onShippingOptionChange, onDispatchDateChange, onChangeStorePickup }: any) => (
        <div>
            <button onClick={() => onShippingOptionChange(3)}>choose shipping</button>
            <button onClick={() => onDispatchDateChange('2026-09-21')}>hold until the 21st</button>
            <button
                onClick={() => {
                    onShippingOptionChange(34);
                    onDispatchDateChange(null);
                    onChangeStorePickup({
                        date: new Date('2026-09-21T00:00:00Z'),
                        slot: { start: '10:00', end: '10:30', value: '10:00-10:30' },
                    });
                }}
            >
                choose collection
            </button>
        </div>
    ),
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

const setCart = (overrides = {}) =>
    mockUseGetCartQuery.mockReturnValue({
        data: makeCart(overrides),
        isLoading: false,
        error: undefined,
    });

describe('CheckoutConfirm posting date', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setCart();
        mockUseGetShippingOptionsQuery.mockReturnValue({ data: companies, isLoading: false });
    });

    const proceed = async () => {
        await userEvent.click(screen.getByRole('button', { name: /continue to secure payment/i }));
    };

    it('saves the posting date the customer chose', async () => {
        render(<CheckoutConfirm />);

        await userEvent.click(screen.getByText('choose shipping'));
        await userEvent.click(screen.getByText('hold until the 21st'));
        await proceed();

        expect(updateCart).toHaveBeenCalledWith({ shipping_date: '2026-09-21' });
    });

    it('clears a posting date saved earlier when the order is collected in store', async () => {
        setCart({ shipping_date: '2026-09-21' });
        render(<CheckoutConfirm />);

        await userEvent.click(screen.getByText('choose collection'));
        await proceed();

        // Collection has its own date and time. Leaving a posting date on the
        // cart would put a shipping day on an order nobody is shipping.
        expect(updateCart).toHaveBeenCalledWith({ shipping_date: null });
    });

    it('does not write to the cart when the posting date has not changed', async () => {
        render(<CheckoutConfirm />);

        await userEvent.click(screen.getByText('choose shipping'));
        await proceed();

        // updateCart invalidates ShippingOptions, so a needless write refetches
        // the whole options list on the way to Stripe.
        expect(updateCart).not.toHaveBeenCalled();
    });
});
