'use client';

import { useVerify } from '@/hooks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import { useGetCartQuery } from '@/redux/features/carts/cartApiSlice';

export default function Setup() {
	// useVerify();
	useGetCartQuery();
	useGetProductsQuery();
	useGetFlavoursQuery();
	return <ToastContainer />;
}
