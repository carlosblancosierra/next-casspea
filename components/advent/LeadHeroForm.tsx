'use client';

import { useEffect, useState, type ReactNode } from 'react';
import EmailCapture from './EmailCapture';
import { COPY } from './content';
import { hasSubscribed } from './subscribed';

/**
 * The early-access hero: the email form first, the buy button once the
 * visitor has signed up (now, or on an earlier visit from this browser).
 */
export default function LeadHeroForm({ buyButton }: { buyButton: ReactNode }) {
    const [returning, setReturning] = useState(false);
    useEffect(() => setReturning(hasSubscribed()), []);

    if (returning) return <div>{buyButton}</div>;

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <h2 className="font-playfair text-2xl font-bold text-primary-text dark:text-primary-text-light">{COPY.lead.heading}</h2>
            <p className="text-gray-700 dark:text-gray-300">{COPY.lead.body}</p>
            <EmailCapture source="early-access" buttonLabel={COPY.lead.button} doneMessage={COPY.lead.done} after={buyButton} />
        </div>
    );
}
