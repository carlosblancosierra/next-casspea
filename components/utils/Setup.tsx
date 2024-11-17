'use client';

import { useVerify } from '@/hooks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetchAndSaveFlavours from '@/hooks/useFetchAndSaveFlavours';

export default function Setup() {
	// useVerify();
	// useFetchAndSaveFlavours();
	return <ToastContainer />;
}
