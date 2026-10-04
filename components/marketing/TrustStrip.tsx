import { FiGift, FiLock, FiTruck, FiZap } from 'react-icons/fi';

/**
 * The four things a first-time gift buyer worries about, answered where they
 * decide: under the hero and directly under the add-to-cart button.
 *
 * Every line is something the shop already does and already says elsewhere
 * (the product page's shipping section, the help page). Nothing here is a new
 * promise — in particular there is no delivery-date guarantee, because weekends
 * and bank holidays make "tomorrow" untrue for part of every week.
 *
 * `shipping={false}` drops the two delivery lines, for products that are
 * collected in store or posted on a fixed day (the Advent calendar), where
 * "next-day delivery" would be wrong.
 */

const POINTS = [
    { key: 'handmade', icon: FiGift, title: 'Handmade in London', body: 'Hand-painted, small batches' },
    { key: 'tracked', icon: FiTruck, title: 'Royal Mail Tracked', body: 'Free over £56', shipping: true },
    { key: 'nextday', icon: FiZap, title: 'Next-day available', body: 'Special Delivery, order by 11am', shipping: true },
    { key: 'secure', icon: FiLock, title: 'Secure checkout', body: 'Card, Apple Pay & Google Pay' },
];

interface TrustStripProps {
    shipping?: boolean;
    /** 'row' spreads across the page; 'grid' is a compact 2x2 for a side column. */
    layout?: 'row' | 'grid';
    className?: string;
}

export default function TrustStrip({ shipping = true, layout = 'row', className = '' }: TrustStripProps) {
    const points = POINTS.filter(p => shipping || !p.shipping);
    const grid = layout === 'grid' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4';

    return (
        <ul className={`grid ${grid} gap-3 ${className}`} aria-label="Why order from CassPea">
            {points.map(({ key, icon: Icon, title, body }) => (
                <li key={key} className="flex items-start gap-2">
                    <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary dark:text-accent" />
                    <div>
                        <p className="text-sm font-semibold text-primary-text dark:text-primary-text-light">{title}</p>
                        <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70">{body}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
