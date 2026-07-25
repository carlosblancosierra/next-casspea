// LandingSummerBreak: summer-break themed landing with quick-buy clearance boxes.
'use client';

import { Playfair_Display } from 'next/font/google';
import ReviewCarousel from '@/components/common/ReviewCarousel';
import FlavourGrid from './main/FlavourGrid';
import SummerBreakPreBuild from './main/SummerBreakPreBuild';
import { useStoreStatus } from '@/hooks/useStoreStatus';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function LandingSummerBreak() {
  const { isClosed, reopenLabel } = useStoreStatus();

  return (
    <main className="bg-main-bg dark:bg-main-bg-dark text-primary-text dark:text-primary-text">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-amber-400 to-pink-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-20 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase bg-white/20 rounded-full px-3 py-1 mb-4">
            Summer Break Sale
          </span>
          <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold mb-4`}>
            {isClosed ? "We're on Summer Break" : '25% Off Handmade Chocolate Boxes'}
          </h1>
          {isClosed ? (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Our shop is closed for orders while we take a summer break. We&apos;ll be back on{' '}
              <b>{reopenLabel}</b> — see you then!
            </p>
          ) : (
            <>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                We&apos;re closing the kitchen for the summer break from <b>31 July</b>. Clearing the
                shelves with our handmade boxes at <b>25% off</b> — surprise flavours, your choice of size.
              </p>
              <p className="mt-4 font-semibold">
                Order by <span className="underline">Friday 31 July, 12pm</span>.
              </p>
              <a
                href="#build-summer-box"
                className="mt-8 inline-block rounded-full bg-white text-pink-600 font-bold px-8 py-3 shadow hover:bg-white/90 transition-colors"
              >
                Shop 25% Off Boxes
              </a>
            </>
          )}
        </div>
      </section>

      <SummerBreakPreBuild />

      <section className="py-10">
        <h2 className={`text-center text-2xl font-bold mb-4 text-primary-text dark:text-primary-text-light ${playfair.className}`}>
          What our customers say
        </h2>
        <ReviewCarousel />
      </section>

      <section className="py-6">
        <h2 className={`text-center text-2xl font-bold mb-4 text-primary-text dark:text-primary-text-light ${playfair.className}`}>
          Our Flavours
        </h2>
        <FlavourGrid />
      </section>
    </main>
  );
}
