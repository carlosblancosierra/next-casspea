// app/landing/SignatureBoxes.tsx
'use client';

import HomeProducts from '@/components/home/HomeProducts';

interface SignatureBoxesProps { config: typeof import('../constants').LANDING_CONFIG.gold; }

export default function SignatureBoxes({ config }: SignatureBoxesProps) {
  return (
    <section className="py-12 bg-gray-100 dark:bg-main-bg-dark">
      <div className="max-w-7xl mx-auto px-1">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">Signature Boxes</h2>
        <p className="text-center text-primary-text dark:text-primary-text mb-8">
          Our signature boxes are the perfect way to share the love. From 9 to 48 bonbons, we have a box for every occasion.
        </p>
        <HomeProducts />
      </div>
    </section>
  );
}