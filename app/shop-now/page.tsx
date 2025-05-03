'use client';

import Store from '@/components/store/Store';

export default function Page() {
	return (
		<>
			<main className='mx-auto dark:bg-gray-900'>
				<div className="md:text-center mb-8">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Shop Now
					</h1>
				</div>
				<Store/>
			</main>
		</>
	);
}
