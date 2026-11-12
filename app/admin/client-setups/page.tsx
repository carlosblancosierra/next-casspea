'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/components/utils';
import {
    ClientSetupLoadResult,
    ClientSetupStatus,
    useGetClientSetupsQuery,
    useLoadClientSetupMutation,
} from '@/redux/features/clients/clientSetupsApiSlice';

function StatusPill({ ok, labelOn, labelOff }: { ok: boolean; labelOn: string; labelOff: string }) {
    return (
        <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                ok
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
        >
            {ok ? labelOn : labelOff}
        </span>
    );
}

function SetupCard({ setup, onLoaded }: { setup: ClientSetupStatus; onLoaded: () => void }) {
    const [load, { isLoading }] = useLoadClientSetupMutation();
    const [dryRun, setDryRun] = useState(true);
    const [result, setResult] = useState<ClientSetupLoadResult | null>(null);

    const run = async (newCode = false) => {
        if (!dryRun) {
            const message = newCode
                ? `Give ${setup.name} a new access code? The old one stops working.`
                : `Load ${setup.name} into the database?`;
            if (!window.confirm(message)) return;
        }
        try {
            setResult(await load({ setup: setup.key, dry_run: dryRun, new_code: newCode }).unwrap());
            onLoaded();
        } catch (e: any) {
            setResult(e?.data ?? { ok: false, error: 'Request failed' });
        }
    };

    return (
        <div className="mb-8 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">{setup.name}</h2>
                <StatusPill ok={setup.page_exists} labelOn="Page created" labelOff="No page yet" />
                {setup.page_exists && (
                    <StatusPill ok={setup.has_access_code} labelOn="Code set" labelOff="No code" />
                )}
                <Link href={setup.path} className="ml-auto text-sm text-blue-600 hover:underline">
                    Open {setup.path} →
                </Link>
            </div>

            <div className="mb-4 overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm dark:border-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-3 py-2 text-left">Product</th>
                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-right">Price</th>
                            <th className="px-3 py-2 text-left">Stripe price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {setup.products.map(product => (
                            <tr key={product.slug} className="border-t border-gray-200 dark:border-gray-700">
                                <td className="px-3 py-2">{product.name}</td>
                                <td className="px-3 py-2">
                                    {product.exists ? (
                                        <StatusPill ok={product.up_to_date} labelOn="Loaded" labelOff="Out of date" />
                                    ) : (
                                        <span className="text-gray-500">Not loaded</span>
                                    )}
                                </td>
                                <td className="px-3 py-2 text-right">£{product.price}</td>
                                <td className="max-w-[180px] truncate px-3 py-2 font-mono text-xs">{product.stripe_price_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <label className="mb-4 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={dryRun} onChange={e => setDryRun(e.target.checked)} />
                Preview only (dry run, makes no changes)
            </label>

            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => run(false)}
                    disabled={isLoading}
                    className="rounded-md bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                    {isLoading ? 'Working…' : setup.page_exists ? 'Update' : 'Load'}
                </button>
                {setup.page_exists && (
                    <button
                        onClick={() => run(true)}
                        disabled={isLoading}
                        className="rounded-md bg-amber-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                    >
                        New access code
                    </button>
                )}
            </div>

            {result && (
                <div className="mt-4">
                    <p className={`font-semibold ${result.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
                        {result.ok ? `Done${result.dry_run ? ' (dry run)' : ''}` : `Failed: ${result.error ?? 'error'}`}
                    </p>
                    {result.access_code && (
                        <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                            Access code for {setup.name}:{' '}
                            <span className="select-all font-mono text-base font-bold">{result.access_code}</span>
                            <br />
                            Copy it now: it is stored encrypted and can&apos;t be shown again.
                        </div>
                    )}
                    {result.log && result.log.length > 0 && (
                        <pre className="mt-2 max-h-72 overflow-x-auto whitespace-pre-wrap rounded-md bg-gray-900 p-3 text-xs text-gray-100">
                            {result.log.join('\n')}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
}

function AdminClientSetupsInner() {
    const { data, isLoading, error, refetch } = useGetClientSetupsQuery();
    const status = error && 'status' in error ? error.status : null;

    if (status === 403) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="mb-4 text-2xl font-bold">Client pages</h1>
                <p className="text-red-600">Only super admins can load client pages.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <h1 className="mb-2 text-2xl font-bold">Client pages</h1>
            <p className="mb-6 text-sm text-primary-text dark:text-primary-text-light">
                Loads a client page, its products and an access code into the database in one go. Running it again
                updates the products and keeps the code. Super admins only.
            </p>
            {isLoading && <p>Loading…</p>}
            {data?.setups.map(setup => (
                <SetupCard key={setup.key} setup={setup} onLoaded={refetch} />
            ))}
        </div>
    );
}

export default function AdminClientSetupsPage() {
    return (
        <RequireAuth>
            <AdminClientSetupsInner />
        </RequireAuth>
    );
}
