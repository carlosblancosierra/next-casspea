'use client';

import HeroSection     from './main/HeroSection';
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
import LeadCaptureTwentyOff from './main/LeadCaptureTwentyOff';
import Personalised from './main/Personalised';

interface LandingColorBaseProps {
  config: typeof import('./constants').LANDING_CONFIG.gold;
}

export default function LandingColorBase({ config }: LandingColorBaseProps) {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <UnitSoldCounter bg={config.gradient} />
      <HeroSection config={config} />
      <WhoWeAre config={config} />
      <LeadCaptureTwentyOff config={config} />
      <SignatureBoxes config={config} />
      <OtherCategories config={config} />
      <FlavourGrid config={config} />
      <WhyChooseUs config={config} />
      <Personalised config={config} />
      <CustomGifts config={config} />
      <Testimonials config={config} />
      <SocialFollow config={config} />
    </main>
  );
}
