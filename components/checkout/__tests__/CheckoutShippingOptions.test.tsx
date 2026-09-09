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
                guaranteed: false,
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
            {
                id: 3,
                name: 'Tracked 24',
                delivery_speed: 'PRIORITY',
                price: '5.99',
                original_price: '5.99',
                discount_amount: '0.00',
                estimated_days_min: 1,
                estimated_days_max: 2,
                guaranteed: false,
            },
            {
                id: 5,
                name: 'Special Delivery',
                delivery_speed: 'PRIORITY',
                price: '11.99',
                original_price: '11.99',
                discount_amount: '0.00',
                estimated_days_min: 1,
                estimated_days_max: 1,
                guaranteed: true,
            },
        ],
    },
] as unknown as ShippingCompany[];

// userEvent waits on real timers by default, which deadlocks under fake ones.
const setupUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

/** Open the posting-date calendar and click a day in it. */
const pickDate = async (
    user: ReturnType<typeof setupUser>,
    fieldLabel: string,
    dayLabel: RegExp
) => {
    await user.click(screen.getByLabelText(fieldLabel));
    await user.click(screen.getByRole('gridcell', { name: dayLabel }));
};

const renderOptions = (props: Partial<React.ComponentProps<typeof CheckoutShippingOptions>> = {}) =>
    render(
        <CheckoutShippingOptions
            shippingCompanies={companies}
            onShippingOptionChange={jest.fn().mockResolvedValue(undefined)}
            {...props}
        />
    );

