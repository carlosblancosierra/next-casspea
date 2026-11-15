import type { Metadata } from 'next';
import LandingFathersDay from '@/components/landing/LandingFathersDay';

export const metadata: Metadata = {
  title: "Father's Day Chocolates | Build Dad's Box | CassPea",
  description:
    "Gift Dad handmade chocolates this Father's Day. Quick-buy a curated, dad-worthy flavour box in any size — indulgence pack or signature box — handcrafted in London.",
};

export default function FathersDayLandingPage() {
  return <LandingFathersDay />;
}
