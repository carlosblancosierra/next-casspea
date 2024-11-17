import React, { useState } from 'react';
import { selectAllProducts } from '@/redux/features/products/productSlice';
import { useAppSelector } from '@/redux/hooks';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Store() {
  const products = useAppSelector(selectAllProducts);

  const categories = ['All', ...Array.from(new Set(products.map(product => product?.category?.name))).reverse()];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product?.category?.name === selectedCategory);

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
        {categories.map((category) => (
          <motion.button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`${selectedCategory === category
              ? 'text-white bg-blue-700 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
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
            {category}
          </motion.button>
        ))}
      </div>

      <div
        className={`grid gap-x-2 gap-y-2 mt-2 justify-center ${filteredProducts.length < 3
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}
      >
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.name}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout    // This enables layout transition on reflow
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
