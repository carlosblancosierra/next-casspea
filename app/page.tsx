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
import AdventSection, { ADVENT_SLUG } from '@/components/home/AdventSection';
import { getProduct } from '@/utils/products';
import { HOME_HERO } from '@/config/homeHero';
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

// Initialize font
const playfair = Playfair_Display({ subsets: ['latin'] });

// The advent calendar's third picture, counted the way its product page shows
// them (main image, then gallery), so it can be changed in the admin. Null when
// the product or that picture is missing.
async function getAdventCarouselImage(): Promise<string | null> {
  const advent = await getProduct(ADVENT_SLUG);
  if (!advent) return null;
  const images = [advent.image, ...(advent.gallery_images ?? []).map(image => image.image)];
  return images[2] || null;
}

// Hero section. A server component, so the H1, the preview line and the
// buttons are in the HTML the server sends. The copy comes from
// config/homeHero.ts.
//
// The text is written once for every width: it used to be two copies (one for
// phones, one for desktop), which put two H1s on the page. On phones it comes
// first and the pictures follow; from lg the pictures move to the left.
const HeroSection = async () => {
  const adventImage = await getAdventCarouselImage();
  const hero = HOME_HERO;

  return (
  <section className="dark:bg-main-bg-dark">
    <div className="grid grid-cols-1 lg:grid-cols-12 mx-auto lg:gap-8 xl:gap-0 lg:pb-8 relative">
      <div className="lg:col-span-6 lg:order-2 lg:pl-8 lg:self-center min-w-0">
        <h1
          className={`${playfair.className} mb-2 md:mb-3 text-[2rem] md:text-6xl xl:text-8xl text-primary-text font-bold tracking-tight leading-none dark:text-white break-words`}
        >
          {hero.heading}
        </h1>
        <p className="mb-3 lg:mb-6 text-base md:text-lg lg:text-xl xl:text-2xl text-primary-text dark:text-primary-text-light">
          {hero.preview}
        </p>
        <ShopNowCTA
          label={hero.primaryCta.label}
          href={hero.primaryCta.href}
          secondary={hero.secondaryCta}
          className="mb-4"
        />
      </div>
      <div className="lg:col-span-6 lg:order-1">
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
        <ImageGallery
          images={[
            // The Advent calendar leads the gallery during the campaign.
            adventImage || '/home/2026/01/2.jpg',
            '/home/2026/01/1.jpg',
            '/home/2026/01/3.jpg',
            '/home/2026/01/4.jpg',
            '/home/2026/01/5.jpg',
            '/home/2026/01/6.jpg',
            '/home/2026/01/7.jpg',
            '/home/2026/01/8.jpg',
          ]}
          className="block lg:hidden"
        />
      </div>
    </div>
  </section>
  );
};

// The hero's everyday copy, kept under it while a campaign has the hero.
const BelowHeroSection = () => {
  const section = HOME_HERO.belowHero;
  if (!section) return null;

  return (
    <section className="mt-8 px-2 text-center max-w-3xl mx-auto">
      <h2 className={`${playfair.className} text-2xl md:text-3xl font-bold mb-3 text-primary-text dark:text-primary-text-light`}>
        {section.heading}
      </h2>
      <p className="font-light text-md lg:text-base text-primary-text dark:text-primary-text-light">
        {section.body}
      </p>
    </section>
  );
};

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

      <BelowHeroSection />

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

      {/* Above the boxes: it is seasonal and time-limited, and the boxes are
          here all year. */}
      <section className="mt-8 px-2">
        <AdventSection />
      </section>

      <HomeSignatureGate>
        <Section title="Signature Boxes" extraClass="mt-5 md:mt-4">
          <HomeProductsServer leadSlugs={HOME_HERO.leadProductSlugs} />
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