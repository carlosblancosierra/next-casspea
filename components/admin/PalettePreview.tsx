'use client';

import { useState } from 'react';

/**
 * All three palettes side by side, with real controls rather than swatches
 * alone — a colour that looks fine as a square can still be unreadable as a
 * button, which is the only way anyone actually meets it.
 *
 * Everything here is inline-styled from the palette data rather than Tailwind
 * classes, because Tailwind compiles one palette at build time and this page
 * has to show all three at once. The hex values are the same ones Tailwind
 * gets, so the colours are exact even though the components are stand-ins.
 */

type Palette = {
    name: string;
    description: string;
    colors: Record<string, string>;
    gradients: Record<string, string>;
};

interface PalettePreviewProps {
    palettes: Record<string, Palette>;
    active: string;
}

/** Relative luminance, per WCAG 2.x. */
function luminance(hex: string): number {
    const value = hex.replace('#', '');
    const full = value.length === 3 ? value.split('').map(c => c + c).join('') : value;
    const channels = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) / 255);
    const linear = channels.map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a: string, b: string): number {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
}

function ContrastBadge({ ratio, label }: { ratio: number; label: string }) {
    const passes = ratio >= 4.5;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                passes
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
            }`}
        >
            {label} {ratio.toFixed(1)}:1 {passes ? '✓' : '✗'}
        </span>
    );
}

function Swatch({ name, value }: { name: string; value: string }) {
    return (
        <div className="flex items-center gap-2">
            <span
                className="h-8 w-8 flex-shrink-0 rounded border border-black/10"
                style={{ backgroundColor: value }}
            />
            <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-primary-text dark:text-primary-text-light">
                    {name}
                </span>
                <span className="block font-mono text-[11px] uppercase text-primary-text/50 dark:text-primary-text-light/50">
                    {value}
                </span>
            </span>
        </div>
    );
}

/** A miniature of the controls this palette has to survive. */
function Sample({ palette, dark }: { palette: Palette; dark: boolean }) {
    const c = palette.colors;
    const bg = dark ? c['main-bg-dark'] : c['main-bg'];
    const text = dark ? c['primary-text-light'] : c['primary-text'];
    const border = dark ? '#ffffff22' : '#00000018';

    return (
        <div className="rounded-lg p-4" style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: text, opacity: 0.6 }}>
                {dark ? 'Dark' : 'Light'}
            </p>

            <p className="mt-2 text-lg font-bold" style={{ color: text }}>
                Luxury chocolate gifts
            </p>
            <p className="text-sm" style={{ color: text, opacity: 0.7 }}>
                Handcrafted in London
            </p>

            <button
                type="button"
                className="mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: c.primary, color: c['primary-button-text'] }}
            >
                Shop Indulgence Now!
            </button>

            <button
                type="button"
                className="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold"
                style={{ backgroundImage: palette.gradients['gradient-autumn'], color: c['primary-button-text'] }}
            >
                Continue to secure payment
            </button>

            {/* The selected/unselected pair, which is where contrast bites. */}
            <div className="mt-3 flex gap-1 rounded-lg p-1" style={{ backgroundColor: dark ? '#ffffff14' : '#00000010' }}>
                <span
                    className="flex-1 rounded-md py-1.5 text-center text-xs font-medium"
                    style={{ backgroundColor: c['primary-dark'], color: c['primary-button-text'] }}
                >
                    Ship to me
                </span>
                <span className="flex-1 py-1.5 text-center text-xs font-medium" style={{ color: text, opacity: 0.7 }}>
                    Collect in store
                </span>
            </div>

            <a className="mt-3 inline-block text-sm underline" style={{ color: dark ? c['primary-light'] : c.primary }}>
                Choose a different day
            </a>
        </div>
    );
}

export default function PalettePreview({ palettes, active }: PalettePreviewProps) {
    const [dark, setDark] = useState(false);
    const entries = Object.entries(palettes);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
                    Live palette: <strong className="text-primary-text dark:text-primary-text-light">{active}</strong>.
                    To switch the site, change <code>ACTIVE</code> in <code>theme/palettes.js</code> and redeploy —
                    Tailwind compiles one palette, so the swap is a build, not a toggle.
                </p>
                <label className="flex items-center gap-2 text-sm text-primary-text dark:text-primary-text-light">
                    <input
                        type="checkbox"
                        checked={dark}
                        onChange={e => setDark(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                    />
                    Show dark surfaces
                </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {entries.map(([key, palette]) => {
                    const onPrimary = contrast(palette.colors.primary, palette.colors['primary-button-text']);
                    const bodyText = contrast(palette.colors['main-bg'], palette.colors['primary-text']);
                    // Both gradients carry white text in real use — every money
                    // button is gradient-autumn, the units-sold counter is
                    // gradient-primary — so every stop has to hold it, not just
                    // the dark end you notice first.
                    const worstStop = Math.min(
                        ...Object.values(palette.gradients)
                            .flatMap(value => value.match(/#[0-9A-Fa-f]{6}/g) ?? [])
                            .map(stop => contrast(stop, palette.colors['primary-button-text']))
                    );

                    return (
                        <section
                            key={key}
                            className={`rounded-xl border p-4 ${
                                key === active
                                    ? 'border-primary-2 ring-1 ring-primary-2'
                                    : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <header className="mb-3">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-primary-text dark:text-primary-text-light">
                                    {palette.name}
                                    {key === active && (
                                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-button-text">
                                            live
                                        </span>
                                    )}
                                </h2>
                                <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
                                    {palette.description}
                                </p>
                                <code className="mt-1 block text-xs text-primary-text/50 dark:text-primary-text-light/50">
                                    ACTIVE = &apos;{key}&apos;
                                </code>
                            </header>

                            {/* Stated, not assumed: a button colour that fails
                                here is unreadable for real customers. */}
                            <div className="mb-3 flex flex-wrap gap-2">
                                <ContrastBadge ratio={onPrimary} label="Button text" />
                                <ContrastBadge ratio={bodyText} label="Body text" />
                                <ContrastBadge ratio={worstStop} label="Gradient worst stop" />
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-2">
                                {Object.entries(palette.colors).map(([name, value]) => (
                                    <Swatch key={name} name={name} value={value} />
                                ))}
                            </div>

                            <Sample palette={palette} dark={dark} />
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
