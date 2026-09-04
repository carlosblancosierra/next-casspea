import { render, screen } from '@testing-library/react';
import CartSummary from '@/components/cart/CartSummary';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { makeCart } from '@/test-utils/makeCart';

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
}));

const mockUseGetCartQuery = useGetCartQuery as jest.Mock;

describe('CartSummary', () => {
    it('renders nothing while the cart is empty', () => {
        mockUseGetCartQuery.mockReturnValue({ data: makeCart({ items: [] }) });

        const { container } = render(<CartSummary />);
        expect(container).toBeEmptyDOMElement();
    });

    it('shows the formatted total', () => {
        mockUseGetCartQuery.mockReturnValue({ data: makeCart() });

        render(<CartSummary />);

        expect(screen.getByText('Order summary')).toBeInTheDocument();
        // Both the original price and total are formatted as GBP
        expect(screen.getAllByText('£29.98')).toHaveLength(2);
    });

    it('shows the discount line when a code is applied', () => {
        mockUseGetCartQuery.mockReturnValue({
            data: makeCart({
                discount: { id: 1, code: 'NEWS10' } as any,
                discounted_total: '26.98',
                total_savings: '3.00',
            }),
        });

        render(<CartSummary />);

        expect(screen.getByText(/Discount \(NEWS10\)/)).toBeInTheDocument();
        expect(screen.getByText('-£3.00')).toBeInTheDocument();
        expect(screen.getByText('£26.98')).toBeInTheDocument();
    });
});
