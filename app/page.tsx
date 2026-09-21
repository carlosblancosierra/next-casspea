import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { Playfair_Display } from 'next/font/google';
import ImageGallery from '@/components/product_detail/ImageGallery';
import PersonalisedHome from '@/components/personalized/PersonalisedHome';
import CategoryProducts from '@/components/home/CategoryProducts';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';
import ShopNowCTA from '@/components/common/ShopNowCTA';
import ReviewCarousel from '@/components/common/ReviewCarousel';
import HomeProductsServer from '@/components/home/HomeProductsServer';
import FlavourGridServer from '@/components/landing/main/FlavourGridServer';
import { HomeSummerBanner, HomeSummerBoxes, HomeSignatureGate } from '@/components/home/HomeSummer';
import dynamic from 'next/dynamic';
import React from 'react';

const HomeGallery = dynamic(() => import('@/components/home/HomeGallery'));


// Reusable section component that wraps content in Suspense with a title
const Section = ({
  title,
  children,
  extraClass = '',
  cardColor = false,
}: {
  title: string;
  children: React.ReactNode;
  extraClass?: string;
  cardColor?: boolean;
}) => (
  <Suspense fallback={<LoadingSection />}>
    <div className={extraClass}>
      {title && (
        <h2 className={`text-center text-2xl font-bold mb-3 text-primary-text dark:text-primary-text-light ${playfair.className}`}>
          {title}
        </h2>
      )}
      {cardColor
        ? React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
              cardClassName: 'bg-[#D41F3A]',
            })
            : child
        )
        : children}
    </div>
  </Suspense>
);

// Button group for hero section
const ButtonGroup = () => (
  <div className="hidden lg:flex">
    <ShopNowCTA />
  </div>
);

// Initialize font
const playfair = Playfair_Display({ subsets: ['latin'] });

// Hero section component (grid now splits at md instead of lg)
const HeroSection = () => (
  <section className="dark:bg-main-bg-dark">
    <div className="grid grid-cols-1 lg:grid-cols-12 mx-auto lg:gap-8 xl:gap-0 lg:pb-8 relative">
      <div className="col-span-1 lg:col-span-6">
        {/* <div className="hidden md:grid md:grid-cols-2 md:gap-4">
          <div className="aspect-square">
            <Image
              src="/home/2026/01/1.jpg"
              width={0}
              height={0}
              sizes="50vw"
              priority
              className="w-full h-full object-cover rounded-lg"
              alt="CassPea Chocolates 1"
            />
          </div>
          <div className="aspect-square">
            <Image
              src="/home/2026/01/5.jpg"
              width={0}
              height={0}
              sizes="50vw"
              priority
              className="w-full h-full object-cover rounded-lg"
              alt="CassPea Chocolates 2"
            />
          </div>
          <div className="aspect-square">
            <Image
              src="/home/2026/01/4.jpg"
              width={0}
              height={0}
              sizes="50vw"
              priority
              className="w-full h-full object-cover rounded-lg"
              alt="CassPea Chocolates 3"
            />
          </div>
          <div className="aspect-square">
            <Image
              src="/home/2026/01/2.jpg"
              width={0}
              height={0}
              sizes="50vw"
              priority
              className="w-full h-full object-cover rounded-lg"
              alt="CassPea Chocolates 4"
            />
          </div>
        </div> */}
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
            Luxury Chocolate Gifts, Handcrafted in London
          </h1>
          <h2 className="text-2xl mb-4 dark:text-white text-primary-text">
            Celebrate Every Occasion with Our Signature Gift Boxes
          </h2>
          <ShopNowCTA className="mb-4" />
        </div>
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
        <p className="lg:hidden font-light text-md mt-4 text-primary-text dark:text-primary-text-light">
          Share the love with CassPea Chocolates—perfect for personal indulgence,
          birthdays, corporate events, and special celebrations. With over 20
          exquisite flavours, each handcrafted to perfection by our skilled
          chocolatiers, every bite is a work of art and a journey through inspired
          flavours.
        </p>
      </div>
      <div className="lg:col-span-6 lg:pl-8">
        <h1
          className={`${playfair.className} mb-2 text-5xl text-primary-text font-bold tracking-tight leading-none lg:text-8xl dark:text-white hidden lg:block`}
        >
          Luxury Chocolate Gifts, Handcrafted in London
        </h1>
        <h2 className="text-2xl mb-2 dark:text-white text-primary-text hidden lg:block">
          Celebrate Every Occasion with Our Signature Gift Boxes
        </h2>
        <p className="hidden lg:block lg:mb-6 font-light text-sm text-primary-text xl:mb-8 lg:text-base dark:text-primary-text-light">
          Share the love with CassPea Chocolates—perfect for personal indulgence,
          birthdays, corporate events, and special celebrations. With over 20
          exquisite flavours, each handcrafted to perfection by our skilled
          chocolatiers, every bite is a work of art and a journey through inspired
          flavours.
        </p>
        <ButtonGroup />
      </div>
    </div>
  </section>
);

export const metadata: Metadata = {
  title: 'CassPea Hand Crafted Chocolates | Luxury Chocolate Gifts, London',
  description:
    'Luxury chocolate gifts handcrafted in London. Choose from over 20 exquisite flavours in our signature gift boxes — perfect for birthdays, corporate events and special celebrations.',
};

// Loading placeholder component
const LoadingSection = () => (
  <div className="w-full animate-pulse bg-gray-200 dark:bg-main-bg-dark rounded-lg" />
);

export default function HomePage() {
  return (
    <main className="dark:bg-main-bg-dark min-h-[100vh] max-w-screen-2xl md:mx-auto">
      <HomeSummerBanner />

      <HeroSection />

      {/* One reviews section at every width, because the hero's Trustpilot
          rating scrolls here and an anchor needs a single visible target. It
          used to be two carousels — one inside the hero for phones, one
          full-width for desktop — which also meant the rating and the "See
          all" link were rendered twice. */}
      <section id="reviews" className="scroll-mt-24 mt-8">
        <Section title="Our Clients Say">
          <ReviewCarousel />
        </Section>
      </section>

      <HomeSummerBoxes />

      <HomeSignatureGate>
        <Section title="Signature Boxes" extraClass="mt-5 md:mt-4">
          <HomeProductsServer />
        </Section>
      </HomeSignatureGate>

      <Section title="Our Flavours" extraClass="mt-10">
        <FlavourGridServer />
      </Section>

      <Section title="Personalised Chocolates" extraClass="mt-10">
        <PersonalisedHome />
      </Section>

      <Section title="Gallery" extraClass="mt-10">
        <HomeGallery />
      </Section>

      <Section title="Chocolate Barks" extraClass="mt-5">
        <CategoryProducts categorySlug="chocolate-barks" />
      </Section>

      <Section title="Hot Chocolate" extraClass="mt-5">
        <CategoryProducts categorySlug="hot-chocolate" />
      </Section>
    </main>
  );
}