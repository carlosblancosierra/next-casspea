// GoldLanding: Gold-themed landing page composition
'use client';

import LandingColorBase from './LandingColorBase';
import { LANDING_CONFIG } from './constants';

export default function LandingColorGold() {
  return (
    <LandingColorBase config={LANDING_CONFIG.gold} />
  );
}