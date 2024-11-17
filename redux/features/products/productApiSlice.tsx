import { apiSlice } from '@/redux/services/apiSlice';
import { Product, ProductCategory } from '@/types/products';
import { setProducts } from '@/redux/features/products/productSlice';
import { useAppDispatch } from '@/redux/hooks';

const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query<Product[], void>({
            query: () => '/products/',
            transformResponse: (response: Product[]) => response,
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log('products data', data);
                    dispatch(setProducts(data));
                } catch (err) {
                    console.error('Error fetching products:', err);
                }
            },
        }),

        // Get single product
        getProduct: builder.query<Product, string>({
            query: (slug) => `/products/${slug}/`,
        }),

        // Get products by category
        getProductsByCategory: builder.query<Product[], string>({
            query: (categorySlug) => `/products/?category=${categorySlug}`,
            transformResponse: (response: Product[]) => response,
        }),

        // Get active products only
        getActiveProducts: builder.query<Product[], void>({
            query: () => '/products/?active=true',
            transformResponse: (response: Product[]) => response,
        }),

        // Get product categories
        getCategories: builder.query<ProductCategory[], void>({
            query: () => '/products/categories/',
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useGetProductsByCategoryQuery,
    useGetActiveProductsQuery,
    useGetCategoriesQuery,
} = productApiSlice;

export default productApiSlice;
