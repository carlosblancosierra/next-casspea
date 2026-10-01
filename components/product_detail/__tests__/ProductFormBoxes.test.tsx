import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductFormBoxes from '@/components/product_detail/ProductFormBoxes';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import type { Product } from '@/types/products';

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
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

// The flavour picker has its own tree and its own concerns; these tests are
// about the wizard's navigation and its buttons.
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
} as unknown as Product;

const indulgencePack = {
    id: 170,
    name: 'Indulgence Pack of 9',
    slug: 'pack-of-9',
    sold_out: false,
    category: { id: 9, name: 'Indulgence Packs', slug: 'indulgence-packs', image: '/img/packs.png' },
} as unknown as Product;

const hotChocolate = {
    id: 51,
    name: 'Classic Hot Chocolate',
    slug: 'classic-hot-chocolate',
    weight: 250,
    image: '/img/hot-choc.png',
    category: { id: 5, name: 'Hot Chocolate', slug: 'hot-chocolate' },
} as unknown as Product;

const bark = {
    id: 61,
    name: 'Honeycomb Bark',
    slug: 'honeycomb-bark',
    weight: 120,
    image: '/img/bark.png',
    category: { id: 6, name: 'Chocolate Barks', slug: 'chocolate-barks' },
} as unknown as Product;

const addToCartButtons = () => screen.queryAllByRole('button', { name: /add to cart/i });

/** Walk a Surprise Me box as far as step 3, where a plain box is bought. */
const goToStepThree = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByText('Surprise Me'));
    await user.click(screen.getByRole('button', { name: /^next$/i }));
    await user.click(screen.getByText('No Allergens'));
    await user.click(screen.getByRole('button', { name: /^next$/i }));
};

describe('ProductFormBoxes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockProducts.mockReturnValue({
            data: [boxOfNine, indulgencePack, hotChocolate, bark],
            isLoading: false,
        });
    });

    it('offers exactly one Add to Cart on the final step of a plain box', async () => {
        const user = userEvent.setup();
        render(<ProductFormBoxes product={boxOfNine} />);

        await goToStepThree(user);

        // There used to be two: one in the form, and a floating bar outside it
        // that fired on the same condition.
        expect(addToCartButtons()).toHaveLength(1);
    });

    it('lets you go back while you are still picking flavours', async () => {
        const user = userEvent.setup();
        render(<ProductFormBoxes product={boxOfNine} />);

        await user.click(screen.getByText('Pick & Mix'));
        await user.click(screen.getByRole('button', { name: /^next$/i }));
        await user.click(screen.getByText('No Allergens'));
        await user.click(screen.getByRole('button', { name: /^next$/i }));

        // Back used to sit inside the "box is full" branch, so with chocolates
        // left to pick there was no way back to the allergen question at all.
        const back = screen.getByRole('button', { name: /^back$/i });
        expect(back).toBeInTheDocument();

        await user.click(back);
        expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
    });

    it('offers the pack steps as pictures, not dropdowns', async () => {
        const user = userEvent.setup();
        render(<ProductFormBoxes product={boxOfNine} />);

        await goToStepThree(user);
        await user.click(screen.getByRole('button', { name: /add to cart/i }));
        await user.click(screen.getByRole('button', { name: /make an indulgence pack/i }));

        expect(screen.getByText(/Step 4/i)).toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        expect(screen.getByText('Classic Hot Chocolate')).toBeInTheDocument();
    });

    it('shows what a pack looks like, falling back to the category image', async () => {
        const user = userEvent.setup();
        render(<ProductFormBoxes product={boxOfNine} />);

        await goToStepThree(user);
        await user.click(screen.getByRole('button', { name: /add to cart/i }));
        await user.click(screen.getByRole('button', { name: /make an indulgence pack/i }));

        expect(screen.getByAltText(/what an indulgence pack includes/i)).toBeInTheDocument();
    });

    it('leads with the upgrade and keeps "Continue to cart" quiet', async () => {
        const user = userEvent.setup();
        render(<ProductFormBoxes product={boxOfNine} />);

        await goToStepThree(user);
        await user.click(screen.getByRole('button', { name: /add to cart/i }));

        const upgrade = screen.getByRole('button', { name: /make an indulgence pack/i });
        const past = screen.getByRole('button', { name: /continue to cart/i });

        expect(upgrade.className).toContain('w-full');
        // The offer comes first; the way past it is underneath.
        expect(upgrade.compareDocumentPosition(past) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
});
