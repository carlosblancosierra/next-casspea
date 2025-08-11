import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import * as C from '@/components/landing/thermomix/contants';
import HeroSection from '@/components/landing/thermomix/HeroSection';
import Section from '@/components/landing/thermomix/Section';
import LoadingSection from '@/components/landing/thermomix/LoadingSection';
import Badge from '@/components/landing/thermomix/Badge';
import SocialProofSection from '@/components/landing/thermomix/SocialProofSection';
import HowToEnterSection from '@/components/landing/thermomix/HowToEnterSection';
import StoryShareSection from '@/components/landing/thermomix/StoryShareSection';
import BenefitsSection from '@/components/landing/thermomix/BenefitsSection';
import PrizeDetailsSection from '@/components/landing/thermomix/PrizeDetailsSection';
import KeyTermsSection from '@/components/landing/thermomix/KeyTermsSection';
import TermsSection from '@/components/landing/thermomix/TermsSection';
import SiteFooter from '@/components/landing/thermomix/SiteFooter';
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
      <Section>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <Badge text="No purchase necessary" />
          <Badge text={C.DEADLINE_COPY.replace('{TZ}', C.TIMEZONE)} />
          <Badge text="18+ • See Terms & Conditions" />
        </div>
      </Section>
      <Section title={C.ENTER_GIVEAWAY_TITLE} extraClass="mt-8">
        <EnterForm />
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          By entering, you agree to receive emails from {C.BRAND}. You can unsubscribe at any time.
        </p>
      </Section>
      <HowToEnterSection />
      <StoryShareSection />
      <BenefitsSection />
      <SocialProofSection />
      <PrizeDetailsSection />
      <KeyTermsSection />
      <TermsSection />
      <SiteFooter />
    </main>
  );
}
