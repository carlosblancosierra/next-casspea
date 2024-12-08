import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import HomeProducts from '@/components/home/HomeProducts';
import HomeGallery from '@/components/home/HomeGallery';
import FlavourCarousel from '@/components/flavours/FlavourCarousel';
import { Playfair_Display } from 'next/font/google';
const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'CassPea Hand Crafted Chocolates',
	description: '',
};

export default function HomePage() {
	return (
		<main className='dark:bg-gray-900 min-h-[100vh] max-w-screen-2xl md:mx-auto mx-3'>
			<section className="dark:bg-gray-900">
				<div className="grid grid-cols-1 lg:grid-cols-12 mpx-4 py-4 mx-auto lg:gap-8 xl:gap-0 lg:py-16 relative">
					<div className="md:mr-10 lg:mt-[5vh] grid-cols-1 lg:col-span-6">
						<h1 className={`${playfair.className} mb-2 text-5xl font-extrabold tracking-tight leading-none md:text-8xl dark:text-white`}>
							London’s Finest Artisan Chocolates
						</h1>
						<h2 className="text-2xl md:text-2xl tracking-tight mb-2 dark:text-white">Celebrate Christmas with Our Signature Gift Boxes</h2>
						<p className="hidden md:block md:mb-6 font-light text-sm text-gray-500 lg:mb-8 md:text-base dark:text-gray-200">Share the love with CassPea Chocolates—perfect for personal indulgence, birthdays, corporate events, and special celebrations. With over 20 exquisite flavours, each handcrafted to perfection by our skilled chocolatiers, every bite is a work of art and a journey through inspired flavours.</p>
						{/* Desktop buttons */}
						<div className='hidden md:flex gap-2'>
							<Link href="/store" className="inline-flex items-center justify-center px-8 py-4 mr-3 text-xl font-medium text-center text-white rounded-lg bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300">
								Shop Now
								<svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
							</Link>
							<Link href="/custom-orders" className="inline-flex items-center justify-center px-8 py-4 text-xl font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
								Custom Orders
							</Link>
						</div>

					</div>
					<div className="col-span-1 lg:col-span-6">
						<Image src="/home/hero-1.png"
							width={0}
							height={0}
							sizes='100vw'
							priority
							className='w-full h-auto hidden md:block'
							alt="CassPea Chocolates" />

						<Image src="/home/christmas/hero1.jpg"
							width={0}
							height={0}
							sizes='100vw'
							priority
							className='w-full h-auto block md:hidden'
							alt="CassPea Chocolates" />

						<p className="md:hidden md:mb-6 font-light text-sm text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-200">Share the love with CassPea Chocolates—perfect for personal indulgence, birthdays, corporate events, and special celebrations. With over 20 exquisite flavours, each handcrafted to perfection by our skilled chocolatiers, every bite is a work of art and a journey through inspired flavours.</p>
					</div>
				</div>
			</section>
			<div>
				<h2 className='text-center text-2xl font-bold mb-3'>Signature Boxes</h2>
				<HomeProducts />
			</div>
			<div className='mt-10'>
				<h2 className='text-center text-2xl font-bold'>Our Flavours</h2>
				<FlavourCarousel />
			</div>
			<div className="mt-10">
				<h2 className='text-center text-2xl font-bold mb-3'>Gallery</h2>
				<HomeGallery />
			</div>
		</main>
	);
}
