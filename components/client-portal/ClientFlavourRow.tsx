'use client';

import Image from 'next/image';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/currency';
import { buttonClasses } from '@/components/common/Button';

interface Props {
    name: string;
    description?: string;
    image?: string | null;
    quantity: number;
    step: number;
    unitPrice: number;
    onChange: (quantity: number) => void;
}

/** Rounds to the nearest multiple of `step`, never below 0. */
export const snapToStep = (value: number, step: number): number =>
    Math.max(0, Math.round((Number.isFinite(value) ? value : 0) / step) * step);

export default function ClientFlavourRow({ name, description, image, quantity, step, unitPrice, onChange }: Props) {
    // 44px targets and no double-tap zoom: on phones the old 32px buttons
    // collected rage clicks from people adding a large order ten at a time.
    const buttonClass = buttonClasses({ variant: 'secondary', size: 'sm', className: 'touch-manipulation h-11 w-11 !px-0 !py-0' });
    // A bigger jump for corporate orders, so 100 is two taps, not ten.
    const bigStep = step * 5;

    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
            <div className="relative h-16 w-16 shrink-0">
                <Image
                    src={image || '/flavours/default.png'}
                    alt={name}
                    fill
                    sizes="64px"
                    className="object-contain"
                />
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-primary-text dark:text-primary-text-light">
                    {name}
                </h3>
                {description && (
                    <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70 line-clamp-2">
                        {description}
                    </p>
                )}
                <p className="mt-1 text-xs text-primary-text/60 dark:text-primary-text-light/60">
                    {step > 1 ? `${formatCurrency(unitPrice * step)} per ${step}` : `${formatCurrency(unitPrice)} each`}
                </p>
            </div>

            {/* Own row on phones, so the name and description get the full width. */}
            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                <button
                    type="button"
                    aria-label={`Remove ${step} ${name}`}
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
                    aria-label={`${name} quantity`}
                    value={quantity}
                    onChange={e => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    onBlur={e => onChange(snapToStep(parseInt(e.target.value, 10), step))}
                    // Selecting on focus means typing "120" replaces the value
                    // instead of appending to it.
                    onFocus={e => e.target.select()}
                    className="h-11 w-20 rounded-md text-base text-primary-text dark:text-primary-text-light border-gray-300 dark:border-gray-600 bg-main-bg dark:bg-main-bg-dark text-center shadow-sm focus:border-primary focus:ring-primary"
                />
                <button
                    type="button"
                    aria-label={`Add ${step} ${name}`}
                    className={buttonClass}
                    onClick={() => onChange(snapToStep(quantity + step, step))}
                >
                    <PlusIcon className="h-4 w-4" />
                </button>
                {step > 1 && (
                    <button
                        type="button"
                        aria-label={`Add ${bigStep} ${name}`}
                        className={buttonClasses({ variant: 'secondary', size: 'sm', className: 'touch-manipulation h-11 !py-0' })}
                        onClick={() => onChange(snapToStep(quantity + bigStep, step))}
                    >
                        +{bigStep}
                    </button>
                )}
            </div>
        </div>
    );
}
