"use client";
import React from 'react';
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice';
import ProductCard from '../store/ProductCard';
import Spinner from '@/components/common/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/products';

interface CategoryProductsProps {
  categorySlug: string;
}

export default function CategoryProducts({ categorySlug }: CategoryProductsProps) {
  const { data, isLoading } = useGetActiveProductsQuery();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner md />
      </div>
    );
  }
  
  const products: Product[] = data;
  const filteredProducts = products.filter(
    (product) => product?.category?.slug === categorySlug
  );

  const productVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="grid gap-x-2 gap-y-2 mt-2 justify-items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
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
  );
} 