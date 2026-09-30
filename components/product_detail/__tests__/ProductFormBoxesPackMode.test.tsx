import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductFormBoxes from '@/components/product_detail/ProductFormBoxes';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import type { Product } from '@/types/products';

const searchParams = { get: jest.fn() };

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    useSearchParams: () => searchParams,
}));

jest.mock('@/redux/features/products/productApiSlice', () => ({
    useGetProductsQuery: jest.fn(),
}));

jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useAddCartItemMutation: jest.fn(() => [
        jest.fn(() => ({ unwrap: () => Promise.resolve({}) })),
        { isLoading: false },
    ]),
    useUpdateCartMutation: jest.fn(() => [
        jest.fn(() => ({ unwrap: () => Promise.resolve({}) })),
        {},
    ]),
}));

jest.mock('@/components/product_detail/FlavourPicker', () => ({
    __esModule: true,
    default: () => null,
}));

// jsdom has no scrollIntoView, and the wizard calls it on every step change.
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const mockProducts = useGetProductsQuery as jest.Mock;

const boxOfNine = {
    id: 4,
    name: 'Signature Box of 9',
    slug: 'box-of-9',
    units_per_box: 9,
    base_price: '14.99',
    current_price: '14.99',
    sold_out: false,
    category: { id: 1, name: 'Signature Boxes', slug: 'signature-boxes' },
} as unknown as Product;

const indulgencePack = {
    id: 170,
    name: 'Indulgence Pack of 9',
    slug: 'pack-of-9',
    sold_out: false,
    category: { id: 9, name: 'Indulgence Packs', slug: 'indulgence-packs' },
} as unknown as Product;

const hotChocolate = {
    id: 51, name: 'Classic Hot Chocolate', slug: 'hot-choc', weight: 250,
    image: '/img/hc.png', category: { id: 5, name: 'Hot Chocolate', slug: 'hot-chocolate' },
} as unknown as Product;

/** Surprise Me as far as step 3, where a box is finished. */
const goToStepThree = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByText('Surprise Me'));
    await user.click(screen.getByRole('button', { name: /^next$/i }));
    await user.click(screen.getByText('No Allergens'));
    await user.click(screen.getByRole('button', { name: /^next$/i }));
};

describe('ProductFormBoxes in pack mode', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockProducts.mockReturnValue({
            data: [boxOfNine, indulgencePack, hotChocolate],
            isLoading: false,
        });
    });

    it('offers Next rather than the upsell when it already knows this is a pack', async () => {
        searchParams.get.mockReturnValue('1');
        const user = setupPack();

        await goToStepThree(user);

        // The visitor chose "indulgence pack" in the store; asking again is
        // asking the same question twice.
        expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument();
        expect(screen.queryAllByRole('button', { name: /add to cart/i })).toHaveLength(0);

        await user.click(screen.getByRole('button', { name: /^next$/i }));
        expect(screen.queryByText(/make your signature box more indulgent/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Step 4/i)).toBeInTheDocument();
    });

    it('shows seven step markers, not three', async () => {
        searchParams.get.mockReturnValue('1');
        const { container } = renderPack();

        // getTotalSteps() already returns 7 for a pack, so this is really
        // checking that isPack is on from the first render rather than only
        // after the upsell.
        expect(container.querySelectorAll('.rounded-full.w-10')).toHaveLength(7);
    });

    it('still offers Add to Cart on an ordinary box page', async () => {
        searchParams.get.mockReturnValue(null);
        const user = setupPack();

        await goToStepThree(user);

        // getAllBy, not getBy: this branch of dev still renders the duplicate
        // floating Add to Cart. Removing that is a separate change; what matters
        // here is that a non-pack box still gets an Add to Cart and not Next.
        expect(screen.getAllByRole('button', { name: /add to cart/i }).length).toBeGreaterThan(0);
    });

    it('shows three step markers on an ordinary box page', () => {
        searchParams.get.mockReturnValue(null);
        const { container } = renderPack();

        expect(container.querySelectorAll('.rounded-full.w-10')).toHaveLength(3);
    });

    function renderPack() {
        return render(<ProductFormBoxes product={boxOfNine} />);
    }

    function setupPack() {
        const user = userEvent.setup();
        renderPack();
        return user;
    }
});
