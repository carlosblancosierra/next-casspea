import Link from 'next/link';
import TrustpilotRating from './TrustpilotRating';

/**
 * The home page's main call to action.
 *
 * The hero had two hand-written copies of this button — one in the mobile
 * block, one in the desktop column — with the same link, the same classes and
 * the same arrow, but different labels. Changing the offer meant remembering
 * both. This is the one place to edit now.
 *
 * The Trustpilot rating is part of it rather than something each caller
 * remembers to add: it belongs directly above the button, and keeping them in
 * one component is what stops them drifting apart again.
 */

export const SHOP_CTA_LABEL = 'Shop Indulgence Now!';
export const SHOP_CTA_HREF = '/shop-now';

// Smaller on phones so two buttons fit side by side or stacked without pushing
// the second one below the fold. The border is on both so they are the same
// height.
const BUTTON_BASE =
    'inline-flex items-center justify-center px-5 py-2.5 text-base sm:px-8 sm:py-4 sm:text-xl font-medium rounded-lg border-2 transition-colors focus:ring-4';

interface ShopNowCTAProps {
    /** Override the shared label only when a page genuinely needs different copy. */
    label?: string;
    href?: string;
    /**
     * An optional second link, drawn as an outline button beside the main one.
     * It uses the same outline style as "See all reviews" under the reviews.
     */
    secondary?: { label: string; href: string };
    /** The rating is the whole point of it being here; hide it deliberately. */
    showRating?: boolean;
    className?: string;
}

export default function ShopNowCTA({
    label = SHOP_CTA_LABEL,
    href = SHOP_CTA_HREF,
    secondary,
    showRating = true,
    className = '',
}: ShopNowCTAProps) {
    return (
        <div className={`flex flex-col items-start gap-2 ${className}`}>
            {/* Scrolls to the reviews on this page rather than leaving for
                Trustpilot: handing someone to another site from the hero,
                before they have seen a product, is a strange thing for a shop
                to do. The "See all reviews" button under the reviews is the
                one link that leaves. */}
            {showRating && <TrustpilotRating href="#reviews" className="!justify-start" />}
            <div className="flex flex-wrap items-center gap-3">
                <Link
                    href={href}
                    className={`${BUTTON_BASE} text-primary-button-text bg-primary border-primary hover:bg-primary-dark focus:ring-primary-light`}
                >
                    {label}
                    <svg
                        className="w-5 h-5 ml-2 -mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Link>
                {secondary && (
                    <Link
                        href={secondary.href}
                        className={`${BUTTON_BASE} text-primary border-primary hover:bg-primary hover:text-primary-button-text focus:ring-primary-light dark:border-primary-2 dark:text-primary-2`}
                    >
                        {secondary.label}
                    </Link>
                )}
            </div>
        </div>
    );
}
