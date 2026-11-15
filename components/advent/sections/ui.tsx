import type { ReactNode } from 'react';

/** Shared bits of the Advent landing's layout, so every section reads the same. */

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <p className={`text-sm font-semibold uppercase tracking-wide text-primary dark:text-primary-light ${className}`}>
            {children}
        </p>
    );
}

export function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <h2 className={`m-0 font-playfair text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.15] ${className}`}>
            {children}
        </h2>
    );
}

/** Body text colour on the page background and on white cards. */
export const MUTED = 'text-gray-700 dark:text-gray-300';
export const HEADING = 'text-primary-text dark:text-primary-text-light';
export const CARD =
    'rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900';
export const SHADOW = 'shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]';

export function Cross() {
    return (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-none">
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    );
}

export function Tick() {
    return (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none text-my-green dark:text-green-400">
            <path d="M5 12l5 5L20 7" />
        </svg>
    );
}

const ICON_PATHS: Record<string, ReactNode> = {
    heart: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z" />,
    star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </>
    ),
    box: (
        <>
            <path d="M3 7l9-4 9 4-9 4-9-4z" />
            <path d="M3 7v10l9 4 9-4V7" />
        </>
    ),
    shield: (
        <>
            <path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z" />
            <path d="M8.5 12l2.5 2.5 4.5-5" />
        </>
    ),
};

export function Icon({ name, size = 28, strokeWidth = 1.8 }: { name: string; size?: number; strokeWidth?: number }) {
    return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="flex-none text-primary dark:text-primary-light">
            {ICON_PATHS[name]}
        </svg>
    );
}
