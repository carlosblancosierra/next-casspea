import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckoutStorePickUp from '@/components/checkout/CheckoutStorePickUp';

/** Fix "now" so Today/Tomorrow and the same-day rule are deterministic. */
const useFakeNow = (iso: string) => {
    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date(iso));
    });
    afterEach(() => {
        jest.useRealTimers();
    });
};

// userEvent waits on real timers by default, which deadlocks under fake ones.
const setupUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

describe('CheckoutStorePickUp', () => {
    describe('on a weekday morning, before the same-day cutoff', () => {
        // Tuesday 8 September 2026, 09:00 London.
        useFakeNow('2026-09-08T08:00:00Z');

        it('labels the first days Today and Tomorrow', () => {
            render(<CheckoutStorePickUp />);

            expect(screen.getByRole('button', { name: /Today/ })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Tomorrow/ })).toBeInTheDocument();
        });

        it('shows the slots the hour has closed rather than hiding them', async () => {
            const user = setupUser();
            render(<CheckoutStorePickUp />);

            await user.click(screen.getByRole('button', { name: /Today/ }));

            // Filtering them out left today showing one lone slot with no
            // explanation, which reads as a bug rather than a rule.
            expect(screen.getByText(/the earlier slots are closed/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '15:30' })).toBeEnabled();
            expect(screen.getByRole('button', { name: '10:00' })).toBeDisabled();
        });

        it('will not let a closed slot be chosen', async () => {
            const user = setupUser();
            const onChange = jest.fn();
            render(<CheckoutStorePickUp onChange={onChange} />);

            await user.click(screen.getByRole('button', { name: /Today/ }));
            await user.click(screen.getByRole('button', { name: '10:00' }));

            expect(onChange).toHaveBeenLastCalledWith(null);
        });

        it('reports the chosen day and slot to the parent', async () => {
            const user = setupUser();
            const onChange = jest.fn();
            render(<CheckoutStorePickUp onChange={onChange} />);

            await user.click(screen.getByRole('button', { name: /Tomorrow/ }));
            await user.click(screen.getByRole('button', { name: '10:30' }));

            expect(onChange).toHaveBeenLastCalledWith(
                expect.objectContaining({
                    slot: expect.objectContaining({ start: '10:30', end: '11:00' }),
                })
            );
        });

        it('clears the time when the day changes, so a stale slot is never sent', async () => {
            const user = setupUser();
            const onChange = jest.fn();
            render(<CheckoutStorePickUp onChange={onChange} />);

            await user.click(screen.getByRole('button', { name: /Tomorrow/ }));
            await user.click(screen.getByRole('button', { name: '10:30' }));
            expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ slot: expect.anything() }));

            await user.click(screen.getByRole('button', { name: /Today/ }));

            expect(onChange).toHaveBeenLastCalledWith(null);
        });

        it('keeps every day reachable instead of collapsing the choice', async () => {
            const user = setupUser();
            render(<CheckoutStorePickUp />);

            await user.click(screen.getByRole('button', { name: /Tomorrow/ }));

            // The old picker hid the other days behind a "Change date" button.
            expect(screen.getByRole('button', { name: /Today/ })).toBeInTheDocument();
            expect(screen.queryByText(/change date/i)).not.toBeInTheDocument();
        });
    });

    describe('after the same-day cutoff', () => {
        // Tuesday 8 September 2026, 14:00 London.
        useFakeNow('2026-09-08T13:00:00Z');

        it('drops today and offers the full slate of slots', async () => {
            const user = setupUser();
            render(<CheckoutStorePickUp />);

            expect(screen.queryByRole('button', { name: /Today/ })).not.toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: /Tomorrow/ }));

            expect(screen.queryByText(/the earlier slots are closed/i)).not.toBeInTheDocument();
            expect(screen.getByRole('button', { name: '10:00' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '15:30' })).toBeInTheDocument();
        });
    });
});
