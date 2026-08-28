'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RequireAuth } from '@/components/utils';
import {
    useGetSummerBreakStatusQuery,
    useRunSummerBreakActionMutation,
    SummerBreakAction,
    SummerBreakActionResult,
} from '@/redux/features/products/summerBreakApiSlice';

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

function AdminSummerBreakInner() {
    const { data: status, isLoading, error, refetch } = useGetSummerBreakStatusQuery();
    const [runAction, { isLoading: running }] = useRunSummerBreakActionMutation();
    const [dryRun, setDryRun] = useState(true);
    const [result, setResult] = useState<SummerBreakActionResult | null>(null);

    const isForbidden = error && 'status' in error && (error as any).status === 403;

    const handle = async (action: SummerBreakAction, confirmMsg?: string) => {
        if (!dryRun && confirmMsg && !window.confirm(confirmMsg)) return;
        try {
            const res = await runAction({ action, dry_run: dryRun }).unwrap();
            setResult(res);
            refetch();
        } catch (e: any) {
            setResult(e?.data ?? { ok: false, action, output: '', error: 'Request failed' });
        }
    };

    if (isForbidden) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">Summer Break Boxes</h1>
                <p className="text-red-600">You need to be signed in as an admin to manage these.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-2">Summer Break Boxes</h1>
            <p className="text-sm text-primary-text dark:text-primary-text-light mb-6">
                Create the 25%-off clearance boxes (and their Stripe prices), publish them to the shop, or hide them —
                the same work as the <code>load_summer_break_boxes</code> command, no server access needed.
            </p>

            {isLoading && <p>Loading status…</p>}

            {status && (
                <>
                    {/* Category status */}
                    <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="font-semibold">Category:</span>
                            <StatusPill ok={status.category.exists} labelOn="Created" labelOff="Not created" />
                            <StatusPill ok={status.category.published} labelOn="Visible in shop" labelOff="Hidden (link-only)" />
                            <Link href={status.landing_path} className="ml-auto text-blue-600 hover:underline text-sm">
                                Open test landing →
                            </Link>
                        </div>
                    </div>

                    {/* Boxes table */}
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-3 py-2 text-left">Box</th>
                                    <th className="px-3 py-2 text-left">Status</th>
                                    <th className="px-3 py-2 text-right">Price</th>
                                    <th className="px-3 py-2 text-right">Was</th>
                                    <th className="px-3 py-2 text-left">Stripe price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {status.boxes.map(box => (
                                    <tr key={box.slug} className="border-t border-gray-200 dark:border-gray-700">
                                        <td className="px-3 py-2">{box.units} pieces</td>
                                        <td className="px-3 py-2">
                                            {box.exists
                                                ? <StatusPill ok={box.active && !box.sold_out} labelOn="Live" labelOff="Hidden" />
                                                : <span className="text-gray-500">—</span>}
                                        </td>
                                        <td className="px-3 py-2 text-right">{box.price ? `£${box.price}` : '—'}</td>
                                        <td className="px-3 py-2 text-right text-gray-500 line-through">
                                            {box.compare_at_price ? `£${box.compare_at_price}` : ''}
                                        </td>
                                        <td className="px-3 py-2 font-mono text-xs truncate max-w-[160px]">
                                            {box.stripe_price_id ?? '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Controls */}
                    <label className="flex items-center gap-2 mb-4 text-sm">
                        <input type="checkbox" checked={dryRun} onChange={e => setDryRun(e.target.checked)} />
                        Preview only (dry run — makes no changes)
                    </label>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handle('load', 'Create/update the Summer Break boxes and their Stripe prices?')}
                            disabled={running}
                            className="px-4 py-2 rounded-md bg-primary text-white font-semibold disabled:opacity-50"
                        >
                            {running ? 'Working…' : 'Create / update boxes'}
                        </button>
                        <button
                            onClick={() => handle('publish', 'Publish the Summer Break category so it shows in the shop?')}
                            disabled={running || !status.category.exists}
                            className="px-4 py-2 rounded-md bg-green-600 text-white font-semibold disabled:opacity-50"
                        >
                            Publish to shop
                        </button>
                        <button
                            onClick={() => handle('deactivate', 'Hide all Summer Break boxes from the shop?')}
                            disabled={running || !status.category.exists}
                            className="px-4 py-2 rounded-md bg-amber-600 text-white font-semibold disabled:opacity-50"
                        >
                            Hide boxes
                        </button>
                    </div>
                </>
            )}

            {/* Result / log */}
            {result && (
                <div className="mt-6">
                    <p className={`font-semibold ${result.ok ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>
                        {result.ok ? `Done: ${result.action}${result.dry_run ? ' (dry run)' : ''}` : `Failed: ${result.error ?? 'error'}`}
                    </p>
                    {result.output && (
                        <pre className="mt-2 whitespace-pre-wrap rounded-md bg-gray-900 text-gray-100 text-xs p-3 overflow-x-auto max-h-72">
                            {result.output}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AdminSummerBreakPage() {
    return (
        <RequireAuth>
            <AdminSummerBreakInner />
        </RequireAuth>
    );
}
