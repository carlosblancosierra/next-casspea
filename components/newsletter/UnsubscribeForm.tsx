'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUnsubscribeMutation } from '@/redux/features/subscribe/subscribeApiSlice';
import { CONTACT } from '@/components/common/siteLinks';

type State = 'loading' | 'no-token' | 'ready' | 'done' | 'error';

/**
 * Where the "Unsubscribe" link at the bottom of every email lands
 * (?token=… from casspea-v2's leads/unsubscribe.py).
 *
 * Nothing happens until the button is clicked. Mail scanners open every link
 * in an email, and some run its JavaScript: unsubscribing on page load would
 * take people off the list without them ever asking.
 */
export default function UnsubscribeForm() {
    const [token, setToken] = useState<string | null>(null);
    const [state, setState] = useState<State>('loading');
    const [email, setEmail] = useState('');
    const [unsubscribe, { isLoading }] = useUnsubscribeMutation();

    useEffect(() => {
        // Read straight from the URL: useSearchParams would force a Suspense
        // boundary on the page.
        const fromUrl = new URLSearchParams(window.location.search).get('token');
        setToken(fromUrl);
        setState(fromUrl ? 'ready' : 'no-token');
    }, []);

    const handleClick = async () => {
        if (!token) return;
        try {
            const result = await unsubscribe({ token }).unwrap();
            setEmail(result.email);
            setState('done');
        } catch {
            setState('error');
        }
    };

    const writeToUs = (
        <a href={CONTACT.email.href} className="underline underline-offset-2 hover:no-underline">
            {CONTACT.email.address}
        </a>
    );

    return (
        <div className="max-w-xl mx-auto px-4 py-16 text-primary-text dark:text-primary-text-light">
            <h1 className="text-3xl font-bold mb-4 text-primary-text dark:text-white">
                {state === 'done' ? "You're unsubscribed" : 'Unsubscribe from CassPea emails'}
            </h1>

            {state === 'ready' && (
                <>
                    <p className="mb-6">
                        You will stop getting offers, basket reminders and review requests from us. We will
                        still email you about orders you place.
                    </p>
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={isLoading}
                        className="rounded-md px-6 py-3 font-semibold text-primary-text-light bg-primary dark:bg-primary-2 hover:bg-primary-2 dark:hover:bg-primary disabled:opacity-60 disabled:cursor-wait"
                    >
                        {isLoading ? 'Unsubscribing…' : 'Unsubscribe'}
                    </button>
                </>
            )}

            {state === 'done' && (
                <p className="mb-6">
                    We won&apos;t send marketing emails to {email} any more. Changed your mind? Write to {writeToUs}.
                </p>
            )}

            {state === 'no-token' && (
                <p className="mb-6">
                    To stop our emails, use the Unsubscribe link at the bottom of any email from us, or write
                    to {writeToUs} and we will take you off the list.
                </p>
            )}

            {state === 'error' && (
                <p role="alert" className="mb-6">
                    This link isn&apos;t working. Write to {writeToUs} and we will take you off the list.
                </p>
            )}

            {state !== 'loading' && (
                <Link href="/" className="underline underline-offset-2 hover:no-underline">
                    Back to the shop
                </Link>
            )}
        </div>
    );
}
