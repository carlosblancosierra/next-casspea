'use client';

import HeroSection     from './main/HeroSection';
import { HERO_SECTION_DEFAULTS_GOLD, HERO_SECTION_DEFAULTS_BLUE, LANDING_TYPES } from './constants';
import WhoWeAre        from './main/WhoWeAre';
import SignatureBoxes  from './main/SignatureBoxes';
import OtherCategories from './main/OtherCategories';
import FlavourGrid     from './main/FlavourGrid';
import WhyChooseUs     from './main/WhyChooseUs';
import CustomGifts     from './main/CustomGifts';
import Testimonials    from './main/Testimonials';
import SocialFollow    from './main/SocialFollow';
import Footer          from './main/Footer';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';
import NewsletterSubscribe from '@/components/newsletter/NewsletterSubscribe';

interface LandingColorBaseProps {
  landing: string;
  unitSoldBgs: string;
}

export default function LandingColorBase({ landing, unitSoldBgs }: LandingColorBaseProps) {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <UnitSoldCounter bg={unitSoldBgs} />
      <HeroSection constants={HERO_SECTION_DEFAULTS_GOLD} />
      <WhoWeAre landing={landing} />
      <SignatureBoxes landing={landing} />
      <OtherCategories landing={landing} />
      <FlavourGrid landing={landing} />
      <WhyChooseUs landing={landing} />
      <CustomGifts landing={landing} />
      <Testimonials landing={landing} />
      <NewsletterSubscribe />
      <SocialFollow landing={landing} />
      <Footer landing={landing} />
    </main>
  );
}
