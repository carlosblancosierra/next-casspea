import { render, screen } from '@testing-library/react';
import OrderCard from '@/components/orders/OrderCard';
import { makeOrder } from '@/test-utils/makeOrder';

jest.mock('@/redux/features/orders/ordersApiSlice', () => ({
    useSendTrackingCodeMailMutation: jest.fn(() => [jest.fn(), { isLoading: false }]),
}));

const renderCard = (order = makeOrder()) =>
    render(
        <OrderCard
            order={order}
            onCreateShipping={jest.fn()}
            onDownloadLabel={jest.fn()}
            products={[]}
        />
    );

describe('OrderCard', () => {
    it('formats the order total from a decimal string', () => {
        renderCard();
        expect(screen.getByText('£54.99')).toBeInTheDocument();
    });

    it('formats the order total from a JSON number (current API shape)', () => {
        const order = makeOrder();
        order.checkout_session.total_with_shipping = 54.99;

        renderCard(order);
        expect(screen.getByText('£54.99')).toBeInTheDocument();
    });

    it('shows the shipping option with a formatted price', () => {
        renderCard();
        expect(screen.getByText('Tracked 24 - £5.99')).toBeInTheDocument();
    });
});
