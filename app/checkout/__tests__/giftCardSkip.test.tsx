import { render } from '@testing-library/react';
import GiftCardPage from '@/app/checkout/gift-card/page';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';
import { makeCart } from '@/test-utils/makeCart';

/**
 * A pack already includes its card, so the gift card step skips itself. It
 * used to push the address step onto the history, so Back from the address
 * step came here and was sent straight forward again: the customer could
 * never get back to the cart. Skipping replaces the entry instead.
 */

const push = jest.fn();
const replace = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push, replace }) }));
jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useGetCartQuery: jest.fn(),
    useAddCartItemMutation: jest.fn(() => [jest.fn(), {}]),
    useUpdateCartMutation: jest.fn(() => [jest.fn(), {}]),
    useRemoveCartItemMutation: jest.fn(() => [jest.fn(), {}]),
}));
jest.mock('@/redux/features/checkout/checkoutApiSlice', () => ({ useGetSessionQuery: jest.fn(() => ({})) }));
jest.mock('@/components/cart/GiftMessage', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/store/SelectableGiftCard', () => ({ __esModule: true, default: () => null }));

beforeEach(() => jest.clearAllMocks());

it('replaces the history entry when a pack skips the step, so Back does not loop', () => {
    const cart = makeCart();
    (cart.items[0] as any).pack_customization = { id: 1 };
    (useGetCartQuery as jest.Mock).mockReturnValue({ data: cart, isLoading: false });

    render(<GiftCardPage />);

    expect(replace).toHaveBeenCalledWith('/checkout/address');
    expect(push).not.toHaveBeenCalled();
});

it('stays on the step for a cart without a pack', () => {
    (useGetCartQuery as jest.Mock).mockReturnValue({ data: makeCart(), isLoading: false });

    render(<GiftCardPage />);

    expect(replace).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
});
