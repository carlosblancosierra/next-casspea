"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import { selectAllProducts, selectValentines } from '@/redux/features/products/productSlice';
import { useAppSelector } from '@/redux/hooks';

interface HomeValentinesProps {
}

const HomeValentines: React.FC<HomeValentinesProps> = ({
}) => {
	const valentines = useAppSelector(selectValentines);
	const productVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	};

	return (
		<section className="dark:bg-gray-900">
			<div className={`grid gap-x-4 gap-y-4 mt-2 mx-auto
				grid-cols-2 md:grid-cols-4 place-items-center`}
			>
				<AnimatePresence>
					{valentines.flatMap((product) => [
						// First instance with primary image
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
						// Second instance with alternate image
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

