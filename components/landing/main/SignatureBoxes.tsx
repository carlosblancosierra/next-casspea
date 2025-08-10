// app/landing/SignatureBoxes.tsx
'use client';

import ProductCard from '@/components/store/ProductCard';

const BOX_PRODUCTS = [
  { id: 1, name: 'Box of 9 Bonbons',  slug: 'box-of-9',  image: '/landings/intro/boxes/9.jpeg',  base_price: '15.00', weight: 135, gallery_images: [] },
  { id: 2, name: 'Box of 15 Bonbons', slug: 'box-of-15', image: '/landings/intro/boxes/15.jpeg', base_price: '22.00', weight: 225, gallery_images: [] },
  { id: 3, name: 'Box of 24 Bonbons', slug: 'box-of-24', image: '/landings/intro/boxes/24.jpeg', base_price: '35.00', weight: 360, gallery_images: [] },
  { id: 4, name: 'Box of 48 Bonbons', slug: 'box-of-48', image: '/landings/intro/boxes/48.jpeg', base_price: '65.00', weight: 720, gallery_images: [] },
];

interface SignatureBoxesProps { landing: string; }

export default function SignatureBoxes({ landing }: SignatureBoxesProps) {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-1">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4">Signature Boxes</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Our signature boxes are the perfect way to share the love. From 9 to 48 bonbons, we have a box for every occasion.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {BOX_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}