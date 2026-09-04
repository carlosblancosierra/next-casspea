import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LandingSummerBreak from '@/components/landing/LandingSummerBreak';
import { SUMMER_BREAK_ENABLED } from '@/utils/storeStatus';

export const metadata: Metadata = {
  title: 'Summer Break Sale | 25% Off Handmade Chocolate Boxes | CassPea',
  description:
    "We're clearing the kitchen before our summer break — handmade chocolate boxes at 25% off. Pick a size and your allergens, we'll surprise you with the flavours. Order by Friday 31 July, 12pm.",
};

export default function SummerBreakLandingPage() {
  // Campaign over — the page is retired but the code is kept. Flip
  // SUMMER_BREAK_ENABLED in utils/storeStatus back on to bring it back.
  if (!SUMMER_BREAK_ENABLED) redirect('/');
  return <LandingSummerBreak />;
}
