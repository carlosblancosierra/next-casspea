"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice';
import { Product } from '@/types/products';
import Spinner from "@/components/common/Spinner";
interface HomeValentinesProps {}

const HomeValentines: React.FC<HomeValentinesProps> = () => {
	const { data: products, isLoading, error } = useGetActiveProductsQuery();

	if (isLoading) return (
		<div className="flex items-center justify-center min-h-screen">
            <Spinner md />
        </div>
		);
	if (error) return <div>Error:</div>;

	const valentines: Product[] = products?.filter(
		(product) => product.category?.slug === "valentines-day"
	) ?? [];

	const productVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	};

	return (
		<section className="dark:bg-gray-900">
			<div
				className={`grid gap-x-4 gap-y-4 mt-2 mx-auto grid-cols-2 md:grid-cols-4 place-items-center`}
			>
				<AnimatePresence>
					{valentines.flatMap((product) => [
						<motion.div
							key={`${product.name}-1`}
							initial="hidden"
							animate="visible"
							exit="hidden"
							layout
							variants={productVariants}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							className="w-full"
						>
							<ProductCard product={product} useAlternateImage={false} />
						</motion.div>,
						<motion.div
							key={`${product.name}-2`}
							initial="hidden"
							animate="visible"
							exit="hidden"
							layout
							variants={productVariants}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							className="w-full"
						>
							<ProductCard product={product} useAlternateImage={true} />
						</motion.div>
					])}
				</AnimatePresence>
			</div>
		</section>
	);
}

export default HomeValentines;

