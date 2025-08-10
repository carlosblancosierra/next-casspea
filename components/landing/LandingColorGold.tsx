// GoldLanding: Gold-themed landing page composition
'use client';

import LandingColorBase from './LandingColorBase';
import { GOLD_CONSTANTS, LANDING_TYPES } from './constants';

export default function LandingColorGold() {
  return (
    <LandingColorBase
      landing={LANDING_TYPES.GOLD}
      unitSoldBgs={GOLD_CONSTANTS.GRADIENT_BG}
    />
  );
}