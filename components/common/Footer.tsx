import Link from "next/link";

export default function Footer() {
	return (
		<footer className='bg-gray-100 h-16 dark:bg-gray-800'>
			<div className='h-full px-2'>
				<div className='flex flex-col items-center justify-center h-full gap-1'>
					<p className='secondary-text text-xs'>
						&copy; 2024 CassPea LTD. All rights reserved.
					</p>
					<p className='secondary-text text-xs'>
						<Link href="/orders">Log In</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}
