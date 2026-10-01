import { render, screen } from '@testing-library/react';
import HomeProductsGrid from '@/components/home/HomeProductsGrid';
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
