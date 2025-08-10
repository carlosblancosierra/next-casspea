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
import LeadCaptureTwentyOff from './main/LeadCaptureTwentyOff';
import Personalised from './main/Personalised';

interface LandingColorBaseProps {
  landing: string;
  unitSoldBgs: string;
}

export default function LandingColorBase({ landing, unitSoldBgs }: LandingColorBaseProps) {
  // Select hero constants based on landing type
  const heroConstants = landing === LANDING_TYPES.BLUE ? HERO_SECTION_DEFAULTS_BLUE : HERO_SECTION_DEFAULTS_GOLD;
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <UnitSoldCounter bg={unitSoldBgs} />
      <HeroSection constants={heroConstants} />
      <WhoWeAre landing={landing} />
      <LeadCaptureTwentyOff theme={landing === LANDING_TYPES.BLUE ? 'blue' : 'gold'} bgClass={heroConstants.leadCaptureBgClass} />
      <SignatureBoxes landing={landing} />
      <OtherCategories landing={landing} />
      <FlavourGrid landing={landing} />
      <WhyChooseUs landing={landing} />
      <Personalised theme={landing === LANDING_TYPES.BLUE ? 'blue' : 'gold'} />
      <CustomGifts landing={landing} />
      <Testimonials landing={landing} />
      <SocialFollow landing={landing} bgClass={heroConstants.socialBgClass} />
      <Footer landing={landing} />
    </main>
  );
}
