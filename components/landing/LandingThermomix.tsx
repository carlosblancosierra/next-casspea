import { Playfair_Display } from 'next/font/google';
import * as C from '@/components/landing/thermomix/contants';
import HeroSection from '@/components/landing/thermomix/HeroSection';
import Section from '@/components/landing/thermomix/Section';
import Badge from '@/components/landing/thermomix/Badge';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';
import HowToEnterSection from '@/components/landing/thermomix/HowToEnterSection';
import StoryShareSection from '@/components/landing/thermomix/StoryShareSection';
import BenefitsSection from '@/components/landing/thermomix/BenefitsSection';
import PrizeDetailsSection from '@/components/landing/thermomix/PrizeDetailsSection';
import KeyTermsSection from '@/components/landing/thermomix/KeyTermsSection';
import TermsSection from '@/components/landing/thermomix/TermsSection';
import { EnterForm } from '@/components/landing/thermomix/EnterForm';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function LandingThermomix() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Sweepstakes',
    name: C.PAGE_TITLE,
    description: C.PAGE_DESCRIPTION,
    sponsor: { '@type': 'Organization', name: C.BRAND },
    startDate: C.START_DATE_ISO || undefined,
    endDate: C.END_DATE_ISO || undefined,
  };

  return (
    <main className="dark:bg-gray-900 min-h-[100vh] max-w-screen-2xl md:mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HeroSection />
      <Section title={C.ENTER_GIVEAWAY_TITLE} extraClass="mt-8" id="enter-form">
        <EnterForm />
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          By entering, you agree to receive emails from {C.BRAND}. You can unsubscribe at any time.
        </p>
      </Section>
      <Section title="Watch How It Works" extraClass="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-w-16 aspect-h-9 w-full">
            <iframe
              src="https://www.youtube.com/embed/sYyTH4rFuz0"
              title="Thermomix Video 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64 md:h-80 rounded-lg shadow"
            />
          </div>
          <div className="aspect-w-16 aspect-h-9 w-full">
            <iframe
              src="https://www.youtube.com/embed/rxm0Sv0ckUM"
              title="Thermomix Video 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64 md:h-80 rounded-lg shadow"
            />
          </div>
        </div>
      </Section>
      <Section>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Badge text="No purchase necessary" />
          <Badge text={C.DEADLINE_COPY.replace('{TZ}', C.TIMEZONE)} />
          <Badge text="18+ • See Terms & Conditions" />
        </div>
      </Section>
      <div className="flex justify-center mb-6">
        <UnitSoldCounter />
      </div>
      <HowToEnterSection />
      <StoryShareSection />
      <BenefitsSection />
      <PrizeDetailsSection />
      <KeyTermsSection />
      <TermsSection />
    </main>
  );
}
