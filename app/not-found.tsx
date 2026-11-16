import { buttonClasses } from '@/components/common/Button';
export default function NotFound() {
	return (
		<main className='grid min-h-full place-items-center bg-main-bg dark:bg-main-bg-dark px-6 py-24 sm:py-32 lg:px-8'>
			<div className='text-center'>
				<p className='text-base font-semibold text-primary dark:text-primary-light'>404</p>
				<h1 className='mt-4 text-3xl font-bold tracking-tight text-primary-text dark:text-primary-text-light sm:text-5xl'>
					Page not found
				</h1>
				<p className='mt-6 text-base leading-7 text-primary-text dark:text-primary-text-light'>
					Sorry, we couldn&apos;t find the page you&apos;re looking
					for.
				</p>
				<div className='mt-10 flex items-center justify-center gap-x-2'>
					<a
						href='/'
						className={buttonClasses({ className: 'whitespace-nowrap' })}
					>
						Go back home
					</a>
					<a href='/contact' className={buttonClasses({ variant: 'tertiary', className: 'whitespace-nowrap' })}>
						Contact support <span aria-hidden='true'>&rarr;</span>
					</a>
				</div>
			</div>
		</main>
	);
}
