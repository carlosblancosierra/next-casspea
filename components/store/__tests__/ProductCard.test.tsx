import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/store/ProductCard';
import type { Product } from '@/types/products';

jest.mock('@/utils/useProductDiscountedPrice', () => ({
    useProductDiscountedPrice: () => ({ discountedPrice: null, discount_percentage: null }),
}));

const box: Product = {
    id: 1,
    name: 'Signature Box of 24',
    slug: 'box-of-24',
    current_price: '39.99',
    weight: 300,
    image: '/img/box-24.png',
};

describe('ProductCard badge', () => {
    it('shows nothing when the shop has not switched one on', () => {
        render(<ProductCard product={{ ...box, badge_text: 'Best seller' }} />);

        expect(screen.queryByText('Best seller')).not.toBeInTheDocument();
    });

    it('shows the label when badge_active is set', () => {
        render(<ProductCard product={{ ...box, badge_text: 'Best seller', badge_active: true }} />);

        expect(screen.getByText('Best seller')).toBeInTheDocument();
    });

    it('sits on the right, so a sold-out best seller shows both labels', () => {
        render(
            <ProductCard
                product={{ ...box, sold_out: true, badge_text: 'Top pick', badge_active: true }}
            />
        );

        expect(screen.getByText('Sold out').className).toContain('left-3');
        expect(screen.getByText('Top pick').className).toContain('right-3');
    });

    it('falls back to the readable default when the colour is missing', () => {
        render(<ProductCard product={{ ...box, badge_text: 'New', badge_active: true }} />);

        expect(screen.getByText('New').className).toContain('bg-slate-700');
    });
});

describe('ProductCard featured layout', () => {
    it('uses the wide image when asked, alongside the square one', () => {
        render(<ProductCard product={{ ...box, wide_image: '/img/box-24-wide.png' }} wide />);

        // Two images: the 2:1 one for phones and the square one from `sm:` up.
        const images = screen.getAllByAltText('Signature Box of 24');
        expect(images).toHaveLength(2);
        expect(images.some(img => img.getAttribute('src')?.includes('wide'))).toBe(true);
    });

    it('stays an ordinary card when no wide image has been uploaded', () => {
        // Otherwise the featured card is a stretched square, twice the height
        // of the cards beside it — worse than not featuring it at all.
        render(<ProductCard product={box} wide />);

        expect(screen.getAllByAltText('Signature Box of 24')).toHaveLength(1);
    });
});
