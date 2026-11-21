import { render } from '@testing-library/react';
import ConfirmPage from '@/app/checkout/success/page';
import { track, consumePendingPurchase } from '@/utils/analytics';

jest.mock('@/utils/analytics', () => ({
    ...jest.requireActual('@/utils/analytics'),
    track: jest.fn(),
    consumePendingPurchase: jest.fn(),
}));
jest.mock('@/components/checkout/CheckoutSuccessUnitsSold', () => ({ __esModule: true, default: () => null }));

const purchases = () => (track as jest.Mock).mock.calls.filter(([name]) => name === 'purchase');

const visit = (search: string) => {
    window.history.pushState({}, '', `/checkout/success${search}`);
    return render(<ConfirmPage />);
};

beforeEach(() => {
    (track as jest.Mock).mockClear();
    (consumePendingPurchase as jest.Mock).mockReturnValue({ currency: 'GBP', value: 23, items: [], coupon: 'PREBLACK15' });
    window.localStorage.clear();
});

describe('checkout success page', () => {
    it('reports no purchase when there is no Stripe session', () => {
        // A bookmark, a shared link or browser history: no order behind it.
        visit('');
        expect(purchases()).toHaveLength(0);
    });

    it('reports the purchase once per Stripe session', () => {
        visit('?session_id=cs_test_123').unmount();
        visit('?session_id=cs_test_123');

        expect(purchases()).toHaveLength(1);
        expect(purchases()[0][1]).toMatchObject({ transaction_id: 'cs_test_123', value: 23, coupon: 'PREBLACK15' });
    });
});
