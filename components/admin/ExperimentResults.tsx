'use client';

import { useGetExperimentResultsQuery } from '@/redux/features/experiments/experimentApiSlice';
import { BOX_BUILDER_EXPERIMENT } from '@/types/experiments';
import Spinner from '@/components/common/Spinner';

/**
 * Roughly what a two-sided test at 95% confidence and 80% power needs per
 * arm, at a ~3% baseline order rate. Stated up front because reading an A/B
 * test early is the usual way one gets called wrong: with a hundred visitors
 * a side, the arm that is "winning" is almost always just noise.
 */
const VISITORS_PER_VARIANT_FOR_1PP = 4700;

const pct = (value: number | null) =>
    value === null ? '—' : `${(value * 100).toFixed(1)}%`;

export default function ExperimentResults() {
    const { data, isLoading, error } = useGetExperimentResultsQuery(BOX_BUILDER_EXPERIMENT, {
        refetchOnMountOrArgChange: true,
    });

    if (isLoading) {
        return <div className="flex justify-center py-12"><Spinner md /></div>;
    }

    if (error || !data) {
        return (
            <p className="text-primary-text dark:text-primary-text-light">
                Couldn&apos;t load the experiment. It may not exist yet — load the
                <code className="mx-1">box_builder_experiment</code> fixture on the API.
            </p>
        );
    }

    const smallest = data.variants.length
        ? Math.min(...data.variants.map(v => v.visitors))
        : 0;
    const enoughData = smallest >= VISITORS_PER_VARIANT_FOR_1PP;
    const leader = [...data.variants]
        .filter(v => v.order_rate !== null)
        .sort((a, b) => (b.order_rate ?? 0) - (a.order_rate ?? 0))[0];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-primary-text dark:text-primary-text-light">
                    {data.name}
                </h2>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    data.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                    {data.active ? 'Running' : 'Off — everyone sees control'}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                            <th className="py-2 pr-4 font-medium text-primary-text dark:text-primary-text-light">Variant</th>
                            <th className="py-2 pr-4 font-medium text-primary-text dark:text-primary-text-light">Visitors</th>
                            <th className="py-2 pr-4 font-medium text-primary-text dark:text-primary-text-light">Added to cart</th>
                            <th className="py-2 pr-4 font-medium text-primary-text dark:text-primary-text-light">Paid orders</th>
                            <th className="py-2 pr-4 font-medium text-primary-text dark:text-primary-text-light">Order rate</th>
                            <th className="py-2 pr-4 font-medium text-primary-text dark:text-primary-text-light">Revenue</th>
                            <th className="py-2 font-medium text-primary-text dark:text-primary-text-light">Per visitor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.variants.map(row => (
                            <tr key={row.variant} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-2 pr-4 font-medium text-primary-text dark:text-primary-text-light">
                                    {row.variant}
                                    {row.variant === 'control' && (
                                        <span className="ml-2 text-xs text-primary-text/60 dark:text-primary-text-light/60">
                                            (current builder)
                                        </span>
                                    )}
                                </td>
                                <td className="py-2 pr-4 text-primary-text dark:text-primary-text-light">{row.visitors}</td>
                                <td className="py-2 pr-4 text-primary-text dark:text-primary-text-light">
                                    {row.add_to_carts} <span className="text-primary-text/60 dark:text-primary-text-light/60">({pct(row.add_to_cart_rate)})</span>
                                </td>
                                <td className="py-2 pr-4 text-primary-text dark:text-primary-text-light">{row.orders}</td>
                                <td className="py-2 pr-4 text-primary-text dark:text-primary-text-light">{pct(row.order_rate)}</td>
                                <td className="py-2 pr-4 text-primary-text dark:text-primary-text-light">£{row.revenue}</td>
                                <td className="py-2 text-primary-text dark:text-primary-text-light">
                                    {row.revenue_per_visitor ? `£${row.revenue_per_visitor}` : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Deliberately placed where the numbers are, not in a footnote. */}
            <div className={`rounded-md border p-4 ${
                enoughData
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
            }`}>
                {enoughData ? (
                    <p className="text-sm text-green-800 dark:text-green-200">
                        Enough traffic to call a difference of about 1 percentage point.
                        {leader && <> <strong>{leader.variant}</strong> currently has the higher order rate.</>}
                    </p>
                ) : (
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Not enough data yet.</strong> The smaller arm has {smallest} visitors;
                        roughly {VISITORS_PER_VARIANT_FOR_1PP.toLocaleString()} per variant are needed
                        to tell a 1 percentage point change from noise. Whichever side is ahead right
                        now, it is probably chance — leave it running.
                    </p>
                )}
            </div>

            <p className="text-xs text-primary-text/60 dark:text-primary-text-light/60">
                Orders are joined from the visitor&apos;s session to the paid order, on the server.
                Nothing here depends on cookies being accepted or on the browser surviving the trip
                to Stripe. Turn the test off in Django admin to send everyone back to the current builder.
            </p>
        </div>
    );
}
