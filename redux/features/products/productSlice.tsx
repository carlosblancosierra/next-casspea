// slices/productSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product as ProductType } from '@/types/products';
import { RootState } from '@/redux/store';
import { createSelector } from '@reduxjs/toolkit';

interface ProductState {
    products: ProductType[];
}

const initialState: ProductState = {
    products: [],
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<ProductType[]>) {
            state.products = action.payload;
        },
    },
});

// Base selector
const selectProductsState = (state: RootState) => state.products;

// Memoized selectors
export const selectAllProducts = createSelector(
    [selectProductsState],
    (productsState) => productsState.products
);

export const selectBoxes = createSelector(
    [selectAllProducts],
    (products) => products.filter(p => p.category?.slug === 'gift-boxes') || []
);

export const selectSnacks = createSelector(
    [selectAllProducts],
    (products) => products.filter(p => p.category?.slug === 'snacks') || []
);

export const selectAdvent = createSelector(
    [selectAllProducts],
    (products) => products.filter(p => p.category?.slug === 'advent-calendar') || []
);

export const selectProductBySlug = (state: RootState, slug: string): ProductType | undefined =>
    state.products.products.find(product => product.slug === slug);

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
