import Image from 'next/image';

export const TRUSTPILOT_URL = 'https://uk.trustpilot.com/review/www.casspea.co.uk';

interface Props {
    className?: string;
    /**
     * Where the rating points. Trustpilot by default, which is correct on any
     * page; a page that has its own reviews section passes '#reviews' to keep
     * the visitor here. Defaulting to the anchor would silently produce a dead
     * link on every page without that section — /shop-now, for one.
     */
    href?: string;
    /**
     * Colour of the link text. Defaults to the theme-paired tokens, which is
     * what is needed on a normal page background. Pass an override when placing
     * this on a fixed-colour surface (e.g. the teal announcement bar).
     */
    linkClassName?: string;
}

export default function TrustpilotRating({
    className = '',
    href = TRUSTPILOT_URL,
    linkClassName = 'text-primary-text dark:text-primary-text-light',
}: Props) {
    const leavesTheSite = href.startsWith('http');

    return (
        <div className={`flex items-center gap-x-2 justify-center ${className}`}>
            <Image
                src="/home/stars-4.5.svg"
                alt="Trustpilot rating 4.7 out of 5"
                width={100}
                height={100}
                className="inline-block"
            />
            <a
                href={href}
                className={`text-sm font-medium inline-block hover:underline ${linkClassName}`}
                {...(leavesTheSite ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
                4.7 on Trustpilot (74 reviews)
            </a>
        </div>
    );
}
