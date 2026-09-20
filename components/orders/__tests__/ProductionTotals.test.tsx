import { render, screen } from '@testing-library/react';
import ProductionTotals from '@/components/orders/ProductionTotals';
import { useGetOrdersQuery } from '@/redux/features/orders/ordersApiSlice';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { makeOrder } from '@/test-utils/makeOrder';
import type { Order } from '@/types/orders';

jest.mock('@/redux/features/orders/ordersApiSlice', () => ({
    useGetOrdersQuery: jest.fn(),
}));

jest.mock('@/redux/features/products/productApiSlice', () => ({
    useGetProductsQuery: jest.fn(() => ({ data: [] })),
}));

const mockOrders = useGetOrdersQuery as jest.Mock;

const orderWithItem = (item: Record<string, unknown>): Order =>
    makeOrder({
        checkout_session: {
            ...makeOrder().checkout_session,
            cart: { items: [item], discounted_total: '49.00' },
        },
    } as unknown as Partial<Order>);

describe('ProductionTotals', () => {
    beforeEach(() => jest.clearAllMocks());

    it('asks the server for exactly the ticked orders', () => {
        mockOrders.mockReturnValue({ data: [], isLoading: false, error: undefined });

        render(<ProductionTotals orderIds={['CP26-AAAA', 'CP26-BBBB']} />);

        // By id, not by date: an order ticked on one page has to keep counting
        // after the filters move.
        expect(mockOrders).toHaveBeenCalledWith(
            { ids: 'CP26-AAAA,CP26-BBBB' },
            expect.objectContaining({ skip: false })
        );
    });

    it('does not call the API with an empty selection', () => {
        mockOrders.mockReturnValue({ data: undefined, isLoading: false, error: undefined });

        const { container } = render(<ProductionTotals orderIds={[]} />);

        expect(mockOrders).toHaveBeenCalledWith({ ids: '' }, expect.objectContaining({ skip: true }));
        expect(container).toBeEmptyDOMElement();
    });

    it('totals the flavours across every selected order', () => {
        mockOrders.mockReturnValue({
            data: [
                orderWithItem({
                    quantity: 1,
                    product: { name: 'Box of 9', units_per_box: 9 },
                    box_customization: {
                        selection_type: 'PICK_AND_MIX',
                        flavor_selections: [{ flavor_name: 'Dark', quantity: 4 }],
                    },
                }),
                orderWithItem({
                    quantity: 1,
                    product: { name: 'Indulgence Pack 9', units_per_box: 9 },
                    pack_customization: {
                        selection_type: 'PICK_AND_MIX',
                        flavor_selections: [{ flavor_name: 'Dark', quantity: 5 }],
                    },
                }),
            ],
            isLoading: false,
            error: undefined,
        });

        render(<ProductionTotals orderIds={['a', 'b']} />);

        // The pack half used to count as zero, so a batch made from these
        // numbers came out short by exactly the packs in it.
        expect(screen.getByText('Dark: 9')).toBeInTheDocument();
        expect(screen.getByText(/Totals for 2 selected orders/)).toBeInTheDocument();
    });

    it('says so when the orders cannot be loaded', () => {
        mockOrders.mockReturnValue({ data: undefined, isLoading: false, error: { status: 500 } });

        render(<ProductionTotals orderIds={['a']} />);

        expect(screen.getByText(/could not load the selected orders/i)).toBeInTheDocument();
    });
});
