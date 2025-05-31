import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { Playfair_Display } from 'next/font/google';
import ImageGallery from '@/components/product_detail/ImageGallery';
import { FaInstagram } from 'react-icons/fa';

import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  HERO_TITLE,
  HERO_SUBTITLE,
  HERO_PARAGRAPH,
  HERO_IMAGE_ALT,
  INSTAGRAM_URL,
  BUTTON_FOLLOW_TEXT,
  BUTTON_SUBSCRIBE_TEXT,
  SUBSCRIBE_PAGE_PATH,
  HERO_MOBILE_TITLE,
  HERO_MOBILE_PARAGRAPH,
  ENTER_GIVEAWAY_TITLE,
  PRIZE_DETAILS_TITLE,
  PRIZE_DETAILS_PARAGRAPH,
  PRIZE_DETAILS_LIST,
  GIVEAWAY_RULES_TITLE,
  GIVEAWAY_RULES_LIST,
  TERMS_TITLE,
  TERMS_PARAGRAPHS,
  PRIVACY_POLICY_PATH,
} from './contants';
import { EnterForm } from '@/components/landing/EnterForm';

const playfair = Playfair_Display({ subsets: ['latin'] });

// Button group for hero section
const ButtonGroup = () => (
  <div className="hidden md:flex gap-2">
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-8 py-4 mr-3 text-xl font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
    >
      {BUTTON_FOLLOW_TEXT}
      <FaInstagram className="ml-2 -mr-1" size={20} />
    </a>
    <Link
      href={SUBSCRIBE_PAGE_PATH}
      className="inline-flex items-center justify-center px-8 py-4 text-xl font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300"
    >
      {BUTTON_SUBSCRIBE_TEXT}
    </Link>
  </div>
);

// Reusable section component that wraps content in Suspense with a title
const Section = ({
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

// Hero section component (grid splits at md)
const HeroSection = () => (
  <section className="dark:bg-gray-900">
    <div className="grid grid-cols-1 md:grid-cols-12 mx-auto md:gap-8 xl:gap-0 md:pb-8 relative px-4">
      <div className="md:mr-10 md:col-span-6">
        <h1
          className={`${playfair.className} mb-2 text-4xl text-primary-text font-extrabold tracking-tight leading-none md:text-7xl dark:text-white`}
        >
          {HERO_TITLE}
        </h1>
        <h2 className="text-2xl mb-2 dark:text-white text-primary-text">
          {HERO_SUBTITLE}
        </h2>
        <p className="hidden md:block md:mb-6 font-light text-sm text-gray-500 lg:mb-8 md:text-base dark:text-gray-200">
          {HERO_PARAGRAPH}
        </p>
        <ButtonGroup />
      </div>
      <div className="col-span-1 md:col-span-6">
        <Image
          src="/landings/thermomix/hero-1.jpg"
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="w-full h-auto hidden md:block"
          alt={HERO_IMAGE_ALT}
        />
        <ImageGallery
          images={[
            '/landings/thermomix/hero-1.jpg',
            '/landings/thermomix/thermomix2.jpg',
            '/landings/thermomix/thermomix3.jpg',
            '/landings/thermomix/thermomix4.jpg',
          ]}
          className="block md:hidden"
        />
        <p className="md:hidden md:mb-6 text-3xl font-bold mt-2 font-playfair lg:mb-8 md:text-lg lg:text-xl dark:text-gray-200">
          {HERO_MOBILE_TITLE}
        </p>
        <p className="md:hidden md:mb-6 font-light text-md mt-2 text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-200">
          {HERO_MOBILE_PARAGRAPH}
        </p>
      </div>
    </div>
  </section>
);

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
};

// Loading placeholder component
const LoadingSection = () => (
  <div className="w-full h-48 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg" />
);

export default function HomePage() {
  return (
    <main className="dark:bg-gray-900 min-h-[100vh] max-w-screen-2xl md:mx-auto">
      {/* Hero */}
      <HeroSection />

      {/* Enter the Giveaway Form */}
      <Section title={ENTER_GIVEAWAY_TITLE} extraClass="mt-8 px-4 md:px-0">
        <EnterForm />
      </Section>

      {/* Prize Details */}
      <Section title={PRIZE_DETAILS_TITLE} extraClass="mt-10 px-4 md:px-0">
        <p className="text-gray-700 dark:text-gray-300">
          {PRIZE_DETAILS_PARAGRAPH}
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2 text-gray-700 dark:text-gray-300">
          {PRIZE_DETAILS_LIST.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
      </Section>

      {/* Giveaway Rules */}
      <Section title={GIVEAWAY_RULES_TITLE} extraClass="mt-10 px-4 md:px-0">
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          {GIVEAWAY_RULES_LIST.map((rule, idx) => (
            <li key={idx}>{rule}</li>
          ))}
        </ol>
      </Section>

      {/* Terms & Conditions */}
      <Section title={TERMS_TITLE} extraClass="mt-10 mb-10 px-4 md:px-0">
        {TERMS_PARAGRAPHS.map((para, idx) => {
          if (para.includes('Privacy Policy')) {
            const [before, after] = para.split('Privacy Policy');
            return (
              <p key={idx} className="text-gray-700 dark:text-gray-300">
                {before}
                <Link href={PRIVACY_POLICY_PATH} className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                {after}
              </p>
            );
          }
          return (
            <p key={idx} className="text-gray-700 dark:text-gray-300">
              {para}
            </p>
          );
        })}
        <p className="text-gray-700 dark:text-gray-300">
          8. Contact us at{' '}
          <a href="mailto:giveaway@yourbrand.com" className="text-blue-600 hover:underline">
            giveaway@yourbrand.com
          </a>{' '}
          for questions.
        </p>
      </Section>
    </main>
  );
}