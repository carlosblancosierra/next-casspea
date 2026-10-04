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
import AdventSection from '@/components/home/AdventSection';
import FlavourGridServer from '@/components/landing/main/FlavourGridServer';
import { HomeSummerBanner, HomeSummerBoxes, HomeSignatureGate } from '@/components/home/HomeSummer';
import PackOffer from '@/components/home/PackOffer';
import CorporateGifting from '@/components/home/CorporateGifting';
import TrustStrip from '@/components/marketing/TrustStrip';
import HowItWorks from '@/components/marketing/HowItWorks';
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
        <h2 className={`text-center text-2xl md:text-3xl font-bold mb-3 text-primary-text dark:text-primary-text-light ${playfair.className}`}>
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

// Initialize font
const playfair = Playfair_Display({ subsets: ['latin'] });

// Where the hero's button goes: the box sizes further down this page. A
// visitor who wants a box should be one scroll from choosing one, not sent to
// a page of categories first.
const HERO_CTA = { label: 'Choose your box', href: '#boxes' };

// The box photo leads: it shows the bonbons *and* the packaging, which is
// what someone buying a gift is actually buying.
const HERO_IMAGES = [
  '/home/2026/01/4.jpg',
  '/home/2026/01/1.jpg',
  '/home/2026/01/2.jpg',
  '/home/2026/01/3.jpg',
  '/home/2026/01/5.jpg',
  '/home/2026/01/6.jpg',
  '/home/2026/01/7.jpg',
  '/home/2026/01/8.jpg',
];

// One h1 holding both lines: the outcome is what is read, and the keyword
// line stays in the heading for search.
const HeroHeading = ({ className = '' }: { className?: string }) => (
  <h1 className={`${playfair.className} text-primary-text dark:text-white ${className}`}>
    <span className="block font-sans text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-primary dark:text-accent mb-3">
      Luxury chocolate gifts, handcrafted in London
    </span>
    <span className="block text-4xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]">
      The gift they&apos;ll photograph before they eat it.
    </span>
  </h1>
);

const HeroSubhead = ({ className = '' }: { className?: string }) => (
  <p className={`text-base md:text-lg text-primary-text/80 dark:text-primary-text-light/80 ${className}`}>
    Hand-painted bonbons in over 20 flavours, in a box worth keeping. We fill it with our
    bestsellers. All you choose is the size.
  </p>
);

const HeroSection = () => (
  <section className="dark:bg-main-bg-dark">
    {/* Phones: promise, button, then the pictures. */}
    <div className="lg:hidden px-2">
      <HeroHeading className="mb-3" />
      <HeroSubhead className="mb-4" />
      <ShopNowCTA label={HERO_CTA.label} href={HERO_CTA.href} />
      <UnitSoldCounter variant="inline" className="mt-2 mb-4" />
      <ImageGallery images={HERO_IMAGES} className="block" />
    </div>

    {/* Desktop: the box beside the promise. */}
    <div className="hidden lg:grid grid-cols-12 gap-10 items-center pb-8">
      <div className="col-span-6 aspect-square relative">
        <Image
          src={HERO_IMAGES[0]}
          fill
          sizes="50vw"
          priority
          className="object-cover rounded-2xl"
          alt="An open CassPea box of hand-painted bonbons"
        />
      </div>
      <div className="col-span-6 pr-4">
        <HeroHeading className="mb-6" />
        <HeroSubhead className="mb-8 max-w-xl" />
        <ShopNowCTA label={HERO_CTA.label} href={HERO_CTA.href} />
        <UnitSoldCounter variant="inline" className="mt-3" />
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

      <section className="mt-8 border-y border-black/10 dark:border-white/10 py-5 px-2">
        <TrustStrip />
      </section>

      {/* The hero button lands here. The anchor sits outside the summer gate
          so it has a target whichever set of boxes is showing. */}
      <section id="boxes" className="scroll-mt-24 mt-10">
        <HomeSummerBoxes />
        <HomeSignatureGate>
          <Section title="Choose your box">
            <p className="text-center text-sm text-primary-text/70 dark:text-primary-text-light/70 -mt-1 mb-3">
              Every box arrives filled with our bestsellers. Swap any flavour you like.
            </p>
            <HomeProductsServer />
          </Section>
        </HomeSignatureGate>
      </section>

      <section className="mt-12 px-2">
        <Suspense fallback={<LoadingSection />}>
          <PackOffer />
        </Suspense>
      </section>

      {/* The hero's Trustpilot rating scrolls here, so there is exactly one
          reviews section on the page. */}
      <section id="reviews" className="scroll-mt-24 mt-12">
        <Section title="What our customers say">
          <ReviewCarousel />
        </Section>
      </section>

      {/* Seasonal and time-limited, so still high — just after the core offer
          rather than in front of it. */}
      <section className="mt-12 px-2">
        <AdventSection />
      </section>

      <section className="mt-12 px-2">
        <h2 className={`text-center text-2xl md:text-3xl font-bold mb-5 text-primary-text dark:text-primary-text-light ${playfair.className}`}>
          How it works
        </h2>
        <HowItWorks />
      </section>

      <section id="flavours" className="scroll-mt-24">
        <Section title="Our Flavours" extraClass="mt-12">
          <FlavourGridServer />
        </Section>
      </section>

      <Section title="Personalised Chocolates" extraClass="mt-12">
        <PersonalisedHome />
      </Section>

      <section className="mt-10 px-2">
        <CorporateGifting />
      </section>

      <Section title="Chocolate Barks" extraClass="mt-12">
        <CategoryProducts categorySlug="chocolate-barks" />
      </Section>

      <Section title="Hot Chocolate" extraClass="mt-8">
        <CategoryProducts categorySlug="hot-chocolate" />
      </Section>

      <Section title="Gallery" extraClass="mt-12">
        <HomeGallery />
      </Section>
    </main>
  );
}
