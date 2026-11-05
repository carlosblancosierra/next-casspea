'use client';

import Image from 'next/image';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Flavour } from '@/types/flavours';
import { formatCurrency } from '@/utils/currency';

interface Props {
    flavour: Flavour;
    quantity: number;
    step: number;
    unitPrice: number;
    onChange: (quantity: number) => void;
}

/** Rounds to the nearest multiple of `step`, never below 0. */
export const snapToStep = (value: number, step: number): number =>
    Math.max(0, Math.round((Number.isFinite(value) ? value : 0) / step) * step);

export default function ClientFlavourRow({ flavour, quantity, step, unitPrice, onChange }: Props) {
    const buttonClass =
        'p-2 bg-gray-200 dark:bg-main-bg-dark rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors';

    return (
        <div className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0">
                <Image
                    src={flavour.thumbnail || flavour.image || '/flavours/default.png'}
                    alt={flavour.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                />
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-primary-text dark:text-primary-text-light">
                    {flavour.name}
                </h3>
                {flavour.mini_description && (
                    <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70 line-clamp-2">
                        {flavour.mini_description}
                    </p>
                )}
                <p className="mt-1 text-xs text-primary-text/60 dark:text-primary-text-light/60">
                    {formatCurrency(unitPrice * step)} per {step}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    aria-label={`Remove ${step} ${flavour.name}`}
                    className={buttonClass}
                    disabled={quantity <= 0}
                    onClick={() => onChange(snapToStep(quantity - step, step))}
                >
                    <MinusIcon className="h-4 w-4" />
                </button>
                <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={step}
                    aria-label={`${flavour.name} quantity`}
                    value={quantity}
                    onChange={e => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    onBlur={e => onChange(snapToStep(parseInt(e.target.value, 10), step))}
                    className="w-16 rounded-md border-gray-300 dark:border-gray-600 bg-main-bg dark:bg-main-bg-dark text-center shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
                <button
                    type="button"
                    aria-label={`Add ${step} ${flavour.name}`}
                    className={buttonClass}
                    onClick={() => onChange(snapToStep(quantity + step, step))}
                >
                    <PlusIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
