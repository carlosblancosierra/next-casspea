'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import { Product } from '@/types/products';

const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
};

export default function HomeProductsGrid({ products }: { products: Product[] }) {
    return (
        <section className="dark:bg-main-bg-dark">
            <div className={`grid gap-x-2 gap-y-2 mt-2 justify-center ${
                products.length < 3
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
                <AnimatePresence>
                    {products.map((product) => (
                        <motion.div
                            key={product.name}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            layout
                            variants={variants}
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
