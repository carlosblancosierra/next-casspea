import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * The site's buttons, in one place.
 *
 * Three variants, ranked by how much they ask for attention:
 *
 * - `primary`   — the one thing we want people to do on this screen. Solid
 *                 fill. Use one per view.
 * - `secondary` — a real alternative to the primary ("Shop Christmas gifts"
 *                 beside "Order the Advent calendar", "Contact us" beside
 *                 "Back to your basket"). Outline only, so it never competes.
 * - `tertiary`  — a quiet action that is still a button (a "See all" or
 *                 "Cancel"). No border, no fill.
 * - `danger`    — only for actions that destroy something ("Yes, remove").
 *                 Red fill, and always next to a secondary way out.
 *
 * Each variant owns its dark-mode look. The outline used to borrow the brand
 * colour in dark mode too, which with the navy palette meant navy text on a
 * near-black page — about 1.5:1, unreadable. On a dark page the outline is
 * now the light ink instead, which is the same rule the body text follows.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
    'inline-flex items-center justify-center gap-2 rounded-lg border-2 text-center font-medium transition-colors ' +
    'focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light ' +
    'disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-wait';

const VARIANTS: Record<ButtonVariant, string> = {
    primary:
        'border-primary bg-primary text-primary-button-text hover:border-primary-dark hover:bg-primary-dark',
    secondary:
        'border-primary bg-transparent text-primary hover:bg-primary/5 ' +
        'dark:border-primary-text-light/70 dark:text-primary-text-light ' +
        'dark:hover:border-primary-text-light dark:hover:bg-white/10',
    danger:
        'border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700 focus-visible:ring-red-300',
    tertiary:
        'border-transparent bg-transparent text-primary underline-offset-4 hover:underline ' +
        'dark:text-primary-text-light',
};

// The border is on every variant (transparent where it is not drawn) so a
// primary and a secondary side by side are exactly the same height.
const SIZES: Record<ButtonSize, string> = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    // Smaller on phones so two of them fit in the hero without the second
    // dropping below the fold.
    lg: 'px-5 py-2.5 text-base sm:px-8 sm:py-4 sm:text-xl',
};

export function buttonClasses({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
}: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
} = {}) {
    return [BASE, VARIANTS[variant], SIZES[size], fullWidth ? 'w-full' : '', className]
        .filter(Boolean)
        .join(' ');
}

interface CommonProps {
    /** Shows a spinner, disables the button and sets aria-busy. Buttons only. */
    loading?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
    children: ReactNode;
}

type AsLink = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & { href: string };
type AsButton = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & { href?: undefined };

/**
 * Renders a Next.js link when given `href`, otherwise a `<button>`. External
 * links (`target="_blank"`) are a plain `<a>`.
 */
export default function Button(props: AsLink | AsButton) {
    const { variant, size, fullWidth, className, children, loading = false, ...rest } = props;
    const classes = buttonClasses({ variant, size, fullWidth, className });

    if (rest.href !== undefined) {
        const { href, target, ...anchor } = rest as AsLink;
        if (target === '_blank' || /^https?:\/\//.test(href)) {
            return (
                <a href={href} target={target} className={classes} {...anchor}>
                    {children}
                </a>
            );
        }
        return (
            <Link href={href} target={target} className={classes} {...anchor}>
                {children}
            </Link>
        );
    }

    const { type = 'button', disabled, ...button } = rest as AsButton;
    return (
        // eslint-disable-next-line react/button-has-type
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...button}
        >
            {loading && <Spinner />}
            {children}
        </button>
    );
}

function Spinner() {
    return (
        <svg className="-ml-1 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}
