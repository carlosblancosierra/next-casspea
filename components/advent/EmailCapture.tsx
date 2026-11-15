'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { useSubscribeGenericLeadMutation } from '@/redux/features/subscribe/subscribeApiSlice';
import { LEAD_FORM_CODE, type LeadSource } from './content';
import { markSubscribed } from './subscribed';

/**
 * One email field and a button. Posts to the generic lead endpoint, which
 * saves the lead and copies it to Mailchimp tagged with `advent-2026` and the
 * source. generate_lead is tracked by redux/analyticsMiddleware.
 */

interface Props {
    source: LeadSource;
    buttonLabel: string;
    doneMessage: string;
    /** Shown in place of the form once subscribed (the early-access buy button). */
    after?: ReactNode;
    onDone?: () => void;
    /** For surfaces with a dark fill, where the field needs a light border. */
    tone?: 'light' | 'dark';
    autoFocus?: boolean;
}

export default function EmailCapture({ source, buttonLabel, doneMessage, after, onDone, tone = 'light', autoFocus }: Props) {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [subscribe, { isLoading }] = useSubscribeGenericLeadMutation();
    const id = `advent-email-${source}`;

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            await subscribe({ email, form_code: LEAD_FORM_CODE, source, lead_type: 'landing_page' }).unwrap();
            markSubscribed();
            setDone(true);
            onDone?.();
        } catch {
            setError('Something went wrong. Please check your email and try again.');
        }
    };

    if (done) {
        return (
            <div className="flex flex-col gap-4" role="status">
                <p className={`font-medium ${tone === 'dark' ? 'text-primary-text-light' : 'text-primary-text dark:text-primary-text-light'}`}>
                    {doneMessage}
                </p>
                {after}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
            <label htmlFor={id} className="sr-only">
                Email address
            </label>
            <div className="flex w-full flex-col gap-2 sm:flex-row">
                <input
                    id={id}
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus={autoFocus}
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-4 text-base text-primary-text placeholder:text-gray-500 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-900 dark:text-primary-text-light dark:placeholder:text-gray-400"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="min-h-[44px] rounded-lg bg-gradient-autumn px-6 font-medium text-primary-button-text transition-opacity hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary-light disabled:opacity-60"
                >
                    {isLoading ? 'Sending…' : buttonLabel}
                </button>
            </div>
            {error && (
                <p id={`${id}-error`} className="text-sm text-red-700 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
            <p className={`text-xs ${tone === 'dark' ? 'text-primary-text-light' : 'text-gray-600 dark:text-gray-400'}`}>
                You can unsubscribe at any time from any email.
            </p>
        </form>
    );
}
