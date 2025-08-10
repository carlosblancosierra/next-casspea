// app/landing/CustomGifts.tsx
'use client';

import Image from 'next/image';
import Link  from 'next/link';

interface CustomGiftsProps {
  landing: string;
}

export default function CustomGifts({ landing }: CustomGiftsProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <Image
          src="/landings/intro/packs.jpg"
          alt="Custom Gifts"
          width={800}
          height={600}
          className="w-full h-auto rounded-lg shadow"
        />
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Make It Personal</h2>
          <p className="mb-6">
            Perfect for weddings, birthdays, corporate gifting and events. Choose your colours, flavours, and packaging.
          </p>
          <Link href={`/custom/${landing}`} className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg">
            Request a Custom Order
          </Link>
        </div>
      </div>
    </section>
  );
}