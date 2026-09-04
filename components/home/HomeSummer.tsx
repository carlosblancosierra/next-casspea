'use client';

// Home-page Summer Break sale sections. Two pieces:
//  - <HomeSummerBanner/>  a prominent 25%-off banner near the top
//  - <HomeSummerBoxes/>   a grid of the Summer Break boxes above Signature Boxes
//
// While AUTH_ONLY is true they only render for signed-in users, so the sale can
// be previewed privately. Flip AUTH_ONLY to false to show it to everyone — no
// backend change needed.

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display } from 'next/font/google';
import ProductCard from '@/components/store/ProductCard';
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice';
import { Product } from '@/types/products';
import { SUMMER_BREAK_ENABLED } from '@/utils/storeStatus';

const playfair = Playfair_Display({ subsets: ['latin'] });

const AUTH_ONLY = false;

function useSummerVisible() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // Campaign disabled → hide every home/shop Summer Break surface (banner, boxes
  // grid, and the shop "Summer Break Boxes" card/link).
  if (!SUMMER_BREAK_ENABLED) return false;
  return !AUTH_ONLY || isAuthenticated;
}

// The in-stock Summer Break boxes to show, or [] when the sale isn't visible.
function useSummerBoxes(): Product[] {
  const visible = useSummerVisible();
  const { data: products } = useGetActiveProductsQuery();
  if (!visible) return [];
  return (products ?? []).filter(
    p => p.category?.slug === 'summer-break-boxes' && p.active !== false && !p.sold_out
  );
}

// Hides its children (the Signature Boxes section) while the Summer Break boxes
// are actually being shown, so the home page doesn't show both at once.
export function HomeSignatureGate({ children }: { children: React.ReactNode }) {
  const boxes = useSummerBoxes();
  if (boxes.length > 0) return null;
  return <>{children}</>;
}

// A category-style card for the shop grid that links to the Summer Break landing.
export function SummerCategoryCard() {
  const boxes = useSummerBoxes();
  if (boxes.length === 0) return null;
  return (
    <Link
      href="/landing/summer-break"
      className="block group relative shadow-lg rounded-lg p-0 border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-main-bg-dark hover:opacity-90 transition-opacity overflow-hidden"
    >
      <div className="w-full min-h-[110px] aspect-w-16 aspect-h-9 bg-gradient-to-r from-amber-400 to-pink-500 flex items-center justify-center">
        <span className="text-white font-bold text-lg px-3 text-center">25% OFF</span>
      </div>
      <div className="p-2">
        <h3 className="text-lg font-bold text-primary-text dark:text-primary-text-light">Summer Break Boxes</h3>
        <p className="mt-2 text-sm text-primary-text dark:text-primary-text-light">Handmade boxes, 25% off — surprise flavours.</p>
      </div>
    </Link>
  );
}

export function HomeSummerBanner() {
  const visible = useSummerVisible();
  if (!visible) return null;

  return (
    <Link
      href="/landing/summer-break"
      className="block rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-md px-4 py-4 md:px-8 md:py-6 mb-4"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div>
          <p className={`${playfair.className} text-2xl md:text-3xl font-bold leading-tight`}>Summer Break Sale</p>
        </div>
        <span className="inline-flex items-center gap-2 shrink-0 rounded-full bg-white text-pink-600 font-bold px-5 py-2 shadow">
          Shop 25% Off
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function HomeSummerBoxes() {
  const boxes = useSummerBoxes();
  if (boxes.length === 0) return null;

  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <section className="mt-5 md:mt-4 dark:bg-main-bg-dark">
      <h2 className={`text-center text-2xl font-bold mb-1 text-primary-text dark:text-primary-text-light ${playfair.className}`}>
        Summer Break Boxes
      </h2>
      <p className="text-center text-sm text-pink-600 dark:text-pink-400 font-semibold mb-3">
        25% off — this week only
      </p>
      <div className={`grid gap-x-2 gap-y-2 mt-2 justify-center ${
        boxes.length < 3
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      }`}>
        <AnimatePresence>
          {boxes.map(product => (
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
