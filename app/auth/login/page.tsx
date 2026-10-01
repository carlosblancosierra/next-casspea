import { LoginForm } from '@/components/forms';
import { SocialButtons } from '@/components/common';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
	title: 'Sign in | CassPea',
	description: 'Sign in to your CassPea account.',
};

export default function Page() {
	return (
		<div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
				<Image
					className='mx-auto h-10 w-auto'
					src='/logos/pink.png'
					width={0}
					height={0}
					sizes='100vw'
					priority
					alt='CassPea Chocolates Logo'
				/>
				<h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary-text dark:text-primary-text-light'>
					Sign in to your account
				</h2>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
				<LoginForm />
				{/* <SocialButtons /> */}
			</div>
		</div>
	);
}
