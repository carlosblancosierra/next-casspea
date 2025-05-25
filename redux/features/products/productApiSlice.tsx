import { apiSlice } from '@/redux/services/apiSlice';
import { Product, ProductCategory } from '@/types/products';

const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query<Product[], void>({
            query: () => '/products/',
            transformResponse: (response: Product[]) => response,
            keepUnusedDataFor: 300,
        }),

        // Get single product
        getProduct: builder.query<Product, string>({
            query: (slug) => `/products/${slug}/`,
            keepUnusedDataFor: 300,
        }),

        // Get products by category
        getProductsByCategory: builder.query<Product[], string>({
            query: (categorySlug) => `/products/?category=${categorySlug}`,
            transformResponse: (response: Product[]) => response,
            keepUnusedDataFor: 300,
        }),

        // Get active products only
        getActiveProducts: builder.query<Product[], void>({
            query: () => '/products/?active=true',
            transformResponse: (response: Product[]) => response,
            keepUnusedDataFor: 300,
        }),

        // Get product categories
        getCategories: builder.query<ProductCategory[], void>({
            query: () => '/products/categories/',
            keepUnusedDataFor: 300,
        }),

        // Get product categories
        getCategory: builder.query<ProductCategory, string>({
            query: (slug) => `/products/categories/${slug}/`,
            keepUnusedDataFor: 300,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useGetProductsByCategoryQuery,
    useGetActiveProductsQuery,
    useGetCategoriesQuery,
    useGetCategoryQuery,
} = productApiSlice;

export default productApiSlice;
