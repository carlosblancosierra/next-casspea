import { useEffect, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutConfirm from '@/components/checkout/CheckoutConfirm';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';
import { makeCart } from '@/test-utils/makeCart';

/**
 * Store collection in summer. The picker hands over the chosen day as a local
 * Date at midnight. CheckoutConfirm used to turn it into YYYY-MM-DD with
 * toISOString(), which is UTC: during British Summer Time local midnight is
 * 23:00 UTC the day before, so the order was saved for the wrong day.
 *
 * jest.config.js runs the suite in Europe/London. CI machines default to UTC,
 * where this bug cannot be seen at all.
 */

jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), replace: jest.fn() }) }));

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useUpdateCartMutation: jest.fn(() => [jest.fn(() => ({ unwrap: () => Promise.resolve({}) })), {}]),
}));

jest.mock('@/redux/features/shipping/shippingApiSlice', () => ({ useGetShippingOptionsQuery: jest.fn() }));

const updateShippingOption = jest.fn((_: unknown) => ({ unwrap: () => Promise.resolve({}) }));

jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({
    useGetSessionQuery: jest.fn(() => ({ data: { id: 1 }, isLoading: false, error: undefined })),
    useUpdateSessionMutation: jest.fn(() => [jest.fn(), {}]),
    useCreateStripeCheckoutSessionMutation: jest.fn(() => [
        jest.fn(() => ({ unwrap: () => Promise.resolve({ url: '' }) })),
        {},
    ]),
    useUpdateShippingOptionMutation: jest.fn(() => [updateShippingOption, {}]),
}));

jest.mock('@/hooks/useStoreStatus', () => ({
    useStoreStatus: () => ({ isOpen: true, isClosed: false, deadlineIso: null, reopenLabel: '' }),
}));

jest.mock('@/components/checkout/CheckoutDetails', () => ({ __esModule: true, default: () => null }));

// The real picker builds its days as local midnights (getLondonNow); this
// stand-in picks Monday 22 June 2026, 15:00-16:00, the same way. It answers
// once, as the real one does since BUG-17 was fixed
// (CheckoutStorePickUpLoop.test.tsx).
function FakeStorePickUp({ onChange }: { onChange?: (value: unknown) => void }) {
    const answered = useRef(false);
    useEffect(() => {
        if (answered.current) return;
        answered.current = true;
        onChange?.({ date: new Date(2026, 5, 22), slot: { start: '15:00', end: '16:00', value: '15:00-16:00' } });
    });
    return null;
}

jest.mock('@/components/checkout/CheckoutStorePickUp', () => ({ __esModule: true, default: FakeStorePickUp }));

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
            id: 34, name: 'Store pickup', delivery_speed: 'PICKUP', price: '0.00', original_price: '0.00',
            discount_amount: '0.00', estimated_days_min: 0, estimated_days_max: 0,
        },
    ],
}];

describe('CheckoutConfirm store collection date', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useGetCartQuery as jest.Mock).mockReturnValue({ data: makeCart(), isLoading: false, error: undefined });
        (useGetShippingOptionsQuery as jest.Mock).mockReturnValue({ data: companies, isLoading: false });
    });

    it('runs in London time, where summer dates are an hour ahead of UTC', () => {
        expect(new Date(2026, 5, 22).getTimezoneOffset()).toBe(-60);
    });

    async function chooseCollectionAndPay() {
        render(<CheckoutConfirm />);
        await userEvent.click(screen.getByRole('radio', { name: 'Collect in store' }));
        await userEvent.click(screen.getByRole('button', { name: /continue to secure payment/i }));
        expect(updateShippingOption).toHaveBeenCalledTimes(1);
        return (updateShippingOption.mock.calls[0][0] as { data: Record<string, unknown> }).data;
    }

    it('sends the collection slot the customer picked', async () => {
        const data = await chooseCollectionAndPay();
        expect(data).toEqual(expect.objectContaining({ shipping_option_id: 34, pickup_time: '15:00 - 16:00' }));
    });

    // BUG-06 (docs/plan-rediseno-seguro.md), fixed.
    it('[BUG-06] saves the collection for the day the customer picked', async () => {
        const data = await chooseCollectionAndPay();
        expect(data.pickup_date).toBe('2026-06-22');
    });
});
