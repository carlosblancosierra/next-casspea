export const PRICE_MAP: Record<number, number> = {
  9: 32.5,
  15: 45,
  24: 60,
  48: 105,
};

export const ID_MAP: Record<number, number> = {
  9: 170,
  15: 171,
  24: 172,
  48: 173,
};

export const ALLERGENS = [
  { id: 2, name: 'Gluten' },
  { id: 5, name: 'Alcohol' },
  { id: 6, name: 'Nut' },
];

export const PREBUILDS = [
  { name: 'Pick & Mix', value: 'PICK_AND_MIX', description: 'Choose your own flavours' },
  { name: 'Surprise Me', value: 'RANDOM', description: 'Let us surprise you' },
];

export const STEP_LABELS = [
  'Signature Box',
  'Chocolate Bark',
  'Hot Chocolate',
  'Gift Card',
  'Box Type',
  'Select Allergens',
  'Choose Flavours',
  'Summary',
];

export const STEP_BORDER = [
  'border-pink-500',
  'border-green-500',
  'border-red-500',
  'border-orange-400',
  'border-blue-700',
  'border-yellow-300',
  'border-indigo-500',
  'border-purple-500',
];

export const STEP_EXPLANATIONS = [
  "Select the size of your signature box.",
  "Optionally add a layer of delicious chocolate bark.",
  "Optionally choose a hot chocolate infusion for extra warmth.",
  "Optionally include a personalized gift card with your order.",
  "Decide between Pick & Mix for custom flavour selection or Surprise Me for a curated experience.",
  "Select any allergens you wish to avoid (applies to bonbons only).",
  "Pick your favourite flavours to fill your box.",
  "Review and confirm your selections to complete your order."
];
