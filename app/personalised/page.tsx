'use client';

import Personalized from '@/components/personalized/Personalized';

export default function Page() {
	return (
		<>
			<main className='mx-auto max-w-screen-2xl'>
				<h1 className='text-2xl font-semibold text-primary-text dark:text-primary-text mb-4'>Personalised Chocolates</h1>
				<p className='text-primary-text dark:text-primary-text mb-4'>
				At CassPea, we believe every celebration deserves a touch of luxury and a personal story. Whether you're planning a wedding, a corporate event, a birthday, or any special occasion, our bespoke chocolate creations are designed to make your event unforgettable.
				We can produce anywhere from 50 pieces to thousands, each meticulously crafted to reflect your vision.
				</p>
				<p>Choose from one of our six beautifully designed base templates, then personalise your selection with your own colours, gradients, brushes, dots, and patterns to match your event's theme. Once your design is set, select your favourite flavours from our extensive list—each bonbon bursting with flavour and crafted with passion.
					With allergen-friendly options available, you can tailor your order to suit every guest's needs.</p>
					<h2 className='text-lg font-semibold text-primary-text dark:text-primary-text mb-4'>Ordering is simple:</h2>
				<ol className="mt-4 space-y-1 list-decimal list-inside">
					<li className="font-bold text-pink-500 dark:text-pink-500">Choose a Base Template</li>
					<li className="font-bold text-green-500 dark:text-green-500">Personalise Your Design</li>
					<li className="font-bold text-red-500 dark:text-red-500">Select Your Flavours (minimum 50 pieces)</li>
					<li className="font-bold text-orange-500 dark:text-orange-400">Pay online securely</li>
					<li className="font-bold text-purple-500 dark:text-purple-500">Receive your chocolates and enjoy!</li>
				</ol>
				<Personalized />
			</main>
		</>
	);
}