describe('CheckoutShippingOptions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseGetCartQuery.mockReturnValue({ data: makeCart(), isLoading: false, error: undefined });
    });

    it("does not select a shipping option on the customer's behalf", () => {
        const onShippingOptionChange = jest.fn();

        renderOptions({ onShippingOptionChange });

        // Auto-selecting meant the parent's "did you pick shipping?" guard saw a
        // value it had set itself, so the customer could reach payment — and be
        // charged for a delivery method — without ever choosing one.
        expect(onShippingOptionChange).not.toHaveBeenCalled();
    });

    it('reports the option the customer actually picks', async () => {
        const onShippingOptionChange = jest.fn().mockResolvedValue(undefined);

        renderOptions({ onShippingOptionChange });

        // Shipping is the default mode, so options are on screen already.
        const radios = await screen.findAllByRole('radio');
        const trackedTwentyFour = radios.find(
            r => (r as HTMLInputElement).value === '3'
        ) as HTMLInputElement;
        await userEvent.click(trackedTwentyFour);

        expect(onShippingOptionChange).toHaveBeenCalledWith(3);
    });

    it('choosing Collect in store picks the pickup option without a second click', async () => {
        const onShippingOptionChange = jest.fn().mockResolvedValue(undefined);

        renderOptions({ onShippingOptionChange });

        await userEvent.click(screen.getByRole('radio', { name: 'Collect in store' }));

        // Choosing the mode is choosing the option — there is only one.
        expect(onShippingOptionChange).toHaveBeenCalledWith(34);
        // And no leftover one-item radio list to tick.
        expect(screen.queryByRole('radio', { name: /Royal Mail/ })).not.toBeInTheDocument();
    });

    it('switching delivery mode clears the pick so a stale option cannot be paid for', async () => {
        const onShippingOptionChange = jest.fn().mockResolvedValue(undefined);

        renderOptions({ onShippingOptionChange });

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

    describe('posting date', () => {
        // Wednesday 9 September 2026, 09:00 London — before the 10:00 cutoff,
        // so the earliest posting day is that same Wednesday.
        beforeEach(() => {
            jest.useFakeTimers().setSystemTime(new Date('2026-09-09T08:00:00Z'));
        });
        afterEach(() => {
            jest.useRealTimers();
        });

        it('defaults to posting as soon as possible, with no date form in the way', () => {
            renderOptions();

            expect(screen.getByText(/We'll post your order on/)).toBeInTheDocument();
            expect(screen.getByText('Wed 9 Sep')).toBeInTheDocument();
            expect(screen.queryByLabelText('Post my order on')).not.toBeInTheDocument();
        });

        it('measures every estimate from the day the customer chose, not from today', async () => {
            const user = setupUser();
            renderOptions();

            // Tracked 48 is 2-3 working days from Wednesday the 9th.
            expect(screen.getByText(/Estimated Fri 11 Sep – Mon 14 Sep/)).toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: /choose a different day/i }));
            await pickDate(user, 'Post my order on', /September 21st/);

            // The bug: the estimate used to stay pinned to today, so a customer
            // holding the order to the 21st was still told it ships this week.
            expect(screen.getByText(/Holding your order to post on/)).toBeInTheDocument();
            expect(screen.getByText(/Estimated Wed 23 Sep – Thu 24 Sep/)).toBeInTheDocument();
            expect(screen.queryByText(/Estimated Fri 11 Sep – Mon 14 Sep/)).not.toBeInTheDocument();
        });

        it('can go back to posting as soon as possible', async () => {
            const user = setupUser();
            renderOptions();

            await user.click(screen.getByRole('button', { name: /choose a different day/i }));
            await pickDate(user, 'Post my order on', /September 21st/);
            await user.click(screen.getByRole('button', { name: /post as soon as possible/i }));

            expect(screen.getByText(/We'll post your order on/)).toBeInTheDocument();
            expect(screen.getByText(/Estimated Fri 11 Sep – Mon 14 Sep/)).toBeInTheDocument();
        });

        it('reports the posting date up as yyyy-mm-dd, and clears it for collection', async () => {
            const user = setupUser();
            const onDispatchDateChange = jest.fn();
            renderOptions({ onDispatchDateChange });

            await user.click(screen.getByRole('button', { name: /choose a different day/i }));
            await pickDate(user, 'Post my order on', /September 21st/);
            expect(onDispatchDateChange).toHaveBeenLastCalledWith('2026-09-21');

            await user.click(screen.getByRole('radio', { name: 'Collect in store' }));

            // Collection has its own date and time; a posting date on a pickup
            // order is wrong data in the admin as well as a pointless question.
            expect(onDispatchDateChange).toHaveBeenLastCalledWith(null);
            expect(screen.queryByText(/We'll post your order on/)).not.toBeInTheDocument();
        });
    });

    describe('guaranteed versus estimated', () => {
        beforeEach(() => {
            jest.useFakeTimers().setSystemTime(new Date('2026-09-09T08:00:00Z'));
        });
        afterEach(() => {
            jest.useRealTimers();
        });

        it('only calls a service guaranteed when the carrier actually guarantees it', () => {
            renderOptions();

            expect(screen.getByText(/Arrives Thu 10 Sep/)).toBeInTheDocument();
            expect(screen.getByText('Guaranteed by Royal Mail')).toBeInTheDocument();

            // The tracked services are estimates and must read as estimates —
            // most of these orders are birthday gifts, so the difference is the
            // whole reason the customer is reading this list.
            expect(screen.getByText(/Estimated Fri 11 Sep – Mon 14 Sep/)).toBeInTheDocument();
            expect(screen.getByText(/Special Delivery is the only service/)).toBeInTheDocument();
        });

        it('treats an option with no guaranteed flag as an estimate', () => {
            const noFlag = [{
                ...companies[0],
                shipping_options: [{ ...companies[0].shipping_options[0], guaranteed: undefined }],
            }] as unknown as ShippingCompany[];

            renderOptions({ shippingCompanies: noFlag });

            // The field is optional so an older API degrades to honest wording
            // rather than silently promising a date.
            expect(screen.getByText(/Estimated Fri 11 Sep – Mon 14 Sep/)).toBeInTheDocument();
            expect(screen.queryByText('Guaranteed by Royal Mail')).not.toBeInTheDocument();
        });
    });

    describe('"I need it for a particular day"', () => {
        beforeEach(() => {
            jest.useFakeTimers().setSystemTime(new Date('2026-09-09T08:00:00Z'));
        });
        afterEach(() => {
            jest.useRealTimers();
        });

        const needItBy = async (user: ReturnType<typeof setupUser>, dayLabel: RegExp) => {
            await user.click(screen.getByRole('radio', { name: 'For a particular day' }));
            await pickDate(user, 'I need it by', dayLabel);
        };

        it('works backwards so the day they asked for is the last day of the range', async () => {
            const user = setupUser();
            renderOptions();

            await needItBy(user, /September 28th/);

            // Tracked 48 is 2-3 working days, so it leaves on the 23rd to land
            // by the 28th — not tomorrow, which would have it sitting around
            // for a fortnight.
            expect(screen.getByText(/Posting Wed 23 Sep/)).toBeInTheDocument();
            // Both tracked services get the same honest wording.
            expect(screen.getAllByText(/Should arrive by/).length).toBe(2);
        });

        it('never claims more than the posting day for an estimated service', async () => {
            const user = setupUser();
            renderOptions();

            await needItBy(user, /September 28th/);

            expect(
                screen.getAllByText(/We can only confirm that we post it on/).length
            ).toBeGreaterThan(0);
            expect(screen.getAllByText(/not something we can promise/).length).toBe(2);
        });

        it('singles out the one service that does guarantee the day', async () => {
            const user = setupUser();
            renderOptions();

            await needItBy(user, /September 28th/);

            expect(screen.getByText('The only service guaranteed for a set day')).toBeInTheDocument();
            // And it carries no "we can only confirm the posting day" caveat,
            // because for this one we can confirm more than that.
            const guaranteed = screen.getByText('The only service guaranteed for a set day')
                .closest('label') as HTMLElement;
            expect(guaranteed.textContent).not.toMatch(/only confirm that we post/);
        });

        it('says plainly when a service cannot make the day', async () => {
            const user = setupUser();
            renderOptions();

            await needItBy(user, /September 10th/);

            // Tracked 48 posted at the earliest still lands after the 10th.
            expect(screen.getAllByText(/Not expected to make Thu 10 Sep/).length).toBeGreaterThan(0);
        });

        it('points at collection when nothing we post can get there in time', async () => {
            const user = setupUser();
            renderOptions();

            await needItBy(user, /September 9th/);

            expect(screen.getByText(/don't expect any of these to reach you by/)).toBeInTheDocument();
        });

        it('fixes the posting day to the service the customer picks', async () => {
            const user = setupUser();
            const onDispatchDateChange = jest.fn();
            renderOptions({ onDispatchDateChange });

            await needItBy(user, /September 28th/);
            const trackedFortyEight = screen.getAllByRole('radio')
                .find(r => (r as HTMLInputElement).value === '2') as HTMLInputElement;
            await user.click(trackedFortyEight);

            // A slower service has to leave earlier, so the posting day is not
            // decided until they choose one.
            expect(onDispatchDateChange).toHaveBeenLastCalledWith('2026-09-23');
        });

        it('gives the guaranteed service its own, later posting day', async () => {
            const user = setupUser();
            const onDispatchDateChange = jest.fn();
            renderOptions({ onDispatchDateChange });

            await needItBy(user, /September 28th/);
            const specialDelivery = screen.getAllByRole('radio')
                .find(r => (r as HTMLInputElement).value === '5') as HTMLInputElement;
            await user.click(specialDelivery);

            // Next-day, so it leaves the working day before.
            expect(onDispatchDateChange).toHaveBeenLastCalledWith('2026-09-25');
        });

        it('goes back to posting as soon as possible when the mode is switched off', async () => {
            const user = setupUser();
            const onDispatchDateChange = jest.fn();
            renderOptions({ onDispatchDateChange });

            await needItBy(user, /September 28th/);
            const option = screen.getAllByRole('radio')
                .find(r => (r as HTMLInputElement).value === '2') as HTMLInputElement;
            await user.click(option);

            await user.click(screen.getByRole('radio', { name: 'As soon as possible' }));

            expect(onDispatchDateChange).toHaveBeenLastCalledWith(null);
            expect(screen.getByText(/We'll post your order on/)).toBeInTheDocument();
        });
    });
});
