import Link from "next/link";

export default function Footer() {
	return (
		<footer className='bg-gray-100 h-16 dark:bg-gray-800'>
			<div className='h-full px-2'>
				<div className='flex items-center justify-center h-full'>
					<p className='text-gray-400 text-xs'>
						&copy; 2024 CassPea LTD. All rights reserved.
					</p>
					<p><Link href="/orders">Log In</Link></p>
					{/* <p>Software by Carlos Blanco</p> */}
				</div>
			</div>
		</footer>
	);
}
