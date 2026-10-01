import React, { forwardRef } from 'react';

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
    id: string;
    label?: React.ReactNode;
    /** Rendered on the right of the label row, e.g. a "Forgot password?" link. */
    labelAction?: React.ReactNode;
    error?: string;
    containerClassName?: string;
}

// Every colour is declared as a light/dark pair. The app runs Tailwind's
// `media` dark strategy with a manually-paired palette, so an element that sets
// only `text-primary-text` (#000) renders black on #0a0c10 in dark mode.
const LABEL =
    'block text-sm font-medium leading-6 text-primary-text dark:text-primary-text-light';

const FIELD = [
    'block w-full rounded-md border-0 py-1.5 px-3 text-base sm:leading-6 shadow-sm',
    'text-primary-text dark:text-primary-text-light',
    'bg-main-bg dark:bg-main-bg-dark',
    'ring-1 ring-inset ring-gray-300 dark:ring-gray-600',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'focus:ring-2 focus:ring-inset focus:ring-primary',
    'disabled:opacity-60 disabled:cursor-not-allowed',
].join(' ');

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { id, label, labelAction, error, containerClassName = '', className = '', ...rest },
    ref,
) {
    return (
        <div className={containerClassName}>
            {(label || labelAction) && (
                <div className="flex justify-between items-center">
                    {label && (
                        <label htmlFor={id} className={LABEL}>
                            {label}
                        </label>
                    )}
                    {labelAction && <div className="text-sm">{labelAction}</div>}
                </div>
            )}
            <div className={label || labelAction ? 'mt-2' : ''}>
                <input
                    ref={ref}
                    id={id}
                    name={rest.name ?? id}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`${FIELD} ${className}`}
                    {...rest}
                />
            </div>
            {error && (
                <p id={`${id}-error`} className="mt-1 text-sm text-my-red dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;
