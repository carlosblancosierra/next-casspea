import React, { useState } from 'react';
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductCategory } from '@/types/products';
import Spinner from "@/components/common/Spinner";


export default function Store() {
	const { data, isLoading, error } = useGetActiveProductsQuery();
	const [selectedCategory, setSelectedCategory] = useState<string>('All');

	// useEffect(() => {
	// 	console.log("Store - isLoading:", isLoading);
	// 	console.log("Store - error:", error);
	// 	console.log("Store - data:", data);
	// }, [isLoading, error, data]);

	if (isLoading || !data) {
		// console.log("Store: Still loading or data is not available");
		return <div className="flex items-center justify-center min-h-screen">
                <Spinner md />
            </div>;
	}

	const products: Product[] = data;

	if (products.length === 0) {
		console.log("Store: No products found, products array is empty", products);
		return <div className="text-primary-text dark:text-primary-text-light">No products found</div>;
	}

	const categoriesSlugs = ['All', 'signature-boxes', 'chocolate-barks', 'hot-chocolate'];

	const filteredProducts: Product[] = selectedCategory === 'All'
		? products
		: products.filter((product: Product) => product?.category?.slug === selectedCategory);

	const productVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	};

	const buttonVariants = {
		hover: { scale: 1.1 },
		tap: { scale: 0.9 },
	};

	const showOrderingSteps = selectedCategory === 'All' || selectedCategory === 'signature-boxes';

	return (
		<div className="container mx-auto min-h-[80vh]">
			<>
				<h2 className="font-bold mt-2 text-primary-text dark:text-primary-text-light">
					Ordering delicious hand made chocolates from CassPea is simple and fun!
				</h2>
				<ol className="mt-4 space-y-1 list-decimal list-inside">
					<li className="font-bold text-pink-500 dark:text-pink-500">For Signature Boxes, select your box size</li>
					<li className="font-bold text-green-500 dark:text-green-500">Choose a Surprise Box or Pick and Mix your own from our succulent flavours</li>
					<li className="font-bold text-red-500 dark:text-red-500">Select a shipping date - FREE delivery for orders over £45</li>
					<li className="font-bold text-orange-500 dark:text-orange-400">Pay securely online</li>
					<li className="font-bold text-purple-500 dark:text-purple-500">Receive your chocolates and enjoy!</li>
				</ol>
			</>
			<div className="flex items-center justify-start py-2 overflow-x-auto whitespace-nowrap space-x-2 no-scrollbar pt-4 mx-auto">
				{categoriesSlugs.map((categorySlug) => (
					<motion.button
						key={categorySlug}
						type="button"
						onClick={() => setSelectedCategory(categorySlug)}
						className={`${
							selectedCategory === categorySlug
								? 'text-primary-text-light bg-primary border-primary dark:bg-primary dark:border-primary'
								: 'text-primary-text dark:text-primary-text-light bg-main-bg border border-gray-200 dark:bg-main-bg-dark dark:border-gray-700'
						} hover:bg-blue-700 hover:text-primary-text-light dark:hover:bg-blue-600 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-full
              text-xs px-3 py-2
              sm:text-xs sm:px-4 sm:py-2
              md:text-base md:px-5 md:py-3
              lg:text-lg lg:px-6 lg:py-3
              text-center`}
						whileHover="hover"
						whileTap="tap"
						variants={buttonVariants}
					>
						{categorySlug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
					</motion.button>
				))}
			</div>

			<div
				className="grid gap-x-2 gap-y-2 mt-2 justify-items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
			>
				<AnimatePresence>
					{filteredProducts.map((product: Product) => (
						<motion.div
							key={product.name}
							initial="hidden"
							animate="visible"
							exit="hidden"
							layout
							variants={productVariants}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							className="w-full"
						>
							<ProductCard product={product} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
