import type { Metadata } from 'next';
import type { Product } from '@/types/products';
import type { Flavour } from '@/types/flavours';
import { getProduct } from '@/utils/products';
import { getFlavours } from '@/utils/flavours';
import { formatCurrency } from '@/utils/currency';
import { toAmount } from '@/utils/analytics';
import BuyButton from './BuyButton';
import ExitIntentPopup from './ExitIntentPopup';
import ViewItemTracker from './ViewItemTracker';
import { jsonLdScript, productJsonLd } from './jsonLd';
import {
    ADVENT_EARLY_ACCESS_PATH,
    ADVENT_PATH,
    ADVENT_SLUG,
    COPY,
    EXCLUSIVES_CATEGORY,
    FALLBACK_PRICE,
    type Variant,
} from './content';
import Hero from './sections/Hero';
import Contrast from './sections/Contrast';
import ValueStack from './sections/ValueStack';
import Exclusives from './sections/Exclusives';
import EasiestGift from './sections/EasiestGift';
import WhoFor from './sections/WhoFor';
import Reminder from './sections/Reminder';
import Story from './sections/Story';
import Reviews from './sections/Reviews';
import Guarantee from './sections/Guarantee';
import Faq from './sections/Faq';
import FinalCta from './sections/FinalCta';

/**
 * The Advent Calendar 2026 landing, for ads and the shop.
 *
 * A Server Component: every word, the price and the JSON-LD are in the HTML
 * the server sends, which is what Google Ads' landing-page check and search
 * engines read. Only the countdown, the buy buttons, the email forms, the
 * exit-intent popup and the view_item event run in the browser.
 *
 * Two variants share it. `shop` sells straight away; `lead` puts an
 * early-access email form in the hero, shows the buy button once the visitor
 * has signed up, and is kept out of search (noindex).
 */

/** Seconds a built page is served before it is rebuilt with fresh stock. */
export const REVALIDATE_SECONDS = 60;

/** The calendar's exclusive flavours: the first three Christmas flavours, launched or not. */
export async function getAdventExclusives(): Promise<Flavour[]> {
    const all = await getFlavours({ revalidate: REVALIDATE_SECONDS, includeComingSoon: true });
    return all.filter(f => f.category?.slug?.includes(EXCLUSIVES_CATEGORY)).slice(0, 3);
}

/** The product's photos in the product page's order: main image, then the gallery. */
export function productImages(product: Product | null): string[] {
    if (!product) return [];
    return [product.image, ...(product.gallery_images ?? []).map(g => g.image)].filter(
        (src): src is string => !!src,
    );
}

/** Photo 1 for the hero and for sharing, photo 2 for the story; the bundled ones if missing. */
export function adventImages(product: Product | null) {
    const [first, second] = productImages(product);
    return {
        hero: first ?? '/advent/hero.jpg',
        story: second ?? first ?? '/advent/story.jpg',
        og: first ?? COPY.seo.ogImage,
    };
}

export async function getAdventProduct(): Promise<Product | null> {
    return getProduct(ADVENT_SLUG, { revalidate: REVALIDATE_SECONDS });
}

/** The selling price from the API, else the launch price, as "59.99". */
export function priceOf(product: Product | null): string {
    const raw = product?.current_price ?? product?.base_price;
    const amount = toAmount(raw);
    return amount > 0 ? amount.toFixed(2) : FALLBACK_PRICE;
}

export function adventMetadata(variant: Variant, product: Product | null = null): Metadata {
    const { title, description } = COPY.seo;
    const ogImage = adventImages(product).og;
    const images = [{ url: ogImage, alt: 'CassPea Advent Calendar 2026' }];
    return {
        title,
        description,
        alternates: { canonical: ADVENT_PATH },
        // Not launched yet: both variants stay out of search until the page is ready.
        robots: { index: false, follow: false },
        openGraph: {
            type: 'website',
            siteName: 'CassPea',
            locale: 'en_GB',
            url: variant === 'lead' ? ADVENT_EARLY_ACCESS_PATH : ADVENT_PATH,
            title,
            description,
            images,
        },
        twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    };
}

interface LandingProps {
    variant: Variant;
    product: Product | null;
    exclusives?: Flavour[];
}

export default function AdventLanding({ variant, product, exclusives = [] }: LandingProps) {
    const images = adventImages(product);
    const amount = priceOf(product);
    const price = formatCurrency(amount);
    // Rendered once per build; the countdown corrects itself in the browser.
    const serverNow = Date.now();
    const productName = product?.name || 'Advent Calendar 2026';

    const buy = (size: 'md' | 'lg' = 'lg') => (
        <BuyButton
            productId={product?.id ?? null}
            productName={productName}
            soldOut={product?.sold_out}
            canPickAllergens={!!product?.can_pick_allergens}
            label={COPY.hero.cta}
            size={size}
        />
    );

    return (
        // The layout's <main> has a 1rem gutter; the bands here run edge to edge.
        <div className="-mx-4 -mt-2 text-base text-primary-text dark:text-primary-text-light">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(productJsonLd(product, amount)) }} />
            <ViewItemTracker
                item={{
                    item_id: product ? String(product.id) : ADVENT_SLUG,
                    item_name: productName,
                    item_category: product?.category?.name,
                    price: toAmount(amount),
                    quantity: 1,
                }}
            />

            <Hero variant={variant} price={price} serverNow={serverNow} buyButton={buy()} image={images.hero} />
            <Contrast />
            <ValueStack price={price} />
            <Exclusives flavours={exclusives} />
            <EasiestGift />
            <WhoFor />
            {variant === 'shop' && <Reminder />}
            <Story image={images.story} />
            <Reviews />
            <Guarantee />
            <Faq />
            <FinalCta price={price} serverNow={serverNow} buyButton={buy()} />

            {variant === 'shop' && <ExitIntentPopup />}
        </div>
    );
}
