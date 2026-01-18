// app/landing/HeroSection.tsx
'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';
import ImageGallery from '@/components/product_detail/ImageGallery';

const playfair = Playfair_Display({ subsets: ['latin'] });

interface HeroSectionProps {
  config: typeof import('../constants').LANDING_CONFIG.gold;
}

// Button group for hero section
const ButtonGroup = ({ config }: { config: typeof import('../constants').LANDING_CONFIG.gold }) => (
  <div className="hidden lg:flex gap-2">
    <a
      href="#enter-form"
      aria-label={config.hero.mainBtnAriaLabel.replace('20%', '15%')}
      className={`
        inline-flex items-center justify-center px-8 py-4 mr-3 text-xl font-medium text-primary-button-text rounded-lg
        transition-colors focus:ring-4 focus:ring-primary-light
        ${config.hero.ctaBgClass}
        ${config.hero.ctaTextClass}
      `}
    >
      Get 15% off
      <svg
        className="w-5 h-5 ml-2 -mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  </div>
);

// Loading placeholder component
const LoadingSection = () => (
  <div className="w-full animate-pulse bg-gray-200 dark:bg-main-bg-dark rounded-lg" />
);

export default function HeroSection({ config }: HeroSectionProps) {
  return (
    <section className="dark:bg-main-bg-dark">
      <div className="grid grid-cols-1 lg:grid-cols-12 mx-auto lg:gap-8 xl:gap-0 lg:pb-8 relative">
        <div className="col-span-1 lg:col-span-6">
          <div className="hidden lg:block aspect-square">
            <Image
              src="/home/2026/01/1.jpg"
              width={0}
              height={0}
              sizes="100vw"
              priority
              className="w-full h-full object-cover rounded-lg"
              alt="CassPea Chocolates"
            />
          </div>
          <div className="lg:hidden">
            <h1 className={`${playfair.className} mb-2 text-4xl md:text-[5rem] text-primary-text font-bold tracking-tight leading-none dark:text-white`}>
              {config.hero.heading}
            </h1>
            <h2 className="text-2xl mb-4 dark:text-white text-primary-text">
              {config.hero.subheading}
            </h2>
          </div>
          <Suspense fallback={<LoadingSection />}>
            <ImageGallery
              images={[
                '/home/2026/01/1.jpg',
                '/home/2026/01/2.jpg',
                '/home/2026/01/3.jpg',
                '/home/2026/01/4.jpg',
                '/home/2026/01/5.jpg',
                '/home/2026/01/6.jpg',
                '/home/2026/01/7.jpg',
                '/home/2026/01/8.jpg',
              ]}
              className="block lg:hidden"
            />
          </Suspense>
          <div className="lg:hidden mb-6">
            <UnitSoldCounter />
          </div>
          <p className="lg:hidden font-light text-md mt-4 text-primary-text dark:text-primary-text-light">
            Share the love with CassPea Chocolates—perfect for personal indulgence,
            birthdays, corporate events, and special celebrations. With over 20
            exquisite flavours, each handcrafted to perfection by our skilled
            chocolatiers, every bite is a work of art and a journey through inspired
            flavours.
          </p>
        </div>
        <div className="lg:col-span-6 lg:pl-8">
          <div className="hidden lg:block mb-6 mt-2">
            <UnitSoldCounter />
          </div>
          <h1
            className={`${playfair.className} mb-2 text-5xl text-primary-text font-bold tracking-tight leading-none lg:text-8xl dark:text-white hidden lg:block`}
          >
            {config.hero.heading}
          </h1>
          <h2 className="text-2xl mb-2 dark:text-white text-primary-text hidden lg:block">
            {config.hero.subheading}
          </h2>
          <p className="hidden lg:block lg:mb-6 font-light text-sm text-primary-text xl:mb-8 lg:text-base dark:text-primary-text-light">
            Share the love with CassPea Chocolates—perfect for personal indulgence,
            birthdays, corporate events, and special celebrations. With over 20
            exquisite flavours, each handcrafted to perfection by our skilled
            chocolatiers, every bite is a work of art and a journey through inspired
            flavours.
          </p>
          <ButtonGroup config={config} />
        </div>
      </div>
    </section>
  );
}