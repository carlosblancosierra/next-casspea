// src/redux/features/carts/cartSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem } from '@/types/carts';
import { RootState } from '@/redux/store';

interface CartState {
    cart: Cart | null;
}

const initialState: CartState = {
    cart: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action: PayloadAction<Cart>) {
            state.cart = action.payload;
        },
        addCartItem(state, action: PayloadAction<CartItem>) {
            if (state.cart) {
                state.cart.items.push(action.payload);
            }
        },
        updateCartItem(state, action: PayloadAction<CartItem>) {
            if (state.cart) {
                const index = state.cart.items.findIndex(
                    (item) => item.id === action.payload.id
                );
                if (index !== -1) {
                    state.cart.items[index] = action.payload;
                }
            }
        },
        removeCartItem(state, action: PayloadAction<number>) {
            if (state.cart) {
                state.cart.items = state.cart.items.filter(
                    (item) => item.id !== action.payload
                );
            }
        },
    },
});

export const { setCart, addCartItem, updateCartItem, removeCartItem } = cartSlice.actions;

export const selectCartEntries = (state: RootState) => state.cart.cart?.items || [];
export const selectCart = (state: RootState) => state.cart.cart;
export default cartSlice.reducer;
