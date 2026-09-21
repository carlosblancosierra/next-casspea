'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Flavour } from '@/types/flavours';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';

export type FlavourGridVariant = 'caption' | 'tile' | 'overlay';

interface FlavourNameGridProps {
    flavours: Flavour[];
    /** Visual treatment for each cell. Default: 'caption' (cleanest). */
    variant?: FlavourGridVariant;
    /**
     * When true, tapping a flavour opens a modal with the full card
     * (description + allergens). Default: true.
     */
    openOnClick?: boolean;
    /**
     * Show a short description under the name on desktop. Hidden below `md`,
     * where three columns leave no room for it.
     */
    showDescription?: boolean;
}

// 3 columns on mobile -> 4 -> 5 -> 6, matching the home grid's density on
// larger screens while staying readable with names on phones. Tight row gap so
// names can run to 3 lines without the rows drifting far apart.
const GRID = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-4 sm:gap-x-4 max-w-6xl mx-auto';

// Each cell spans three rows of the parent grid — image, name, description —
// and subgrids onto them, so within a row every name gets the height of the
// tallest name in *that* row and the descriptions below them line up. A row of
// short names stays tight; only the rows that need the space take it.
//
// Tailwind here is 3.3, which has no `grid-rows-subgrid` utility, hence the
// arbitrary value. Where subgrid is unsupported the declaration is ignored and
// the layout is what it was before — a fallback, not a break.
// The button IS the cell — no wrapper div, because a wrapper would become one
// grid item in the first track and the subgrid would have nothing to align.
// gap-0 flattens the parent's row gutter inside a cell; the gutter between one
// row of cells and the next is outside every cell's span, so it survives.
const CELL_SUBGRID = 'row-span-3 grid grid-rows-[subgrid] gap-0';

// Images are packshots of different native sizes; sizes hint keeps next/image
// from over-fetching for the ~3-per-row mobile layout.
const IMG_SIZES = '(min-width:1024px) 16vw, (min-width:768px) 20vw, (min-width:640px) 25vw, 33vw';

// Up to 3 lines, then ellipsis, so long names ("64% Colombian Dark Chocolate
// Ganache") aren't cut mid-word.
const NAME_BASE =
    'text-center font-semibold leading-tight line-clamp-3 text-xs sm:text-sm text-primary-text dark:text-primary-text-light';

const DESC =
    'hidden md:block mt-1 text-center text-[11px] leading-snug line-clamp-2 text-primary-text/70 dark:text-primary-text-light/70';

function FlavourImage({ flavour, className = '' }: { flavour: Flavour; className?: string }) {
    return (
        <Image
            src={flavour.image || flavour.thumbnail || '/flavours/default.png'}
            alt={flavour.name || 'Flavour'}
            fill
            sizes={IMG_SIZES}
            className={`object-contain ${className}`}
            loading="lazy"
        />
    );
}

export default function FlavourNameGrid({
    flavours,
    variant = 'caption',
    openOnClick = true,
    showDescription = false,
}: FlavourNameGridProps) {
    // The server passes a snapshot; the client query keeps it live so admin
    // changes show without waiting for a rebuild. Same pattern the box
    // builders use, and what the home grid relied on before it used this.
    const { data } = useGetFlavoursQuery();
    const list = data ?? flavours;
    const [selected, setSelected] = useState<Flavour | null>(null);

    const handleClick = (f: Flavour) => openOnClick && setSelected(f);

    return (
        <>
            <div className={GRID}>
                {list.map(flavour => {
                    // Overlay puts the name on top of the image, so it is one
                    // box and has nothing to align; the other two are three
                    // stacked pieces and subgrid onto the parent's rows.
                    const isOverlay = variant === 'overlay';

                    const chrome =
                        variant === 'tile'
                            ? 'rounded-xl bg-main-bg dark:bg-main-bg-dark ring-1 ring-black/5 dark:ring-white/10 shadow-sm hover:shadow-md transition-shadow p-2 sm:p-3'
                            : 'rounded-xl';

                    return (
                        <button
                            key={flavour.id}
                            type="button"
                            onClick={() => handleClick(flavour)}
                            aria-label={flavour.name}
                            className={`group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${chrome} ${
                                isOverlay ? 'row-span-3' : CELL_SUBGRID
                            } ${openOnClick ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {isOverlay ? (
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-primary-light/20 to-primary/10 dark:from-white/10 dark:to-white/0">
                                    <FlavourImage flavour={flavour} className="p-2" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-1.5 pt-6 pb-1.5">
                                        <h3 className="text-center font-semibold leading-tight line-clamp-2 text-[11px] sm:text-xs text-white">
                                            {flavour.name}
                                        </h3>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="relative aspect-square rounded-lg overflow-hidden group-hover:opacity-90 transition-opacity">
                                        <FlavourImage flavour={flavour} />
                                    </div>
                                    <h3 className={`${NAME_BASE} mt-1.5`}>{flavour.name}</h3>
                                    {/* Rendered even when empty, so the third
                                        track exists for every cell in the row
                                        and the ones that do have text line up. */}
                                    <p className={DESC}>
                                        {showDescription ? flavour.mini_description || flavour.description : ''}
                                    </p>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="relative bg-main-bg dark:bg-main-bg-dark rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 z-10 text-3xl leading-none text-primary-text dark:text-primary-text-light hover:opacity-70"
                            onClick={() => setSelected(null)}
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        {/* Big image — the point of opening the modal */}
                        <div className="relative w-full h-64 sm:h-72">
                            <Image
                                src={selected.image || selected.thumbnail || '/flavours/default.png'}
                                alt={selected.name}
                                fill
                                sizes="(min-width:640px) 28rem, 90vw"
                                className="object-contain"
                            />
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-center text-primary-text dark:text-primary-text-light">
                            {selected.name}
                        </h3>

                        {selected.description && (
                            <p className="mt-2 text-sm text-center text-primary-text/80 dark:text-primary-text-light/80">
                                {selected.description}
                            </p>
                        )}

                        {selected.allergens && selected.allergens.length > 0 && (
                            <p className="mt-4 text-[11px] uppercase tracking-wide text-center text-primary-text/60 dark:text-primary-text-light/60">
                                {selected.allergens.map(a => a.name).join(' · ')}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
