'use client';

import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import { Product } from '@/types/products';

// Client island: keeps the entrance animation for the category product grid.
// Data is fetched on the server and passed in as a prop.
export default function CategoryProductsGrid({ products }: { products: Product[] }) {
    return (
        <div className="grid gap-x-2 gap-y-2 mt-2 justify-items-center grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            <AnimatePresence>
                {products.map((product: Product) => (
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
    );
}
