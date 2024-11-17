import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartEntry } from '@/types/carts';
import { RootState } from '@/redux/store';

interface CartState {
    cartEntries: CartEntry[];
}

const initialState: CartState = {
    cartEntries: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartEntry>) => {
            state.cartEntries.push(action.payload);
        },
        updateCartEntry: (state, action: PayloadAction<{ id: number; entry: Partial<CartEntry> }>) => {
            const index = state.cartEntries.findIndex((entry) => entry.id === action.payload.id);
            if (index !== -1) {
                state.cartEntries[index] = { ...state.cartEntries[index], ...action.payload.entry };
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.cartEntries = state.cartEntries.filter((entry) => entry.id !== action.payload);
        },
        clearCart: (state) => {
            state.cartEntries = [];
        },
    },
});

// Export actions
export const { addToCart, updateCartEntry, removeFromCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartEntries = (state: RootState) => state.cart.cartEntries;

// Selector to calculate the total number of items in the cart
export const selectTotalCartItems = (state: RootState) =>
    state.cart.cartEntries.reduce((total, entry) => total + entry.quantity, 0);

// Selector to calculate the total price of all the cart entries
export const selectTotalCartValue = (state: RootState) =>
    state.cart.cartEntries.reduce((total, entry) => total + (entry.quantity * parseFloat(entry.product.price)), 0);

export default cartSlice.reducer;
