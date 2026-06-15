// LandingFathersDay: Father's Day themed landing with quick-buy pre-built box
'use client';

import HeroSection from './main/HeroSection';
import FathersDayPreBuild from './main/FathersDayPreBuild';
import LeadCaptureTwentyOff from './main/LeadCaptureTwentyOff';
import WhyChooseUs from './main/WhyChooseUs';
import FlavourGrid from './main/FlavourGrid';
import Personalised from './main/Personalised';
import Testimonials from './main/Testimonials';
import Instagram from './main/Instagram';
import { LANDING_CONFIG } from './constants';

export default function LandingFathersDay() {
  const config = LANDING_CONFIG.fathersday;
  return (
    <main className="bg-main-bg dark:bg-main-bg-dark text-primary-text dark:text-primary-text">
      <HeroSection config={config} />
      <FathersDayPreBuild />
      <LeadCaptureTwentyOff config={config} />
      <WhyChooseUs config={config} />
      <FlavourGrid />
      <Personalised config={config} />
      <Testimonials config={config} />
      <Instagram />
    </main>
  );
}
