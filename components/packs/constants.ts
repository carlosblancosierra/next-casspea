export const PRICE_MAP: Record<number, number> = {
  9: 28,
  15: 38,
  24: 53,
  48: 90,
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
