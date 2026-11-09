import { render, screen } from '@testing-library/react';
import HomeProductsGrid from '@/components/home/HomeProductsGrid';
import { orderRow } from '@/components/home/orderRow';
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice';
import type { Product } from '@/types/products';

jest.mock('@/redux/features/products/productApiSlice', () => ({
    useGetActiveProductsQuery: jest.fn(),
}));

jest.mock('@/utils/useProductDiscountedPrice', () => ({
    useProductDiscountedPrice: () => ({ discountedPrice: null, discount_percentage: null }),
}));

// framer-motion's layout animations need a real layout engine; the grid class
// is what this test is about.
jest.mock('framer-motion', () => ({
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
        div: ({ children, className }: { children: React.ReactNode; className?: string }) => (
            <div className={className}>{children}</div>
        ),
    },
}));

const mockProducts = useGetActiveProductsQuery as jest.Mock;

const make = (over: Partial<Product>): Product =>
    ({
        id: 1,
        name: 'Signature Box of 24',
        slug: 'box-of-24',
        current_price: '39.99',
        weight: 300,
        image: '/img/box.png',
        ...over,
    }) as Product;

describe('HomeProductsGrid', () => {
    beforeEach(() => jest.clearAllMocks());

    it('gives a featured product both columns on phones', () => {
        const featured = make({ featured: true, wide_image: '/img/box-wide.png' });
        mockProducts.mockReturnValue({ data: [featured] });

        const { container } = render(<HomeProductsGrid products={[featured]} />);

        // Five products in a two-column grid leave one card with a gap beside
        // it; the featured card is what fills that row.
        expect(container.querySelector('.col-span-2')).toBeInTheDocument();
        expect(container.querySelector('.sm\\:col-span-1')).toBeInTheDocument();
    });

    it('leaves an ordinary product alone', () => {
        const ordinary = make({});
        mockProducts.mockReturnValue({ data: [ordinary] });

        const { container } = render(<HomeProductsGrid products={[ordinary]} />);

        expect(container.querySelector('.col-span-2')).not.toBeInTheDocument();
    });

    it('does not widen a featured product that has no wide image', () => {
        const featured = make({ featured: true });
        mockProducts.mockReturnValue({ data: [featured] });

        const { container } = render(<HomeProductsGrid products={[featured]} />);

        expect(container.querySelector('.col-span-2')).not.toBeInTheDocument();
        expect(screen.getAllByAltText('Signature Box of 24')).toHaveLength(1);
    });
});

describe('HomeProductsGrid lead products', () => {
    const advent = make({
        id: 9,
        name: 'Advent Calendar',
        slug: 'advent-calendar',
        category: { slug: 'advent' } as Product['category'],
    });
    const box = make({ id: 2, name: 'Signature Box of 9', slug: 'box-of-9', category: { slug: 'signature-boxes' } as Product['category'] });
    const other = make({ id: 3, name: 'Bark', slug: 'bark', category: { slug: 'chocolate-barks' } as Product['category'] });

    it('puts the Advent calendar first, then the gift boxes', () => {
        mockProducts.mockReturnValue({ data: [box, other, advent] });

        render(<HomeProductsGrid products={[]} categorySlug="signature-boxes" leadSlugs={['advent-calendar']} />);

        const names = screen.getAllByRole('img').map((img) => img.getAttribute('alt'));
        expect(names.indexOf('Advent Calendar')).toBe(0);
        expect(names).toContain('Signature Box of 9');
        expect(names).not.toContain('Bark');
    });

    it('lists a lead product once even if it is also in the category', () => {
        const advInBoxes = { ...advent, category: box.category } as Product;
        expect(orderRow([box, advInBoxes], 'signature-boxes', ['advent-calendar']).map((p) => p.slug))
            .toEqual(['advent-calendar', 'box-of-9']);
    });

    it('skips a lead slug that is not active', () => {
        expect(orderRow([box], 'signature-boxes', ['advent-calendar']).map((p) => p.slug)).toEqual(['box-of-9']);
    });
});
