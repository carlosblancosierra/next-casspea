import React, { useState } from 'react';
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/products';
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
		return <div>No products found</div>;
	}

	const categoriesSlugs = ['All', 'signature-boxes', 'chocolate-barks', 'hot-chocolate'];

	const filteredProducts: Product[] = selectedCategory === 'All'
		? products
		: products.filter((product: Product) => product?.category?.name === selectedCategory);

	const productVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	};

	const buttonVariants = {
		hover: { scale: 1.1 },
		tap: { scale: 0.9 },
	};

	return (
		<div className="container mx-auto min-h-[80vh]">
			<div className="flex items-center justify-start py-2 overflow-x-auto whitespace-nowrap space-x-2 no-scrollbar pt-4 mx-auto">
				{categoriesSlugs.map((categorySlug) => (
					<motion.button
						key={categorySlug}
						type="button"
						onClick={() => setSelectedCategory(categorySlug)}
						className={`${
							selectedCategory === categorySlug
								? 'text-white bg-primary border-primary dark:bg-primary dark:border-primary'
								: 'text-gray-900 bg-white border border-gray-200 dark:text-white dark:bg-gray-800 dark:border-gray-700'
						} hover:bg-blue-700 hover:text-white dark:hover:bg-blue-600 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-full
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
				className="grid gap-x-2 gap-y-2 mt-2 justify-center grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
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
						>
							<ProductCard product={product} />
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
