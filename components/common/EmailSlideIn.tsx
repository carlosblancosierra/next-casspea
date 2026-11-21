'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useSubscribeToNewsletterMutation } from '@/redux/features/subscribe/subscribeApiSlice';
import { track } from '@/utils/analytics';
import { buttonClasses } from '@/components/common/Button';
import { getActivePromo } from '@/components/blackfriday/campaign';

export const SUBSCRIBED_KEY = 'casspea_newsletter_subscribed';
export const DISMISSED_KEY = 'casspea_email_slide_in_dismissed_at';
export const SHOW_AFTER_MS = 20_000;
const DISMISS_FOR_MS = 14 * 24 * 60 * 60 * 1000;
const ADVENT_SUBSCRIBED_KEY = 'casspea_advent_2026_subscribed';

/** Paying, or pages that already ask for an email their own way. */
const HIDDEN_ON = ['/cart', '/checkout', '/advent-calendar', '/subscribe', '/unsubscribe', '/auth', '/admin', '/orders', '/clients'];

function read(key: string): string | null {
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

function write(key: string, value: string): void {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // Storage blocked: it may ask again on another visit; acceptable.
    }
}

const COPY = {
    regular: {
        label: 'Get 10% off your first box',
        heading: '10% off your first box',
        body: "Join our list and we'll email you the code, plus a reminder before the Christmas delivery cut-off.",
        submit: 'Get my 10%',
        done: 'Thank you. Check your inbox for your 10% code.',
    },
    // While a Black Friday promo runs the public code is already in the
    // announcement bar, so the 10% would be worse than what everyone gets.
    // Subscribers get a better code by email (the Mailchimp welcome email
    // carries it during the campaign); the number stays out of the page.
    promo: {
        label: 'Subscribers get a better Black Friday offer',
        heading: 'Subscribers get a better Black Friday offer.',
        body: "Join the list and we'll email you a code that beats the one on the site.",
        submit: 'Get my code',
        done: 'Thank you. Check your inbox for your Black Friday code.',
    },
};

function shouldAsk(): boolean {
    if (read(SUBSCRIBED_KEY) === '1' || read(ADVENT_SUBSCRIBED_KEY) === '1') return false;
    const dismissedAt = Number(read(DISMISSED_KEY));
    return !dismissedAt || Date.now() - dismissedAt > DISMISS_FOR_MS;
}

/**
 * The 10% newsletter offer, as a small card in the corner rather than a
 * full-screen popup: no backdrop, the page keeps scrolling and every button
 * stays tappable. It comes in after 20 seconds or half a page of scrolling,
 * whichever is first, and a close keeps it away for two weeks.
 */
export default function EmailSlideIn({ showAfterMs = SHOW_AFTER_MS }: { showAfterMs?: number }) {
    const pathname = usePathname() ?? '/';
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [subscribe, { isLoading }] = useSubscribeToNewsletterMutation();

    const copy = getActivePromo() ? COPY.promo : COPY.regular;

    const hidden = HIDDEN_ON.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));

    useEffect(() => {
        if (hidden || open || !shouldAsk()) return;

        const show = (trigger: 'time' | 'scroll') => {
            setOpen(true);
            track('email_capture_shown', { trigger, path: pathname });
        };
        const timer = setTimeout(() => show('time'), showAfterMs);
        const onScroll = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollable > 0 && window.scrollY / scrollable >= 0.5) show('scroll');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', onScroll);
        };
    }, [hidden, open, pathname, showAfterMs]);

    if (hidden || !open) return null;

    const dismiss = () => {
        write(DISMISSED_KEY, String(Date.now()));
        setOpen(false);
        if (!done) track('email_capture_dismissed', { path: pathname });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            await subscribe({ email, source: 'slide-in' }).unwrap();
            write(SUBSCRIBED_KEY, '1');
            setDone(true);
        } catch {
            setError('Something went wrong. Please check your email and try again.');
        }
    };

    return (
        <aside
            aria-label={copy.label}
            className="fixed inset-x-4 z-[60] rounded-xl border border-gray-200 bg-main-bg p-4 shadow-lg dark:border-gray-700 dark:bg-main-bg-dark sm:left-6 sm:right-auto sm:w-[22rem] fade-in"
            style={{ bottom: 'calc(1rem + var(--buy-bar-height, 0px))' }}
        >
            <button
                type="button"
                onClick={dismiss}
                aria-label="Close"
                className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {done ? (
                <p role="status" className="pr-10 text-sm font-medium text-primary-text dark:text-primary-text-light">
                    {copy.done}
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 pr-6">
                    <p className="font-playfair text-lg font-bold text-primary-text dark:text-primary-text-light">
                        {copy.heading}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {copy.body}
                    </p>
                    <label htmlFor="slide-in-email" className="sr-only">
                        Email address
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="slide-in-email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            aria-invalid={!!error}
                            aria-describedby={error ? 'slide-in-email-error' : undefined}
                            className="min-h-[44px] min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-base text-primary-text placeholder:text-gray-500 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-900 dark:text-primary-text-light"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={buttonClasses({ size: 'sm', className: 'min-h-[44px] shrink-0' })}
                        >
                            {isLoading ? 'Sending…' : copy.submit}
                        </button>
                    </div>
                    {error && (
                        <p id="slide-in-email-error" role="alert" className="text-sm text-red-700 dark:text-red-400">
                            {error}
                        </p>
                    )}
                </form>
            )}
        </aside>
    );
}
