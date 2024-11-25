import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckoutSession } from '@/types/checkout';
import { RootState } from '@/redux/store';

interface CheckoutState {
    session: CheckoutSession | null;
    loading: boolean;
    error: string | null;
}

const initialState: CheckoutState = {
    session: null,
    loading: false,
    error: null,
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setCheckoutSession: (state, action: PayloadAction<CheckoutSession>) => {
            state.session = action.payload;
            state.error = null;
        },
        clearCheckoutSession: (state) => {
            state.session = null;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
});

export const { setCheckoutSession, clearCheckoutSession, setError } = checkoutSlice.actions;

// Selectors
export const selectCheckoutSession = (state: RootState) => state.checkout.session;

export const selectHasAddresses = (state: RootState) => {
    const session = state.checkout.session;
    return !!(session?.shipping_address && session?.billing_address);
};

export default checkoutSlice.reducer;
