// app/landing/CustomGifts.tsx
'use client';

import Image from 'next/image';
import Link  from 'next/link';
import { HERO_SECTION_DEFAULTS_GOLD, HERO_SECTION_DEFAULTS_BLUE, LANDING_TYPES } from '../constants';

interface CustomGiftsProps {
  config: typeof import('../constants').LANDING_CONFIG.gold;
}

export default function CustomGifts({ config }: CustomGiftsProps) {
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
          <p className="mb-6 text-primary-text dark:text-primary-text-light">
            Perfect for weddings, birthdays, corporate gifting and events. Choose your colours, flavours, and packaging.
          </p>
          <Link
            href={`/help`}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors ${config.hero.ctaBgClass}`}
          >
            Request a Custom Order
          </Link>
        </div>
      </div>
    </section>
  );
}