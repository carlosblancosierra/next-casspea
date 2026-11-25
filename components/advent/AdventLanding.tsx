import type { Metadata } from 'next';
import type { Product } from '@/types/products';
import type { Flavour } from '@/types/flavours';
import { getAdventLanding, getProduct } from '@/utils/products';
import { getFlavours } from '@/utils/flavours';
import FlavourNameGrid from '@/components/flavours/FlavourNameGrid';
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
import PhotoBand from './sections/PhotoBand';
import Reviews from './sections/Reviews';
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

/** The landing's content from the API; null while it is not live (staff then preview it in the browser). */
export async function getAdventLandingData() {
    return getAdventLanding({ revalidate: REVALIDATE_SECONDS });
}

/** Every flavour we show off (the home page's grid), Christmas ones included. */
export async function getShowcaseFlavours(): Promise<Flavour[]> {
    return getFlavours({ revalidate: REVALIDATE_SECONDS, includeComingSoon: true });
}

/** The product's photos in the product page's order: main image, then the gallery. */
export function productImages(product: Product | null): string[] {
    if (!product) return [];
    const all = [product.image, ...(product.gallery_images ?? []).map(g => g.image)];
    return all.filter((src, i): src is string => !!src && all.indexOf(src) === i);
}

/**
 * Photo 1 for the hero and for sharing; the rest run full width between the
 * sections, uncropped. The bundled images stand in when the product has none.
 */
export function adventImages(product: Product | null) {
    const photos = productImages(product);
    return {
        hero: photos[0] ?? '/advent/hero.jpg',
        bands: photos.slice(1),
        og: photos[0] ?? COPY.seo.ogImage,
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
        // The shop page is live and open to search. The early-access page is
        // for the email campaign only and stays out of search.
        robots: variant === 'shop' ? { index: true, follow: true } : { index: false, follow: false },
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
    /** The exclusives category from the advent-landing API; the first three are shown. */
    exclusives?: Flavour[];
    /** Every flavour, for the grid the home page has. */
    flavours?: Flavour[];
}

export default function AdventLanding({ variant, product, exclusives = [], flavours = [] }: LandingProps) {
    const productName = product?.name || 'Advent Calendar 2026';
    const images = adventImages(product);
    // Photos 2, 3, 4… between the sections, in this order; any extra go before the final CTA.
    const [band1, band2, band3, ...moreBands] = images.bands;
    const band = (src?: string) => src && <PhotoBand src={src} alt={productName} />;
    const amount = priceOf(product);
    const price = formatCurrency(amount);
    // Rendered once per build; the countdown corrects itself in the browser.
    const serverNow = Date.now();

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
            {/* The photos are portrait, like a story: full width they fill a
                desktop screen. So on desktop photo 2 takes half the width with
                the price beside it, and photo 3 is left out. On phones both
                stay full width between the sections. */}
            <div className={band1 ? 'lg:grid lg:grid-cols-2 lg:items-center' : ''}>
                {band1 && (
                    <PhotoBand
                        src={band1}
                        alt={productName}
                        className="lg:max-w-none lg:px-0 lg:py-20"
                        imageClassName="md:rounded-2xl lg:rounded-l-none"
                        sizes="(min-width: 1024px) 50vw, (min-width: 1200px) 1200px, 100vw"
                    />
                )}
                <ValueStack price={price} />
            </div>
            <Exclusives flavours={exclusives.slice(0, 3)} />
            {band2 && <PhotoBand src={band2} alt={productName} className="lg:hidden" />}
            <EasiestGift />
            <WhoFor />
            {variant === 'shop' && <Reminder />}
            <Story />
            {band(band3)}
            {flavours.length > 0 && (
                <section className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 pt-20">
                    <h2 className="m-0 text-center font-playfair text-[clamp(32px,4vw,52px)] font-bold leading-[1.05] tracking-tight text-primary-text dark:text-primary-text-light">
                        {COPY.flavours.heading}
                    </h2>
                    <FlavourNameGrid flavours={flavours} showDescription excludeFeatured />
                </section>
            )}
            <Reviews />
            <Faq />
            {moreBands.map(src => <PhotoBand key={src} src={src} alt={productName} />)}
            <FinalCta price={price} serverNow={serverNow} buyButton={buy()} />

            {variant === 'shop' && <ExitIntentPopup />}
        </div>
    );
}
