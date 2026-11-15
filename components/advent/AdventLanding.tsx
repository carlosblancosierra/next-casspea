import type { Metadata } from 'next';
import type { Flavour } from '@/types/flavours';
import type { Product } from '@/types/products';
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
 *
 * Everything it shows about the calendar comes from the API's Advent landing
 * (utils/adventLanding.ts): the product, its photos and the exclusive
 * flavours. It renders on the server once the landing is live, and in the
 * browser for staff before that (PrivateAdventLanding).
 */

/** The landing's photos: the product's main photo, then its last gallery photo. */
export function adventImages(product: Product | null): { hero: string | null; story: string | null } {
    const gallery = product?.gallery_images ?? [];
    const hero = product?.image || null;
    const story = gallery.length > 0 ? gallery[gallery.length - 1].image : hero;
    return { hero, story };
}

/** The selling price from the API, else the launch price, as "59.99". */
export function priceOf(product: Product | null): string {
    const raw = product?.current_price ?? product?.base_price;
    const amount = toAmount(raw);
    return amount > 0 ? amount.toFixed(2) : FALLBACK_PRICE;
}

export function adventMetadata(variant: Variant, { live, product }: { live: boolean; product: Product | null }): Metadata {
    const { title, description } = COPY.seo;
    const { hero } = adventImages(product);
    const images = hero ? [{ url: hero, alt: 'CassPea Advent Calendar 2026' }] : [];
    return {
        title,
        description,
        // The early-access page is the same offer: point search engines at the shop page.
        alternates: { canonical: ADVENT_PATH },
        // Out of search until it is live; after that only the early-access page is.
        robots: !live ? { index: false, follow: false } : variant === 'lead' ? { index: false, follow: true } : undefined,
        openGraph: {
            type: 'website',
            siteName: 'CassPea',
            locale: 'en_GB',
            url: variant === 'lead' ? ADVENT_EARLY_ACCESS_PATH : ADVENT_PATH,
            title,
            description,
            images,
        },
        twitter: { card: 'summary_large_image', title, description, images: hero ? [hero] : [] },
    };
}

interface Props {
    variant: Variant;
    product: Product | null;
    flavours: Flavour[];
}

export default function AdventLanding({ variant, product, flavours }: Props) {
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
            <Exclusives flavours={flavours} />
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
