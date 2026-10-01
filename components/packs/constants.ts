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

/** The category the product page treats as a buildable box. */
const SIGNATURE_BOX_CATEGORY_SLUG = 'signature-boxes';
const SIGNATURE_BOX_CATEGORY_ID = 1;

type PackLookupProduct = {
  id: number;
  slug?: string;
  units_per_box?: number;
  active?: boolean;
  category?: { id?: number; slug?: string } | null;
};

/**
 * Where an indulgence-pack product should send the visitor: its box's builder,
 * already in pack mode. null for anything that is not a pack, or a pack whose
 * box cannot be found — no box to build it in is not a reason to 404 a page.
 *
 * A pack is a box plus a bark, a hot chocolate and a gift card, and the only
 * place to choose those is the box's builder; pack products on their own page
 * render the plain add-to-cart form with no flavour selection at all.
 *
 * A candidate box must not itself be a pack. Pack SKUs can carry
 * units_per_box too, and a pack that matched itself would redirect to its own
 * page, which redirects again — forever. Box-ness uses the same test the
 * product page does (category id 1 or the signature-boxes slug), so "the box"
 * means exactly what renders the builder.
 */
export function packRedirectTarget(
  product: PackLookupProduct,
  products: PackLookupProduct[],
): string | null {
  const units = PACK_ID_TO_UNITS[product.id];
  if (!units) return null;

  const box = products.find(
    (candidate) =>
      !PACK_ID_TO_UNITS[candidate.id]
      && candidate.units_per_box === units
      && candidate.active !== false
      && (candidate.category?.id === SIGNATURE_BOX_CATEGORY_ID
        || candidate.category?.slug === SIGNATURE_BOX_CATEGORY_SLUG),
  );
  if (!box?.slug) return null;

  return `/shop-now/${box.slug}?${PACK_QUERY_PARAM}=1`;
}

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
