import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutShippingOptions from '@/components/checkout/CheckoutShippingOptions';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { makeCart } from '@/test-utils/makeCart';
import type { ShippingCompany } from '@/types/shipping';

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
}));

jest.mock('@/components/checkout/CheckoutStorePickUp', () => ({
    __esModule: true,
    default: () => null,
}));

const mockUseGetCartQuery = useGetCartQuery as jest.Mock;

const companies = [
    {
        id: 1,
        name: 'Royal Mail',
        code: 'rm',
        shipping_options: [
            {
                id: 2,
                name: 'Tracked 48',
                delivery_speed: 'STANDARD',
                price: '3.99',
                original_price: '3.99',
                discount_amount: '0.00',
                estimated_days_min: 2,
                estimated_days_max: 3,
            },
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
] as unknown as ShippingCompany[];

describe('CheckoutShippingOptions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseGetCartQuery.mockReturnValue({ data: makeCart(), isLoading: false, error: undefined });
    });

    it("does not select a shipping option on the customer's behalf", () => {
        const onShippingOptionChange = jest.fn();

        render(
            <CheckoutShippingOptions
                shippingCompanies={companies}
                onShippingOptionChange={onShippingOptionChange}
            />
        );

        // Auto-selecting meant the parent's "did you pick shipping?" guard saw a
        // value it had set itself, so the customer could reach payment — and be
        // charged for a delivery method — without ever choosing one.
        expect(onShippingOptionChange).not.toHaveBeenCalled();
    });

    it('reports the option the customer actually picks', async () => {
        const onShippingOptionChange = jest.fn().mockResolvedValue(undefined);

        render(
            <CheckoutShippingOptions
                shippingCompanies={companies}
                onShippingOptionChange={onShippingOptionChange}
            />
        );

        // Shipping is the default mode, so options are on screen already.
        const radios = await screen.findAllByRole('radio');
        const trackedTwentyFour = radios.find(
            r => (r as HTMLInputElement).value === '3'
        ) as HTMLInputElement;
        await userEvent.click(trackedTwentyFour);

        expect(onShippingOptionChange).toHaveBeenCalledWith(3);
    });

    it('switching delivery mode clears the pick so a stale option cannot be paid for', async () => {
        const onShippingOptionChange = jest.fn().mockResolvedValue(undefined);

        render(
            <CheckoutShippingOptions
                shippingCompanies={companies}
                onShippingOptionChange={onShippingOptionChange}
            />
        );

        const radios = await screen.findAllByRole('radio');
        const option = radios.find(r => (r as HTMLInputElement).value === '3') as HTMLInputElement;
        await userEvent.click(option);
        expect(option.checked).toBe(true);

        await userEvent.click(screen.getByRole('radio', { name: 'Collect in store' }));
        await userEvent.click(screen.getByRole('radio', { name: 'Ship to me' }));

        const afterSwitch = screen.getAllByRole('radio')
            .filter(r => (r as HTMLInputElement).type === 'radio' && (r as HTMLInputElement).name === 'shipping');
        expect(afterSwitch.every(r => !(r as HTMLInputElement).checked)).toBe(true);
    });
});
