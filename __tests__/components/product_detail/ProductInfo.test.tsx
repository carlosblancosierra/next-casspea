import { render, screen } from '@testing-library/react';
import ProductInfo from '@/components/product_detail/ProductInfo';
import { Product } from '@/types/products';

const mockUseProductDiscountedPrice = jest.fn().mockReturnValue({
  discountedPrice: null,
  discount_percentage: null,
  hasDiscount: false,
});

jest.mock('@/utils/useProductDiscountedPrice', () => ({
  useProductDiscountedPrice: (...args: any[]) => mockUseProductDiscountedPrice(...args),
}));

jest.mock('@/components/product_detail/PreorderCountdown', () => ({
  __esModule: true,
  default: () => <div data-testid="preorder-countdown" />,
}));

const baseProduct: Product = {
  id: 1,
  name: 'Luxury Box',
  slug: 'luxury-box',
  seo_title: 'Luxury Chocolate Gift Box',
  description: 'Handcrafted chocolates from London.',
  current_price: '45.00',
  can_pick_allergens: false,
};

describe('ProductInfo', () => {
  it('renders the seo_title as heading', () => {
    render(<ProductInfo product={baseProduct} />);
    expect(screen.getByText('Luxury Chocolate Gift Box')).toBeInTheDocument();
  });

  it('renders the product description', () => {
    render(<ProductInfo product={baseProduct} />);
    expect(screen.getByText('Handcrafted chocolates from London.')).toBeInTheDocument();
  });

  it('renders the price', () => {
    render(<ProductInfo product={baseProduct} />);
    expect(screen.getByText(/£45\.00/)).toBeInTheDocument();
  });

  it('does NOT show allergen note when can_pick_allergens is false', () => {
    render(<ProductInfo product={baseProduct} />);
    expect(screen.queryByText(/Allergen-free customisation/i)).not.toBeInTheDocument();
  });

  it('shows allergen note when can_pick_allergens is true', () => {
    render(<ProductInfo product={{ ...baseProduct, can_pick_allergens: true }} />);
    expect(screen.getByText(/Allergen-free customisation available/i)).toBeInTheDocument();
  });

  it('allergen note mentions dairy and gluten', () => {
    render(<ProductInfo product={{ ...baseProduct, can_pick_allergens: true }} />);
    expect(screen.getByText(/dairy/i)).toBeInTheDocument();
    expect(screen.getByText(/gluten/i)).toBeInTheDocument();
  });

  it('shows discounted price when discount applies', () => {
    mockUseProductDiscountedPrice.mockReturnValueOnce({
      discountedPrice: '36.00',
      discount_percentage: 20,
      hasDiscount: true,
    });
    render(<ProductInfo product={baseProduct} />);
    expect(screen.getByText(/£36\.00/)).toBeInTheDocument();
    expect(screen.getByText(/20% off/)).toBeInTheDocument();
  });

  it('renders preorder countdown when product is preorder with date', () => {
    render(
      <ProductInfo
        product={{ ...baseProduct, preorder: true, preorder_finish_date: '2025-12-31' }}
      />
    );
    expect(screen.getByTestId('preorder-countdown')).toBeInTheDocument();
  });
});
