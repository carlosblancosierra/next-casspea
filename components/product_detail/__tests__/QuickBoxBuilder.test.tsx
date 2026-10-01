import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickBoxBuilder from '@/components/product_detail/QuickBoxBuilder';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import { useAddCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import type { Product } from '@/types/products';

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/redux/features/products/productApiSlice', () => ({
    useGetProductsQuery: jest.fn(),
}));

jest.mock('@/redux/features/flavour/flavourApiSlice', () => ({
    useGetFlavoursQuery: jest.fn(),
}));

type CartRequest = { product: number; box_customization?: { allergens: number[] } };
const addToCart = jest.fn((_request: CartRequest) => ({ unwrap: () => Promise.resolve({}) }));

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useAddCartItemMutation: jest.fn(() => [addToCart, { isLoading: false }]),
    useUpdateCartMutation: jest.fn(() => [
        jest.fn(() => ({ unwrap: () => Promise.resolve({}) })),
        {},
    ]),
}));

// The flavour picker is a large tree of its own with its own suite; these
// tests are about what the builder sends to the cart.
jest.mock('@/components/product_detail/FlavourPicker', () => ({
    __esModule: true,
    default: () => null,
}));

const mockProducts = useGetProductsQuery as jest.Mock;
const mockFlavours = useGetFlavoursQuery as jest.Mock;

const boxOfNine = {
    id: 4,
    name: 'Signature Box of 9',
    slug: 'box-of-9',
    units_per_box: 9,
    base_price: '14.99',
    current_price: '14.99',
    sold_out: false,
} as unknown as Product;

const flavours = [
    { id: 1, name: 'Salted Caramel', active: true, allergens: [] },
    { id: 2, name: 'Hazelnut Praline', active: true, allergens: [{ id: 6, name: 'Nut' }] },
    { id: 3, name: 'Dark Ganache', active: true, allergens: [] },
];

describe('QuickBoxBuilder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAddCartItemMutation as jest.Mock).mockReturnValue([addToCart, { isLoading: false }]);
        mockProducts.mockReturnValue({ data: [boxOfNine], isLoading: false });
        mockFlavours.mockReturnValue({ data: flavours, isLoading: false });
    });

    const answerAllergens = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(screen.getByText(/I have no allergies/i));
    };

    it('is locked to the box the page is for, and offers no size choice', () => {
        render(<QuickBoxBuilder product={boxOfNine} />);

        expect(screen.getByText('Your box of 9')).toBeInTheDocument();
        // A size picker in the variant would mean a win could not be
        // attributed to the builder rather than to the upsell.
        expect(screen.queryByText('24')).not.toBeInTheDocument();
        expect(screen.queryByText('48')).not.toBeInTheDocument();
    });

    it('still asks about allergens, and will not add a box until it is answered', async () => {
        const user = userEvent.setup();
        render(<QuickBoxBuilder product={boxOfNine} />);

        await user.click(screen.getByRole('button', { name: /add to cart/i }));

        // Dropping this question would make the experiment "asks about nut
        // allergies vs doesn't", and the winner would ship that gap.
        expect(addToCart).not.toHaveBeenCalled();
        expect(screen.getByText(/answer the allergen question/i)).toBeInTheDocument();
    });

    it('sends the allergens the customer named', async () => {
        const user = userEvent.setup();
        render(<QuickBoxBuilder product={boxOfNine} />);

        await user.click(screen.getByText('Specify Allergens'));
        await user.click(screen.getByLabelText('Nut Free'));
        await user.click(screen.getByRole('button', { name: /add to cart/i }));

        await waitFor(() => expect(addToCart).toHaveBeenCalled());
        expect(addToCart.mock.calls[0][0].box_customization?.allergens).toEqual([6]);
    });

    it('adds the product the page is for', async () => {
        const user = userEvent.setup();
        render(<QuickBoxBuilder product={boxOfNine} />);

        await answerAllergens(user);
        await user.click(screen.getByRole('button', { name: /add to cart/i }));

        await waitFor(() => expect(addToCart).toHaveBeenCalled());
        expect(addToCart.mock.calls[0][0].product).toBe(4);
    });

    it('reports the funnel step only once the cart call succeeded', async () => {
        const user = userEvent.setup();
        const onAddedToCart = jest.fn();
        render(<QuickBoxBuilder product={boxOfNine} onAddedToCart={onAddedToCart} />);

        await answerAllergens(user);
        await user.click(screen.getByRole('button', { name: /add to cart/i }));

        await waitFor(() => expect(onAddedToCart).toHaveBeenCalledTimes(1));
    });

    it('does not report a failed add as a funnel step', async () => {
        const failing = jest.fn(() => ({ unwrap: () => Promise.reject(new Error('nope')) }));
        (useAddCartItemMutation as jest.Mock).mockReturnValue([failing, { isLoading: false }]);
        const user = userEvent.setup();
        const onAddedToCart = jest.fn();
        render(<QuickBoxBuilder product={boxOfNine} onAddedToCart={onAddedToCart} />);

        await answerAllergens(user);
        await user.click(screen.getByRole('button', { name: /add to cart/i }));

        await waitFor(() => expect(failing).toHaveBeenCalled());
        expect(onAddedToCart).not.toHaveBeenCalled();
    });

    it('refuses a sold-out box, same as the current builder', () => {
        render(<QuickBoxBuilder product={{ ...boxOfNine, sold_out: true } as Product} />);

        expect(screen.getByText(/currently sold out/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /^add to cart$/i })).not.toBeInTheDocument();
    });
});
