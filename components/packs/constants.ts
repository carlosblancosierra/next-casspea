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

/**
 * ID_MAP the other way round: pack SKU -> how many chocolates its box holds.
 *
 * The store lists indulgence packs as their own products, but a pack has to be
 * *built* — flavours, bark, hot chocolate — and that only happens on the box
 * page. So a pack slug sends the visitor to its box with the pack flag set,
 * and this is what turns one into the other. Derived rather than written out
 * twice, so the two can never drift.
 */
export const PACK_ID_TO_UNITS: Record<number, number> = Object.fromEntries(
  Object.entries(ID_MAP).map(([units, packId]) => [packId, Number(units)]),
);

/** Marks a box page as building a pack: /shop-now/box-of-24?pack=1 */
export const PACK_QUERY_PARAM = 'pack';

export const LOVE_SLEEVE_PRODUCT_ID = 434
export const LOVE_SLEEVE_PRICE = 4.99

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
  'Love Sleeve',
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
  'border-pink-400',
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
  "Optionally add a Love Sleeve for £4.99 to wrap your pack.",
  "Decide between Pick & Mix for custom flavour selection or Surprise Me for a curated experience.",
  "Select any allergens you wish to avoid (applies to bonbons only).",
  "Pick your favourite flavours to fill your box.",
  "Review and confirm your selections to complete your order."
];
