import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import CheckoutConfirm from '@/components/checkout/CheckoutConfirm';
import CheckoutShippingOptions from '@/components/checkout/CheckoutShippingOptions';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { makeCart } from '@/test-utils/makeCart';
import type { ShippingCompany } from '@/types/shipping';

/**
 * BUG-13: store collection was recognised by the hardcoded id 34, a row that
 * only exists in the production database. Here the collection option has id
 * 7, as it might on staging, and everything still treats it as collection.
 */

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), replace: jest.fn() }) }));
jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useUpdateCartMutation: jest.fn(() => [jest.fn(() => ({ unwrap: () => Promise.resolve({}) })), {}]),
}));
jest.mock('@/redux/features/shipping/shippingApiSlice', () => ({ useGetShippingOptionsQuery: jest.fn() }));
const createStripeSession = jest.fn(() => ({ unwrap: () => Promise.resolve({ url: '' }) }));
jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({
    useGetSessionQuery: jest.fn(() => ({ data: { id: 1 }, isLoading: false, error: undefined })),
    useUpdateSessionMutation: jest.fn(() => [jest.fn(), {}]),
    useCreateStripeCheckoutSessionMutation: jest.fn(() => [createStripeSession, {}]),
    useUpdateShippingOptionMutation: jest.fn(() => [jest.fn(() => ({ unwrap: () => Promise.resolve({}) })), {}]),
}));
jest.mock('@/hooks/useStoreStatus', () => ({
    useStoreStatus: () => ({ isOpen: true, isClosed: false, deadlineIso: null, reopenLabel: '' }),
}));
jest.mock('@/components/checkout/CheckoutDetails', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/checkout/CheckoutStorePickUp', () => ({
    __esModule: true,
    default: () => <p>collection day and slot picker</p>,
}));

const companies = [{
    id: 1,
    name: 'Royal Mail',
    code: 'rm',
    shipping_options: [
        {
            id: 3, name: 'Tracked 24', delivery_speed: 'PRIORITY', price: '5.99', original_price: '5.99',
            discount_amount: '0.00', estimated_days_min: 1, estimated_days_max: 2,
        },
        {
            id: 7, name: 'Store pickup', delivery_speed: 'PICKUP', price: '0.00', original_price: '0.00',
            discount_amount: '0.00', estimated_days_min: 0, estimated_days_max: 0,
        },
    ],
}] as unknown as ShippingCompany[];

beforeEach(() => {
    jest.clearAllMocks();
    (useGetCartQuery as jest.Mock).mockReturnValue({ data: makeCart(), isLoading: false, error: undefined });
    (useGetShippingOptionsQuery as jest.Mock).mockReturnValue({ data: companies, isLoading: false });
});

it('choosing "Collect in store" picks the collection option, whatever its id', async () => {
    const onShippingOptionChange = jest.fn();
    render(
        <CheckoutShippingOptions
            shippingCompanies={companies}
            selectedOptionId={undefined}
            onShippingOptionChange={onShippingOptionChange}
        />,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Collect in store' }));

    expect(onShippingOptionChange).toHaveBeenLastCalledWith(7);
    expect(screen.getByText('collection day and slot picker')).toBeInTheDocument();
});

it('collection is not offered as a courier service', async () => {
    render(
        <CheckoutShippingOptions shippingCompanies={companies} selectedOptionId={undefined} onShippingOptionChange={jest.fn()} />,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'As soon as possible' }));
    const values = screen.getAllByRole('radio').map(radio => (radio as HTMLInputElement).value);
    expect(values).toContain('3');
    expect(values).not.toContain('7');
});

it('checkout still asks for a collection slot before paying', async () => {
    render(<CheckoutConfirm />);

    await userEvent.click(screen.getByRole('radio', { name: 'Collect in store' }));
    await userEvent.click(screen.getByRole('button', { name: /continue to secure payment/i }));

    expect(toast.error).toHaveBeenCalledWith('Please select a pickup date and time slot');
    expect(createStripeSession).not.toHaveBeenCalled();
});
