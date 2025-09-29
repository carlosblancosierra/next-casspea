import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { Playfair_Display } from 'next/font/google';
import dynamic from 'next/dynamic';
import ImageGallery from '@/components/product_detail/ImageGallery';
import PersonalisedHome from '@/components/personalized/PersonalisedHome';
import CategoryProducts from '@/components/home/CategoryProducts';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';

// Dynamically import components that can load later
const HomeProducts = dynamic(() => import('@/components/home/HomeProducts'));
const HomeGallery = dynamic(() => import('@/components/home/HomeGallery'));
const FlavourCarousel = dynamic(() => import('@/components/flavours/FlavourCarousel'));
const FlavoursGrid = dynamic(() => import('@/components/landing/main/FlavourGrid'));

// Reusable section component that wraps content in Suspense with a title
export const Section = ({
  title,
  children,
  extraClass = '',
}: {
  title: string;
  children: React.ReactNode;
  extraClass?: string;
}) => (
  <Suspense fallback={<LoadingSection />}>
    <div className={extraClass}>
      {title && (
        <h2 className="text-center text-2xl font-bold mb-3 font-playfair">
          {title}
        </h2>
      )}
      {children}
    </div>
  </Suspense>
);

// Button group for hero section
const ButtonGroup = () => (
  <div className="hidden md:flex gap-2">
    <Link
      href="/shop-now/"
      className="inline-flex items-center justify-center px-8 py-4 mr-3 text-xl font-medium text-primary-button-text rounded-lg bg-primary hover:bg-primary-dark focus:ring-4 focus:ring-primary-light"
    >
      Shop Now
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
    </Link>
  </div>
);

// Hero section component (grid now splits at md instead of lg)
const HeroSection = () => (
  <section className="dark:bg-gray-900">
    <div className="grid grid-cols-1 md:grid-cols-12 mx-auto md:gap-8 xl:gap-0 md:pb-8 relative">
      <div className="md:mr-10 md:col-span-6">
        <div className="hidden md:block mb-6 mt-2">
          <UnitSoldCounter />
        </div>
        <h1
          className={`${playfair.className} mb-2 text-5xl text-primary-text font-extrabold tracking-tight leading-none md:text-8xl dark:text-white`}
        >
          London's Finest Artisan Chocolates
        </h1>
        <h2 className="text-2xl mb-2 dark:text-white text-primary-text">
          Celebrate Every Occasion with Our Signature Gift Boxes
        </h2>
        <p className="hidden md:block md:mb-6 font-light text-sm text-gray-500 lg:mb-8 md:text-base dark:text-gray-200">
          Share the love with CassPea Chocolates—perfect for personal indulgence,
          birthdays, corporate events, and special celebrations. With over 20
          exquisite flavours, each handcrafted to perfection by our skilled
          chocolatiers, every bite is a work of art and a journey through inspired
          flavours.
        </p>
        <ButtonGroup />
      </div>
      <div className="col-span-1 md:col-span-6">
        <Image
          src="/home/hero-1.png"
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="w-full h-auto hidden md:block"
          alt="CassPea Chocolates"
        />
        <ImageGallery
          images={[
            '/home/easter/1.jpg',
            '/home/easter/2.jpg',
            '/home/easter/3.jpg',
            '/home/easter/4.jpg',
          ]}
          className="block md:hidden"
        />
        <div className="md:hidden mb-6">
          <UnitSoldCounter />
        </div>
        <p className="md:hidden md:mb-6 text-3xl font-bold mt-2 font-playfair lg:mb-8 md:text-lg lg:text-xl dark:text-gray-200">
          Share the love with CassPea Chocolates
        </p>
        <p className="md:hidden md:mb-6 font-light text-md mt-2 text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-200">
          Perfect for personal indulgence, birthdays, corporate events, and
          special celebrations. With over 20 exquisite flavours, each handcrafted
          to perfection by our skilled chocolatiers, every bite is a work of art
          and a journey through inspired flavours.
        </p>
      </div>
    </div>
  </section>
);

const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CassPea Hand Crafted Chocolates',
  description: '',
};

// Loading placeholder component
const LoadingSection = () => (
  <div className="w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg" />
);

export default function HomePage() {
  return (
    <main className="dark:bg-gray-900 min-h-[100vh] max-w-screen-2xl md:mx-auto">
      <HeroSection />

      {/* <Section title="September Giveaway" extraClass="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch rounded-xl overflow-hidden border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900">

          <Link href="/landing/thermomix" className="relative min-h-[220px] md:min-h-[320px] block group">
            <Image
              src="/home/home-tm7.jpeg"
              alt="Win the Thermomix® TM7 + CassPea Chocolates"
              width={800}
              height={0}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              priority={false}
              className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/20 md:bg-black/10" />
          </Link>

          <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-yellow-900 dark:text-yellow-50">
              Win the All‑New Thermomix® TM7
            </h3>
            <p className="text-sm md:text-base text-yellow-950/80 dark:text-yellow-100/90">
              Enter our giveaway for a chance to win the Thermomix® TM7 and a CassPea Signature Box. 
              No purchase necessary.
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/landing/thermomix"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-white bg-pink-600 hover:bg-pink-700 transition"
              >
                Enter Giveaway
              </Link>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Terms apply
              </span>
            </div>
          </div>
        </div>
      </Section> */}

      <Section title="Signature Boxes" extraClass="mt-5 md:mt-4">
        <HomeProducts />
      </Section>
 
      <Section title="Chocolate Barks" extraClass="mt-5">
        <CategoryProducts categorySlug="chocolate-barks" />
      </Section>

      <Section title="Hot Chocolate" extraClass="mt-5">
        <CategoryProducts categorySlug="hot-chocolate" />
      </Section>

      <Section title="Our Flavours" extraClass="mt-10">
        <FlavoursGrid/>
      </Section>

      <Section title="Personalised Chocolates" extraClass="mt-10">
        <PersonalisedHome />
      </Section>

      <Section title="Gallery" extraClass="mt-10">
        <HomeGallery />
      </Section>
    </main>
  );
}