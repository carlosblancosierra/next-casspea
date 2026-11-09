'use client';

import { FormEvent, useState } from 'react';
import { Playfair_Display } from 'next/font/google';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useUnlockClientPageMutation } from '@/redux/features/clients/clientApiSlice';
import { LockedClientPage } from '@/types/clients';
import ClientLogos from './ClientLogos';

const playfair = Playfair_Display({ subsets: ['latin'] });

/** Code screen shown until the visitor enters the code we gave the client. */
export default function ClientAccessGate({ page }: { page: LockedClientPage }) {
    const [code, setCode] = useState('');
    const [unlock, { isLoading, error }] = useUnlockClientPageMutation();

    const status = error && 'status' in error ? error.status : null;
    const message =
        status === 429
            ? 'Too many attempts. Please wait a minute and try again.'
            : error
              ? 'That code is not right. Please check it and try again.'
              : null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (code.trim()) unlock({ slug: page.slug, code: code.trim() });
    };

    return (
        <div className="py-12">
            <div
                className="mx-auto max-w-md overflow-hidden rounded-xl border-l-8 bg-main-bg shadow-lg dark:bg-main-bg-dark"
                style={{ borderLeftColor: page.brand_color || undefined }}
            >
                <div className="flex justify-center bg-gradient-primary px-6 py-8">
                    <ClientLogos name={page.name} logo={page.logo} brandColor={page.brand_color} />
                </div>
                <form onSubmit={handleSubmit} className="p-6 text-center">
                    <p className="text-xs uppercase tracking-widest text-primary-text/60 dark:text-primary-text-light/60">
                        Private collection
                    </p>
                    <h1 className={`${playfair.className} mb-2 text-3xl font-bold text-primary-text dark:text-primary-text-light`}>
                        {page.name}
                    </h1>
                    <p className="mb-6 text-sm text-primary-text/70 dark:text-primary-text-light/70">
                        Enter the access code we sent you to see your chocolates.
                    </p>
                    <label htmlFor="client-code" className="sr-only">
                        Access code
                    </label>
                    <input
                        id="client-code"
                        type="text"
                        autoComplete="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        placeholder="Access code"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        aria-invalid={Boolean(message)}
                        aria-describedby={message ? 'client-code-error' : undefined}
                        className="block w-full rounded-md border-gray-300 bg-main-bg text-center tracking-widest shadow-sm focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-main-bg-dark dark:text-primary-text-light"
                    />
                    {message && (
                        <p id="client-code-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading || !code.trim()}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-autumn py-3 text-lg font-semibold text-primary-text-light shadow transition-opacity hover:opacity-95 disabled:opacity-60 dark:bg-primary-2"
                    >
                        <LockClosedIcon className="h-5 w-5" />
                        {isLoading ? 'Checking…' : 'Enter'}
                    </button>
                </form>
            </div>
        </div>
    );
}
