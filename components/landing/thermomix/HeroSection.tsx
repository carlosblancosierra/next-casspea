'use client';
import Image from 'next/image';
import ImageGallery from '@/components/product_detail/ImageGallery';
import { Playfair_Display } from 'next/font/google';
import { FaRegClock } from 'react-icons/fa';
import Link from 'next/link';
import ButtonGroup from './ButtonGroup';
import * as C from './contants';

const playfair = Playfair_Display({ subsets: ['latin'] });
const IG_URL_UTM = `${C.INSTAGRAM_URL}?utm_source=website&utm_medium=landing&utm_campaign=tm7_giveaway`;

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 dark:bg-gray-900">
      <div className="absolute inset-0 z-0">
        <Image
          src="/landings/thermomix/hero-1.jpg"
          fill
          priority
          className="object-cover w-full h-full opacity-40 md:opacity-60 rounded-lg"
          alt={C.HERO_IMAGE_ALT}
        />
        <div className="absolute inset-0 bg-black/40 rounded-lg" />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 mx-auto md:gap-8 xl:gap-0 md:pb-8 w-full max-w-7xl px-4 py-4">
        <div className="md:mr-10 md:col-span-6 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h1
            className={`${playfair.className} mb-2 text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]`}
          >
            {C.HERO_TITLE}
          </h1>
          <h2 className="text-2xl mb-2 text-white font-semibold drop-shadow">{C.HERO_SUBTITLE}</h2>

          <div className="my-2 flex items-start gap-3 text-sm text-gray-100">
            {/* <FaRegClock className="mt-1 shrink-0" /> */}
            <p>
              {/* <span className="font-semibold">{C.COUNTDOWN_TITLE}:</span>{' '} */}
              {C.DEADLINE_COPY.replace('{TZ}', C.TIMEZONE)}
            </p>
          </div>

          <p className="hidden md:block md:mb-6 font-light text-sm text-gray-200 lg:mb-8 md:text-base">
            {C.HERO_PARAGRAPH}
          </p>

          <ButtonGroup />
        </div>

        <div className="col-span-1 md:col-span-6 flex flex-col items-center justify-center mt-4">
          <Image
            src="/landings/thermomix/hero-1.jpg"
            width={0}
            height={0}
            sizes="100vw"
            priority
            className="w-full h-auto hidden md:block rounded-lg shadow-lg"
            alt={C.HERO_IMAGE_ALT}
          />
          {/* Mobile Gallery */}
          <div className="block md:hidden w-full max-w-[400px] mx-auto">
            <ImageGallery
              images={[
                '/landings/thermomix/hero-1.jpg',
                '/landings/thermomix/thermomix2.jpg',
                '/landings/thermomix/thermomix3.jpg',
                '/landings/thermomix/thermomix4.jpg',
              ]}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <p className="md:hidden md:mb-6 text-3xl font-bold mt-2 font-playfair lg:mb-8 md:text-lg lg:text-xl text-white drop-shadow">
            {('HERO_MOBILE_TITLE' in C ? (C.HERO_MOBILE_TITLE as string) : C.HERO_TITLE)}
          </p>
          <p className="md:hidden md:mb-6 font-light text-md mt-2 text-gray-200 lg:mb-8 md:text-lg lg:text-xl">
            {('HERO_MOBILE_PARAGRAPH' in C ? (C.HERO_MOBILE_PARAGRAPH as string) : C.HERO_PARAGRAPH)}
          </p>
        </div>
      </div>
    </section>
  );
}