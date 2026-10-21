'use client';

import { useEffect } from 'react';
import { captureError } from '@/utils/analytics';

/** Catches render errors below the root layout, so the navbar and footer stay. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		captureError(error, { digest: error.digest, boundary: 'app' });
	}, [error]);

	return (
		<div className='grid min-h-[60vh] place-items-center px-6 py-24'>
			<div className='text-center'>
				<h1 className='text-3xl font-bold tracking-tight text-primary-text dark:text-primary-text-light'>
					Something went wrong
				</h1>
				<p className='mt-4 text-base text-primary-text dark:text-primary-text-light'>
					Sorry about that. Please try again, or come back in a moment.
				</p>
				<div className='mt-8 flex items-center justify-center gap-x-6'>
					<button
						type='button'
						onClick={reset}
						className='rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-2'
					>
						Try again
					</button>
					<a href='/' className='text-sm font-semibold text-primary-text dark:text-primary-text-light'>
						Go back home
					</a>
				</div>
			</div>
		</div>
	);
}
