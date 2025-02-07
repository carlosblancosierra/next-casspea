'use client';

import Store from '@/components/store/Store';

export default function Page({ params }: { params: { product_slug: string } }) {
	console.log('Params:', params);

	// If the product slug is not 'valentines-heart', show ordering steps.
	const showOrderingSteps = params.product_slug !== 'valentines-heart';

	return (
		<>
			<main className='mx-auto dark:bg-gray-900'>
				<div className="md:text-center mb-8">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Shop Now
					</h1>
					{showOrderingSteps && (
						<>
							<h2 className="font-bold mt-2">
								Ordering delicious hand made chocolates from CassPea is simple and fun!
							</h2>
							<ol className="mt-4 space-y-1 list-decimal list-inside">
								<li className="font-bold text-pink-500 dark:text-pink-500">For Signature Boxes, select your box size</li>
								<li className="font-bold text-green-500 dark:text-green-500">Choose a Surprise Box or Pick and Mix your own from our succulent flavours</li>
								<li className="font-bold text-red-500 dark:text-red-500">Select a shipping date - FREE delivery for orders over £45</li>
								<li className="font-bold text-orange-500 dark:text-orange-400">Pay securely online</li>
								<li className="font-bold text-purple-500 dark:text-purple-500">Receive your chocolates and enjoy!</li>
							</ol>
						</>
					)}
				</div>
				<Store/>
			</main>
		</>
	);
}
