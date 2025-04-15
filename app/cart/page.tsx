'use client';

import dynamic from 'next/dynamic';
const Cart = dynamic(() => import('@/components/cart/Cart'), { ssr: false });	
export default function Page() {
	return (
			<div className='mx-auto max-w-screen-2xl md:py-6 md:py-8 py-4 sm:px-6 lg:px-8'>
				<Cart />
			</div>
	);
}
