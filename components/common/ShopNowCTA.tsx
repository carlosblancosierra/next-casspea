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

interface ShopNowCTAProps {
    /** Override the shared label only when a page genuinely needs different copy. */
    label?: string;
    href?: string;
    /** The rating is the whole point of it being here; hide it deliberately. */
    showRating?: boolean;
    className?: string;
}

export default function ShopNowCTA({
    label = SHOP_CTA_LABEL,
    href = SHOP_CTA_HREF,
    showRating = true,
    className = '',
}: ShopNowCTAProps) {
    return (
        <div className={`flex flex-col items-start gap-2 ${className}`}>
            {showRating && <TrustpilotRating className="!justify-start" />}
            <Link
                href={href}
                className="inline-flex items-center justify-center px-8 py-4 text-xl font-medium text-primary-button-text rounded-lg bg-primary hover:bg-primary-dark focus:ring-4 focus:ring-primary-light"
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
        </div>
    );
}
