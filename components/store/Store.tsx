import React, { useEffect } from 'react';
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/products';
import Spinner from "@/components/common/Spinner";

export default function Store() {
	const { data, isLoading, error } = useGetActiveProductsQuery();

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

	const productVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	};

	return (
		<div className="container mx-auto min-h-[80vh]">
			<div
				className="grid gap-x-2 gap-y-2 mt-2 justify-center grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
			>
				<AnimatePresence>
					{products.map((product: Product) => (
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
