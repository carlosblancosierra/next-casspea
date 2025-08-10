// app/landing/WhoWeAre.tsx
'use client';

import ImageGallery from '@/components/product_detail/ImageGallery';
import Link         from 'next/link';

interface WhoWeAreProps { landing: string; }

export default function WhoWeAre({ landing }: WhoWeAreProps) {
  return (
    <section id="story" className="py-12 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      <div>
        <ImageGallery
          images={[
            '/home/easter/1.jpg',
            '/home/easter/2.jpg',
            '/home/easter/3.jpg',
            '/home/easter/4.jpg',
          ]}
          className="aspect-square rounded-lg shadow"
        />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Who We Are</h2>
        <p className="leading-relaxed">
          CassPea is a London-based chocolate brand, handcrafting bonbons with bold flavours, stunning designs, and a touch of joy. Founded by chefs with a passion for creativity, every chocolate is made with care — and made to be shared.
        </p>
        <Link href="/about-us" className="inline-block mt-4 text-pink-500 font-semibold">
          Meet the Makers →
        </Link>
      </div>
    </section>
  );
}