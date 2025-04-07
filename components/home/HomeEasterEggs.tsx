"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface HomeEasterEggsProps {}

const HomeEasterEggs: React.FC<HomeEasterEggsProps> = () => {

	return (
		<section className="py-4 bg-main-bg dark:bg-gray-900">
			<h2 className='text-center text-2xl font-bold mb-3 font-playfair'>Easter Eggs</h2>

			<div className="max-w-4xl mx-auto">
			<Link href="https://www.casspea.co.uk/shop-now/salted-caramel-and-brownie-easter-egg">
				<Image 
					src="/home/easter-egg-1.jpg"
					alt="Salted Caramel & Brownie Easter Egg" 
					width={0}
					height={0}
					sizes="100vw"
					className="w-full h-auto object-cover rounded-lg shadow-md mb-6 md:hidden" 
				/>
				<Image 
					src="/home/easter-egg-2.jpg"
					alt="Salted Caramel & Brownie Easter Egg" 
					width={0}
					height={0}
					sizes="100vw"
					className="w-full h-auto object-cover rounded-lg shadow-md mb-6 hidden md:block" 
				/>
				<h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">
					Salted Caramel & Brownie Easter Egg
				</h2>
				<div className="flex justify-center">
					<span className="inline-block px-6 py-3 text-lg font-medium text-white bg-pink-700 hover:bg-pink-800 rounded-md mx-auto rounded-xl">
						Preorder Now
					</span>
				</div>
			</Link>
			</div>
		</section>
	);
}

export default HomeEasterEggs;

