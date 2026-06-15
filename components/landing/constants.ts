export const LANDING_TYPES = {
  GOLD: 'gold',
  BLUE: 'blue',
  FATHERS_DAY: 'fathersday',
};

export const goldGradient = 'gradient-radial-gold'

export const blueGradient = 'gradient-45-blue-4'

export const fathersDayGradient = 'gradient-fathers-day'

export const HERO_SECTION_TEXT_BASE = {
  heading: 'Share the Love, One Bonbon at a Time',
  subheading: 'Luxury handmade chocolates crafted in London.',
  mainBtnLabel: 'Get 15% off',
  mainBtnAriaLabel: 'Get 15% off',
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

export const HERO_SECTION_TEXT_FATHERS_DAY = {
  heading: 'Gift Dad Something Unforgettable',
  subheading: 'Curated handmade chocolate boxes, built for Father’s Day.',
  mainBtnLabel: 'Build Dad’s box',
  mainBtnAriaLabel: 'Build Dad’s box',
  secondaryBtnLabel: 'Explore Our Store',
  secondaryBtnAriaLabel: 'Explore Our Store',
};

export const HERO_SECTION_DEFAULTS_FATHERS_DAY = {
  bgImage: '/landings/intro/bg-blue.jpg',
  overlayClassName: 'bg-black/50',
  ctaBgClass: fathersDayGradient,
  ctaTextClass: 'text-white',
  socialBgClass: fathersDayGradient,
  leadCaptureBgClass: fathersDayGradient,
  ...HERO_SECTION_TEXT_FATHERS_DAY,
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


export const LANDING_CONFIG = {
  gold: {
    type: LANDING_TYPES.GOLD,
    gradient: goldGradient,
    hero: HERO_SECTION_DEFAULTS_GOLD,
    leadCaptureTheme: 'gold',
    leadCaptureBgClass: HERO_SECTION_DEFAULTS_GOLD.leadCaptureBgClass,
    socialBgClass: HERO_SECTION_DEFAULTS_GOLD.socialBgClass,
    personalisedColors: PERSONALISED_STEPS_GOLD_COLORS,
    personalisedText: PERSONALISED_TEXT,
    // Add more config as needed
  },
  blue: {
    type: LANDING_TYPES.BLUE,
    gradient: blueGradient,
    hero: HERO_SECTION_DEFAULTS_BLUE,
    leadCaptureTheme: 'blue',
    leadCaptureBgClass: HERO_SECTION_DEFAULTS_BLUE.leadCaptureBgClass,
    socialBgClass: HERO_SECTION_DEFAULTS_BLUE.socialBgClass,
    personalisedColors: PERSONALISED_STEPS_BLUE_COLORS,
    personalisedText: PERSONALISED_TEXT,
    // Add more config as needed
  },
  fathersday: {
    type: LANDING_TYPES.FATHERS_DAY,
    gradient: fathersDayGradient,
    hero: HERO_SECTION_DEFAULTS_FATHERS_DAY,
    leadCaptureTheme: 'fathersday',
    leadCaptureBgClass: HERO_SECTION_DEFAULTS_FATHERS_DAY.leadCaptureBgClass,
    socialBgClass: HERO_SECTION_DEFAULTS_FATHERS_DAY.socialBgClass,
    personalisedColors: PERSONALISED_STEPS_BLUE_COLORS,
    personalisedText: PERSONALISED_TEXT,
    // Add more config as needed
  },
};