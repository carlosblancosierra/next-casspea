// MainLanding: Landing page composition
'use client';

// Section components
import LandingColorBase from './LandingColorBase';
import { LANDING_CONFIG } from './constants';

export default function LandingColorBlue() {
  return (
    <LandingColorBase config={LANDING_CONFIG.blue} />
  );
}