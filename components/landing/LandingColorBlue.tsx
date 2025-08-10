// MainLanding: Landing page composition
'use client';

// Section components
import LandingColorBase from './LandingColorBase';
import { blueGradient, LANDING_TYPES } from './constants';

export default function LandingColorBlue() {
  return (
    <LandingColorBase
      landing={LANDING_TYPES.BLUE}
      unitSoldBgs={[blueGradient]}
    />
  );
}