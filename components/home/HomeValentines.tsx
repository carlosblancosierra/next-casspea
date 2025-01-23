"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import { selectAllProducts, selectValentines } from '@/redux/features/products/productSlice';
import { useAppSelector } from '@/redux/hooks';

interface HomeProductsProps {
}

const HomeProducts: React.FC<HomeProductsProps> = ({
}) => {
	const valentines = useAppSelector(selectValentines);
	const productVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
	};

	return (
		<section className="dark:bg-gray-900">
			<div
				className={`grid gap-x-2 gap-y-2 mt-2 mx-auto max-w-7xl
					grid-cols-2 sm:grid-cols-4 place-items-center
					${valentines.length <= 2 ? 'md:grid-cols-2 lg:grid-cols-2 justify-items-center' : ''}`}
			>
				<AnimatePresence>
					{valentines.map((product) => (
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

