'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/store/ProductCard';
import Spinner from '@/components/common/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetCategoryQuery } from '@/redux/features/products/productApiSlice';
import PackBuilder from '@/components/packs/PackBuilder';

export default function CategoryDetailPage() {
  const { category_slug } = useParams() as { category_slug: string };
  if (category_slug === 'packs') {
    return (
      <div className="container mx-auto min-h-[80vh] py-2">
        <PackBuilder />
      </div>
    );
  }
  const { data: category, isLoading: categoryLoading, error: categoryError } = useGetCategoryQuery(category_slug);

  if (categoryLoading || !category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner md />
      </div>
    );
  }

  // If slug is 'all', show all products; otherwise, filter by category slug
  const products = category.products;
  const filteredProducts = category_slug === 'all' 
    ? products 
    : products.filter((product) => product?.category?.slug === category_slug);

  return (
    <div className="container mx-auto min-h-[80vh] py-2">
      <div className="md:text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center font-playfair">
          { category.name }
        </h1>
      </div>

      {category_slug === 'signature-boxes' && (
        <section className="mb-8 text-center">
          <h2 className="font-bold mt-2">
            Ordering delicious hand made chocolates from CassPea is simple and fun!
          </h2>
          <ol className="mt-4 space-y-1 list-decimal list-inside">
            <li className="font-bold text-pink-500 dark:text-pink-500">For Signature Boxes, select your box size</li>
            <li className="font-bold text-green-500 dark:text-green-500">Choose a Surprise Box or Pick and Mix your own from our succulent flavours</li>
            <li className="font-bold text-red-500 dark:text-red-500">Select a shipping date - FREE delivery for orders over £45</li>
            <li className="font-bold text-orange-500 dark:text-orange-400">Pay securely online</li>
            <li className="font-bold text-purple-500 dark:text-purple-500">Receive your chocolates and enjoy!</li>
          </ol>
        </section>
      )}

      {categoryError && <div className="text-red-500 text-center">Error loading products</div>}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-700 dark:text-gray-300">No products found for this category.</div>
      ) : (
        <div className="grid gap-x-2 gap-y-2 mt-2 justify-items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          <AnimatePresence>
            {filteredProducts.map((product: Product) => (
              <motion.div
                key={product.name}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}