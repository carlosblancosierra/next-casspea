export const LANDING_TYPES = {
  GOLD: 'gold',
  BLUE: 'blue',
};

export const goldGradient = 'gradient-radial-gold'

export const blueGradient = 'gradient-45-blue-4'

export const HERO_SECTION_TEXT_BASE = {
  heading: 'Share the Love, One Bonbon at a Time',
  subheading: 'Luxury handmade chocolates crafted in London.',
  mainBtnLabel: 'Get 20% off',
  mainBtnAriaLabel: 'Get 20% off',
  secondaryBtnLabel: 'Explore Our Store',
  secondaryBtnAriaLabel: 'Explore Our Store',
};

export const HERO_SECTION_DEFAULTS_GOLD = {
  bgImage: '/landings/intro/bg-blue.jpg',
  overlayClassName: 'bg-black/40',
  ctaBgClass: goldGradient,
  ctaTextClass: 'text-white',
  socialBgClass: goldGradient,
  leadCaptureBgClass: goldGradient,
  ...HERO_SECTION_TEXT_BASE,
};

export const HERO_SECTION_DEFAULTS_BLUE = {
  bgImage: '/landings/intro/bg-blue.jpg',
  overlayClassName: 'bg-black/40',
  ctaBgClass: blueGradient,
  ctaTextClass: 'text-white',
  socialBgClass: blueGradient,
  leadCaptureBgClass: blueGradient,
  ...HERO_SECTION_TEXT_BASE,
};

export const PERSONALISED_TEXT = {
  heading: 'Make It Yours: Chocolates for Your Event',
  subheading:
    'Choose from 6 playful base designs, match your colours, and pick your favourite fillings. We’ll craft bonbons that look the part—and taste unforgettable.',
  templateCardLabel: 'Customize this template',

  // Opcionales
  badge: '6 designs · Mix & match',
  steps: ['Pick a design', 'Choose colours', 'Select flavours'],
};

export const PERSONALISED_STEPS_BLUE_COLORS = [
  'blue', 'purple', 'black', 'pink', 'green'
];
export const PERSONALISED_STEPS_GOLD_COLORS = [
  'yellow', 'orange', 'red', 'black', 'green'
];


export const GOLD_CONSTANTS = {
  HERO_SECTION: HERO_SECTION_DEFAULTS_GOLD,
  GRADIENT_BG: goldGradient,
};

export const BLUE_CONSTANTS = {
  HERO_SECTION: HERO_SECTION_DEFAULTS_BLUE,
  GRADIENT_BG: blueGradient,
};