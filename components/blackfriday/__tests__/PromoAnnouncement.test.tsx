import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromoAnnouncement from '@/components/blackfriday/PromoAnnouncement';
import { PRE_BLACK_FRIDAY } from '@/components/blackfriday/campaign';
import { useGetCartQuery, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useUpdateCartMutation: jest.fn(),
}));
jest.mock('@/utils/analytics', () => ({ track: jest.fn() }));

const updateCart = jest.fn();

beforeEach(() => {
    updateCart.mockReset();
    (useUpdateCartMutation as jest.Mock).mockReturnValue([updateCart]);
    (useGetCartQuery as jest.Mock).mockReturnValue({ data: { discount: null } });
});

describe('PromoAnnouncement', () => {
    it('shows the public offer and applies its code in one tap', async () => {
        updateCart.mockReturnValue({ unwrap: () => Promise.resolve({}) });
        render(<PromoAnnouncement promo={PRE_BLACK_FRIDAY} />);

        expect(screen.getByText('15% off everything')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Use code PREBLACK15' }));

        expect(updateCart).toHaveBeenCalledWith({ discount_code: 'PREBLACK15', remove_discount: false });
        await waitFor(() => expect(screen.getByText('PREBLACK15 applied ✓')).toBeInTheDocument());
    });

    it('never replaces a code already in the basket', () => {
        // A subscriber's emailed code is better than the public one.
        (useGetCartQuery as jest.Mock).mockReturnValue({ data: { discount: { code: 'SUBSCRIBERCODE' } } });
        render(<PromoAnnouncement promo={PRE_BLACK_FRIDAY} />);

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        expect(screen.getByText('Code SUBSCRIBERCODE applied')).toBeInTheDocument();
    });

    it('hands over the code when the basket refuses it', async () => {
        updateCart.mockReturnValue({ unwrap: () => Promise.reject({ data: {} }) });
        render(<PromoAnnouncement promo={PRE_BLACK_FRIDAY} />);

        await userEvent.click(screen.getByRole('button', { name: 'Use code PREBLACK15' }));
        await waitFor(() => expect(screen.getByText('Code PREBLACK15 copied')).toBeInTheDocument());
    });
});
