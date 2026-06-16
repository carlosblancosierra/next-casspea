// LandingFathersDay: Father's Day themed landing with quick-buy pre-built box
'use client';

import { Playfair_Display } from 'next/font/google';
import HeroSection from './main/HeroSection';
import FathersDayPreBuild from './main/FathersDayPreBuild';
import MobileBuildCTA from './main/MobileBuildCTA';
import WhyChooseUs from './main/WhyChooseUs';
import FlavourGrid from './main/FlavourGrid';
import Testimonials from './main/Testimonials';
import Instagram from './main/Instagram';
import ReviewCarousel from '@/components/common/ReviewCarousel';
import { LANDING_CONFIG } from './constants';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function LandingFathersDay() {
  const config = LANDING_CONFIG.fathersday;
  return (
    <main className="bg-main-bg dark:bg-main-bg-dark text-primary-text dark:text-primary-text">
      <HeroSection config={config} ctaHref="#build-dads-box" ctaLabel="Build Dad's box" />
      <div className="gradient-fathers-day text-white">
        <p className="max-w-5xl mx-auto px-4 py-3 text-center text-sm md:text-base">
          <span className="font-medium">Father&apos;s Day treat —</span> use code{' '}
          <span className="font-mono font-bold bg-white/20 rounded px-2 py-0.5 select-all">FATHERS26</span>{' '}
          at checkout
        </p>
      </div>
      <FathersDayPreBuild />
      <section className="py-10">
        <h2 className={`text-center text-2xl font-bold mb-4 text-primary-text dark:text-primary-text-light ${playfair.className}`}>
          What dads (and gifters) say
        </h2>
        <ReviewCarousel />
      </section>
      <WhyChooseUs config={config} />
      <FlavourGrid />
      <Testimonials config={config} />
      <Instagram />
      <MobileBuildCTA />
    </main>
  );
}
