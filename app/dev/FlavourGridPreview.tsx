'use client';

import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import FlavourNameGrid, { FlavourGridVariant } from '@/components/flavours/FlavourNameGrid';

const VARIANTS: { key: FlavourGridVariant; title: string; note: string }[] = [
    {
        key: 'caption',
        title: 'A · Caption (recommended)',
        note: 'Home-style image grid + name underneath. No borders, cleanest. 3 cols on mobile.',
    },
    {
        key: 'tile',
        title: 'B · Tile',
        note: 'Each flavour in a soft rounded card. More structure — good if packshot backgrounds vary.',
    },
    {
        key: 'overlay',
        title: 'C · Overlay',
        note: 'Name over a gradient at the bottom of the image. Most editorial, densest.',
    },
];

export default function FlavourGridPreview() {
    const { data: flavours, isLoading, error } = useGetFlavoursQuery();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-primary-text dark:text-primary-text-light">
                Flavours grid — options
            </h1>
            <p className="mt-1 text-sm text-primary-text/70 dark:text-primary-text-light/70">
                3 columns on mobile, tap a flavour for its description &amp; allergens. Resize the
                window or open on a phone to check the mobile layout.
            </p>

            {isLoading && <div className="py-12 text-center">Loading…</div>}
            {error && <div className="py-12 text-center text-red-500">Error loading flavours.</div>}

            {flavours &&
                VARIANTS.map(v => (
                    <section key={v.key} className="mt-12">
                        <div className="border-b border-black/10 dark:border-white/10 pb-2 mb-6">
                            <h2 className="text-lg font-bold text-primary-text dark:text-primary-text-light">
                                {v.title}
                            </h2>
                            <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
                                {v.note}
                            </p>
                        </div>
                        <FlavourNameGrid flavours={flavours} variant={v.key} />
                    </section>
                ))}
        </div>
    );
}
