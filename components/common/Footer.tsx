import Link from "next/link";

export default function Footer() {
	return (
		<footer className='bg-gray-100 h-16 dark:bg-main-bg-dark'>
			<div className='h-full px-2'>
				<div className='flex flex-col items-center justify-center h-full gap-1'>
					<p className='text-primary-text text-xs'>
						&copy; 2024 CassPea LTD. All rights reserved.
					</p>
					<p className='text-primary-text text-xs'>
						<Link href="/orders">Log In</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}
