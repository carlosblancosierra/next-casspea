'use client';

import ProductDetail from '@/components/product_detail/ProductDetail';
import Cart from '@/components/cart/Cart';
export default function Page() {
	return (
		<>
			<main className='mx-auto max-w-screen-2xl md:py-6 md:py-8 py-4 sm:px-6 lg:px-8'>
				<Cart />
			</main>
		</>
	);
}
