import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './services/apiSlice';
import authReducer from './features/authSlice';
import productReducer from './features/products/productSlice';
import flavourReducer from './features/flavour/flavourSlice';
import cartReducer from './features/carts/cartSlice';
import checkoutReducer from './features/checkout/checkoutSlice';
import shippingReducer from './features/shipping/shippingSlice';
export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authReducer,
		cart: cartReducer,
		checkout: checkoutReducer,
		flavours: flavourReducer,
		products: productReducer,
		shipping: shippingReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<(typeof store)['getState']>;
export type AppDispatch = (typeof store)['dispatch'];
