'use client';

import ProductDetail from '@/components/product_detail/ProductDetail';

export default function Page({ params }: { params: { product_slug: string } }) {
	return (
		<>
			{/* <header className='bg-white shadow'>
				<div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
					<h1 className='text-3xl font-bold tracking-tight text-gray-900'>
						Dashboard
					</h1>
				</div>
			</header> */}
			<main className='mx-auto max-w-screen-2xl'>
				<ProductDetail slug={params.product_slug} />
			</main>
		</>
	);
}
