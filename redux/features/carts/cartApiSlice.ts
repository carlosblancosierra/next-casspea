// src/redux/services/cartApiSlice.ts

import { apiSlice } from '@/redux/services/apiSlice';
import { Cart, CartItem, CartItemRequest, CartUpdate, CartUpdateResponse } from '@/types/carts';

const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<Cart, void>({
            query: () => '/carts/',
            transformResponse: (response: Cart) => response,
            providesTags: ['Cart'],
        }),
        updateCart: builder.mutation<CartUpdateResponse, CartUpdate>({
            query: (cart) => ({
                url: '/carts/',
                method: 'POST',
                body: cart,
            }),
            invalidatesTags: ['Cart'],
        }),

        addCartItem: builder.mutation<CartItem, CartItemRequest>({
            query: (cartItem) => ({
                url: '/carts/items/',
                method: 'POST',
                body: cartItem,
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCartItem: builder.mutation<CartItem, { id: number; cartItem: Partial<CartItem> }>({
            query: ({ id, cartItem }) => ({
                url: `/carts/items/${id}/`,
                method: 'PUT',
                body: cartItem,
            }),
            invalidatesTags: ['Cart'],
        }),
        deleteCartItem: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/carts/items/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
        changeCartItemQuantity: builder.mutation<CartItem, { id: number; quantity: number }>({
            query: ({ id, quantity }) => ({
                url: `/carts/items/${id}/change-quantity/`,
                method: 'PATCH',
                body: { quantity }
            }),
            invalidatesTags: ['Cart'],
        }),

        removeCartItem: builder.mutation<void, number>({
            query: (id) => ({
                url: `/carts/items/${id}/remove/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useUpdateCartMutation,
    useAddCartItemMutation,
    useUpdateCartItemMutation,
    useDeleteCartItemMutation,
    useChangeCartItemQuantityMutation,
    useRemoveCartItemMutation,
} = cartApiSlice;

export default cartApiSlice;
