import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutShippingOptions from '@/components/checkout/CheckoutShippingOptions';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { makeCart } from '@/test-utils/makeCart';
import type { ShippingCompany } from '@/types/shipping';

/**
 * The real collection picker inside the real options list — the other
 * checkout tests replace one or the other, which is how this went unseen.
 *
 * CheckoutShippingOptions hands CheckoutStorePickUp a new inline onChange on
 * every render, and the picker's effect depends on onChange and reports a new
 * object every time. Once a day and a slot are chosen the two keep updating
 * each other for ever ("Maximum update depth exceeded"), and the checkout
 * page burns the customer's CPU.
 */

jest.mock('@/redux/features/carts/cartApiSlice', () => ({ useGetCartQuery: jest.fn() }));

const companies = [{
    id: 1,
    name: 'Royal Mail',
    code: 'rm',
    shipping_options: [
        {
            id: 34, name: 'Store pickup', delivery_speed: 'PICKUP', price: '0.00', original_price: '0.00',
            discount_amount: '0.00', estimated_days_min: 0, estimated_days_max: 0,
        },
        {
            id: 3, name: 'Tracked 24', delivery_speed: 'PRIORITY', price: '5.99', original_price: '5.99',
            discount_amount: '0.00', estimated_days_min: 1, estimated_days_max: 2,
        },
    ],
}] as unknown as ShippingCompany[];

const LOOP_GUARD = 200;

describe('store collection picker inside the shipping options', () => {
    let consoleError: jest.SpyInstance;

    beforeEach(() => {
        (useGetCartQuery as jest.Mock).mockReturnValue({ data: makeCart(), isLoading: false });
        // React reports the loop with console.error; keep the output readable.
        consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => consoleError.mockRestore());

    // BUG-17 (docs/plan-rediseno-seguro.md). Fails on purpose until the fix
    // (a stable onChange with useCallback, or only reporting real changes).
    // When it starts passing, test.failing goes red: make it a normal test.
    it.failing('[BUG-17] picking a day and a slot settles instead of looping', async () => {
        let reports = 0;
        const onChangeStorePickup = jest.fn(() => {
            reports += 1;
            // Break the loop so the test ends; reaching this is the failure.
            if (reports > LOOP_GUARD) throw new Error(`still updating after ${LOOP_GUARD} reports`);
        });

        render(
            <CheckoutShippingOptions
                shippingCompanies={companies}
                selectedOptionId={undefined}
                onShippingOptionChange={jest.fn()}
                onChangeStorePickup={onChangeStorePickup}
                onDispatchDateChange={jest.fn()}
            />,
        );

        await userEvent.click(screen.getByRole('radio', { name: 'Collect in store' }));
        const days = screen.getAllByRole('button').filter(button =>
            /Today|Tomorrow|Mon|Tue|Wed|Thu|Fri/.test(button.textContent ?? ''));
        await userEvent.click(days[days.length - 1]);
        await userEvent.click(screen.getAllByRole('button').find(button => /15:00/.test(button.textContent ?? ''))!);
        await act(() => new Promise(resolve => setTimeout(resolve, 200)));

        expect(reports).toBeLessThan(10);
        expect(onChangeStorePickup).toHaveBeenLastCalledWith(
            expect.objectContaining({ slot: expect.objectContaining({ start: '15:00' }) }));
    });
});
