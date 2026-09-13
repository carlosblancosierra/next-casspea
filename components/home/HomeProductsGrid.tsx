'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import { Product } from '@/types/products';
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice';

const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
};

export default function HomeProductsGrid({
    products,
    categorySlug,
}: {
    products: Product[];
    categorySlug?: string;
}) {
    // SSR paints these instantly; the client refreshes so price/availability
    // changes show without waiting for a rebuild. Falls back to the SSR list.
    const { data } = useGetActiveProductsQuery();
    const list = data
        ? categorySlug
            ? data.filter((p) => p.category?.slug === categorySlug)
            : data
        : products;

    return (
        <section className="dark:bg-main-bg-dark">
            <div className={`grid gap-x-2 gap-y-2 mt-2 justify-center ${
                list.length < 3
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
                <AnimatePresence>
                    {list.map((product) => (
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
