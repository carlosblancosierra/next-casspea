import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiscountForm from '@/components/cart/DiscountForm';
import { useGetCartQuery, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice';
import { makeCart } from '@/test-utils/makeCart';

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useUpdateCartMutation: jest.fn(),
}));

const mockUseGetCartQuery = useGetCartQuery as jest.Mock;
const mockUseUpdateCartMutation = useUpdateCartMutation as jest.Mock;

describe('DiscountForm', () => {
    let updateCart: jest.Mock;

    beforeEach(() => {
        updateCart = jest.fn(() => ({ unwrap: () => Promise.resolve({}) }));
        mockUseUpdateCartMutation.mockReturnValue([updateCart]);
        mockUseGetCartQuery.mockReturnValue({ data: makeCart() });
    });

    it('submits the entered discount code', async () => {
        render(<DiscountForm />);

        await userEvent.type(screen.getByPlaceholderText(/discount code/i), 'NEWS10');
        await userEvent.click(screen.getByRole('button', { name: /apply/i }));

        expect(updateCart).toHaveBeenCalledWith({
            discount_code: 'NEWS10',
            remove_discount: false,
        });
    });

    it('disables Apply until a code is typed', () => {
        render(<DiscountForm />);
        expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
    });

    it('shows the backend validation message when the code is rejected', async () => {
        updateCart.mockReturnValue({
            unwrap: () => Promise.reject({ data: { discount_code: 'Invalid discount code provided.' } }),
        });
        render(<DiscountForm />);

        await userEvent.type(screen.getByPlaceholderText(/discount code/i), 'BAD');
        await userEvent.click(screen.getByRole('button', { name: /apply/i }));

        expect(await screen.findByText('Invalid discount code provided.')).toBeInTheDocument();
    });

    it('shows the applied code with a remove button', async () => {
        mockUseGetCartQuery.mockReturnValue({
            data: makeCart({ discount: { id: 1, code: 'NEWS10' } as any }),
        });
        render(<DiscountForm />);

        expect(screen.getByText('NEWS10')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: /remove discount/i }));
        expect(updateCart).toHaveBeenCalledWith({
            discount_code: '',
            remove_discount: true,
        });
    });
});
