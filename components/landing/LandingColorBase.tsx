'use client';

import HeroSection from './main/HeroSection';
import WhoWeAre from './main/WhoWeAre';
import SignatureBoxes from './main/SignatureBoxes';
import OtherCategories from './main/OtherCategories';
import FlavourGrid from './main/FlavourGrid';
import WhyChooseUs from './main/WhyChooseUs';
import CustomGifts from './main/CustomGifts';
import Testimonials from './main/Testimonials';
import SocialFollow from './main/SocialFollow';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';
import LeadCaptureTwentyOff from './main/LeadCaptureTwentyOff';
import Personalised from './main/Personalised';
import Instagram from './main/Instagram';

interface LandingColorBaseProps {
  config: typeof import('./constants').LANDING_CONFIG.gold;
}

export default function LandingColorBase({ config }: LandingColorBaseProps) {
  return (
    <main className="bg-white dark:bg-main-bg-dark text-primary-text dark:text-primary-text">
      <UnitSoldCounter bg={config.gradient} />
      <HeroSection config={config} />
      <WhoWeAre config={config} />
      <LeadCaptureTwentyOff config={config} />
      <SignatureBoxes config={config} />
      <OtherCategories config={config} />
      <FlavourGrid />
      <WhyChooseUs config={config} />
      <Personalised config={config} />
      <CustomGifts config={config} />
      <Testimonials config={config} />
      <Instagram />
    </main>
  );
}
