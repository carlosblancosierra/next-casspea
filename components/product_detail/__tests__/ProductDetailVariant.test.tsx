import { render, screen } from '@testing-library/react';
import ProductDetail from '@/components/product_detail/ProductDetail';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { useExperiment } from '@/hooks/useExperiment';

jest.mock('@/redux/features/products/productApiSlice', () => ({
    useGetProductsQuery: jest.fn(),
}));

jest.mock('@/hooks/useExperiment', () => ({
    useExperiment: jest.fn(),
}));

jest.mock('@/components/product_detail/ProductFormBoxes', () => ({
    __esModule: true,
    default: () => <div>control builder</div>,
}));

jest.mock('@/components/product_detail/QuickBoxBuilder', () => ({
    __esModule: true,
    default: () => <div>quick builder</div>,
}));

// Everything else on the page is irrelevant to which builder renders.
jest.mock('@/components/product_detail/ProductInfo', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/product_detail/ImageGallery', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/product_detail/ProductBreadcrumb', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/product_detail/ProductAccordion', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/product_detail/ProductFormGeneral', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/flavours/FlavourCarousel', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/common/Reviews', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/store/ProductCard', () => ({ __esModule: true, default: () => null }));

const mockProducts = useGetProductsQuery as jest.Mock;
const mockUseExperiment = useExperiment as jest.Mock;

const box = {
    id: 4,
    name: 'Signature Box of 9',
    slug: 'box-of-9',
    units_per_box: 9,
    base_price: '14.99',
    category: { slug: 'signature-boxes', name: 'Signature Boxes', id: 1 },
    images: [],
};

describe('ProductDetail box-builder split', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockProducts.mockReturnValue({ data: [box], isLoading: false, error: undefined });
    });

    it('shows the current builder for the control variant', () => {
        mockUseExperiment.mockReturnValue({ variant: 'control', isLoading: false, track: jest.fn() });

        render(<ProductDetail slug="box-of-9" />);

        expect(screen.getByText('control builder')).toBeInTheDocument();
        expect(screen.queryByText('quick builder')).not.toBeInTheDocument();
    });

    it('shows the quick builder for the quick variant', () => {
        mockUseExperiment.mockReturnValue({ variant: 'quick', isLoading: false, track: jest.fn() });

        render(<ProductDetail slug="box-of-9" />);

        expect(screen.getByText('quick builder')).toBeInTheDocument();
        expect(screen.queryByText('control builder')).not.toBeInTheDocument();
    });

    it('shows neither builder until the variant has resolved', () => {
        mockUseExperiment.mockReturnValue({ variant: 'control', isLoading: true, track: jest.fn() });

        render(<ProductDetail slug="box-of-9" />);

        // Rendering one builder and swapping it is both a bad experience and a
        // dirty impression — the visitor is counted for a builder they may
        // never have used.
        expect(screen.queryByText('control builder')).not.toBeInTheDocument();
        expect(screen.queryByText('quick builder')).not.toBeInTheDocument();
    });
});
