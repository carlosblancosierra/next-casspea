import { render, screen } from '@testing-library/react';
import ProductBreadcrumb from '@/components/product_detail/ProductBreadcrumb';
import { Product } from '@/types/products';

const productWithCategory: Product = {
  id: 1,
  name: 'Chocolate Box',
  slug: 'chocolate-box',
  category: {
    id: 5,
    name: 'Signature Boxes',
    slug: 'signature-boxes',
  },
};

const productWithoutCategory: Product = {
  id: 2,
  name: 'Plain Box',
  slug: 'plain-box',
};

describe('ProductBreadcrumb', () => {
  it('renders Store breadcrumb link', () => {
    render(<ProductBreadcrumb product={productWithCategory} />);
    expect(screen.getByText('Store')).toHaveAttribute('href', '/shop-now/');
  });

  it('uses category slug in href when category exists', () => {
    render(<ProductBreadcrumb product={productWithCategory} />);
    const categoryLink = screen.getByText('Signature Boxes');
    expect(categoryLink).toHaveAttribute('href', '/shop-now/categories/signature-boxes');
  });

  it('falls back to /shop-now/ when no category', () => {
    render(<ProductBreadcrumb product={productWithoutCategory} />);
    const links = screen.getAllByRole('link');
    const fallbackLink = links.find(l => l.getAttribute('href') === '/shop-now/');
    expect(fallbackLink).toBeTruthy();
  });

  it('renders category name as link text', () => {
    render(<ProductBreadcrumb product={productWithCategory} />);
    expect(screen.getByText('Signature Boxes')).toBeInTheDocument();
  });

  it('has aria-label for accessibility', () => {
    render(<ProductBreadcrumb product={productWithCategory} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
  });
});
