import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/store/ProductCard';
import { Product } from '@/types/products';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: any) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

const mockUseProductDiscountedPrice = jest.fn().mockReturnValue({
  discountedPrice: null,
  discount_percentage: null,
  hasDiscount: false,
});

jest.mock('@/utils/useProductDiscountedPrice', () => ({
  useProductDiscountedPrice: (...args: any[]) => mockUseProductDiscountedPrice(...args),
}));

const baseProduct: Product = {
  id: 1,
  name: 'Signature Chocolate Box',
  slug: 'signature-chocolate-box',
  current_price: '32.50',
  image: '/images/product.jpg',
  units_per_box: 16,
  sold_out: false,
};

describe('ProductCard', () => {
  it('renders the product name', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText('Signature Chocolate Box')).toBeInTheDocument();
  });

  it('renders price with £ symbol', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText('£32.50')).toBeInTheDocument();
  });

  it('links to correct product slug', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/shop-now/signature-chocolate-box');
  });

  it('shows units per box when available', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText('16 pieces')).toBeInTheDocument();
  });

  it('does not show piece count when units_per_box is absent', () => {
    render(<ProductCard product={{ ...baseProduct, units_per_box: undefined }} />);
    expect(screen.queryByText(/pieces/)).not.toBeInTheDocument();
  });

  it('shows weight when no units_per_box but weight exists', () => {
    render(<ProductCard product={{ ...baseProduct, units_per_box: undefined, weight: 200 }} />);
    expect(screen.getByText('200g')).toBeInTheDocument();
  });

  it('shows Sold out badge when sold_out is true', () => {
    render(<ProductCard product={{ ...baseProduct, sold_out: true }} />);
    expect(screen.getByText('Sold out')).toBeInTheDocument();
  });

  it('does not show Sold out when sold_out is false', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.queryByText('Sold out')).not.toBeInTheDocument();
  });

  it('shows discounted price with strikethrough when discount applies', () => {
    mockUseProductDiscountedPrice.mockReturnValueOnce({
      discountedPrice: '26.00',
      discount_percentage: 20,
      hasDiscount: true,
    });
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText('£26.00')).toBeInTheDocument();
  });

  it('renders product image', () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByAltText('Signature Chocolate Box')).toBeInTheDocument();
  });
});
