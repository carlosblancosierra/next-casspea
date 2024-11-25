// src/redux/services/cartApiSlice.ts

import { apiSlice } from '@/redux/services/apiSlice';
import { Cart, CartItem, CartItemRequest, CartUpdate, CartUpdateResponse } from '@/types/carts';
import { setCart, addCartItem, updateCartItem, removeCartItem } from '@/redux/features/carts/cartSlice';

const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<Cart, void>({
            query: () => '/carts/',
            transformResponse: (response: Cart) => response,
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCart(data));
                } catch (err) {
                    console.error('Error fetching cart:', err);
                }
            },
        }),
        updateCart: builder.mutation<CartUpdateResponse, CartUpdate>({
            query: (cart) => ({
                url: '/carts/',
                method: 'POST',
                body: cart,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCart(data.cart));
                } catch (err) {
                    console.error('Error fetching cart:', err);
                }
            },
        }),

        addCartItem: builder.mutation<CartItem, CartItemRequest>({
            query: (cartItem) => ({
                url: '/carts/items/',
                method: 'POST',
                body: cartItem,
            }),
            transformResponse: (response: CartItem) => response,
            async onQueryStarted(cartItem, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Optionally update the cart in the store
                    dispatch(addCartItem(data));
                } catch (err) {
                    console.error('Error adding cart item:', err);
                }
            },
        }),
        updateCartItem: builder.mutation<CartItem, { id: number; cartItem: Partial<CartItem> }>({
            query: ({ id, cartItem }) => ({
                url: `/carts/items/${id}/`,
                method: 'PUT',
                body: cartItem,
            }),
            transformResponse: (response: CartItem) => response,
            async onQueryStarted({ id, cartItem }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateCartItem(data));
                } catch (err) {
                    console.error('Error updating cart item:', err);
                }
            },
        }),
        deleteCartItem: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/carts/items/${id}/`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Optionally update the cart in the store
                    dispatch(removeCartItem(id));
                } catch (err) {
                    console.error('Error deleting cart item:', err);
                }
            },
        }),
    }),
});

export const {
    useGetCartQuery,
    useUpdateCartMutation,
    useAddCartItemMutation,
    useUpdateCartItemMutation,
    useDeleteCartItemMutation,

} = cartApiSlice;

export default cartApiSlice;
