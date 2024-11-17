'use client';

import Store from '@/components/store/Store';

export default function Page({ params }: { params: { product_slug: string } }) {
	console.log('Params:', params);
	return (
		<>
			<main className='mx-auto px-2 dark:bg-gray-900'>
				<Store/>
			</main>
		</>
	);
}
