export const LANDING_TYPES = {
  GOLD: 'gold',
  BLUE: 'blue',
};

// Hero section defaults
export const HERO_SECTION_DEFAULTS_GOLD = {
  bgImage: '/landings/intro/bg-blue.jpg',
  overlayClassName: 'bg-black/40',
  ctaBgClass: 'bg-pink-500 hover:bg-pink-600',
  ctaTextClass: 'text-white',
};

export const HERO_SECTION_DEFAULTS_BLUE = {
  bgImage: '/landings/intro/bg-blue.jpg',
  overlayClassName: 'bg-black/40',
  ctaBgClass: 'bg-pink-500 hover:bg-pink-600',
  ctaTextClass: 'text-white',
};

export const goldGradient = 'gradient-radial-gold'

export const blueGradient = 'gradient-45-blue-4'

export const GOLD_CONSTANTS = {
  HERO_SECTION: HERO_SECTION_DEFAULTS_GOLD,
  GRADIENT_BG: goldGradient,
};

export const BLUE_CONSTANTS = {
  HERO_SECTION: HERO_SECTION_DEFAULTS_BLUE,
  GRADIENT_BG: blueGradient,
};