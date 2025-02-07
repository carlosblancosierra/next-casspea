'use client';

import Store from '@/components/store/Store';

export default function Page({ params }: { params: { product_slug: string } }) {
	console.log('Params:', params);
	return (
		<>
			<main className='mx-auto dark:bg-gray-900'>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Shop Now
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						Discover our delicious selection of handcrafted chocolates and create your unique box
					</p>
				</div>
				<Store/>
			</main>
		</>
	);
}
