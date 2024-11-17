import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import HomeProducts from '@/components/home/HomeProducts';
import HomeGallery from '@/components/home/HomeGallery';

export const metadata: Metadata = {
	title: 'CassPea Hand Crafted Chocolates',
	description: '',
};

export default function Page() {
	return (
		<main className='dark:bg-gray-900 min-h-[100vh] max-w-screen-2xl md:mx-auto mx-3'>
			<section className="dark:bg-gray-900">
				<div className="grid grid-cols-1 lg:grid-cols-12 mpx-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 relative">
					<div className="md:mr-10 lg:mt-[5vh] grid-cols-1 lg:col-span-6">
						<h1 className="mb-4 text-5xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-8xl dark:text-white">Share the love <br /> Share CassPea Chocolates</h1>
						<p className="md:mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-3xl dark:text-gray-200">Luxurious Handmade Bonbons for personal indulgence. Pick your box size, allergens and flavours. Or design your custom chocolates for your corporate event, wedding or birthday party</p>
						{/* Desktop buttons */}
						<div className='hidden md:flex gap-2'>
							<Link href="/store" className="inline-flex md:mt-5 items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300">
								View the store
								<svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
							</Link>
							<Link href="/custom-orders" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
								Custom Orders
							</Link>
						</div>

					</div>
					<div className="col-span-1 lg:col-span-6">
						<Image src="/home/hero-1.png"
							width={0}
							height={0}
							sizes='100vw'
							className='w-full h-auto hidden md:block'
							alt="CassPea Chocolates" />

						<Image src="/home/mobile-hero-1.png"
							width={0}
							height={0}
							sizes='100vw'
							className='w-full h-auto block md:hidden mt-3'
							alt="CassPea Chocolates" />
					</div>
				</div>
			</section>
			<div>
				<h2 className='text-center text-2xl font-bold mb-3'>Signature Boxes</h2>
				<HomeProducts />
			</div>
			<div className="mt-10">
				<h2 className='text-center text-2xl font-bold mb-3'>Gallery</h2>
				<HomeGallery />
			</div>
		</main>
	);
}
