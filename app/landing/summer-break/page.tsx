import type { Metadata } from 'next';
import LandingSummerBreak from '@/components/landing/LandingSummerBreak';

export const metadata: Metadata = {
  title: 'Summer Break Sale | 25% Off Handmade Chocolate Boxes | CassPea',
  description:
    "We're clearing the kitchen before our summer break — handmade chocolate boxes at 25% off. Pick a size and your allergens, we'll surprise you with the flavours. Order by Friday 31 July, 12pm.",
};

export default function SummerBreakLandingPage() {
  return <LandingSummerBreak />;
}
