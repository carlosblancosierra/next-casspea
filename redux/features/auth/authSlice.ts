import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: state => {
            state.isAuthenticated = true;
        },
        logout: state => {
            state.isAuthenticated = false;
        },
        startLoading: state => {
            state.isLoading = true;
        },
        finishInitialLoad: state => {
            state.isLoading = false;
        },
    },
});

export const { setAuth, logout, startLoading, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;
