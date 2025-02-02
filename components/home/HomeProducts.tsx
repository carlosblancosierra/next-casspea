"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import { selectAllProducts, selectBoxes } from '@/redux/features/products/productSlice';
import { useAppSelector } from '@/redux/hooks';

interface HomeProductsProps {
}

const HomeProducts: React.FC<HomeProductsProps> = ({
}) => {
	const boxes = useAppSelector(selectBoxes);
	const productVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	};

	return (
		<section className="dark:bg-gray-900">
			<div
				className={`grid gap-x-2 gap-y-2 mt-2 justify-center ${boxes.length < 3
					? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
					: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
					}`}
			>
				<AnimatePresence>
					{boxes.map((product) => (
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
		</section>
	);
}

export default HomeProducts;

