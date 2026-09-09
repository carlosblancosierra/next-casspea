import React from 'react';

interface ChoiceCardProps {
    name: string;
    value: string;
    checked: boolean;
    onSelect: () => void;
    title: string;
    description?: string;
    /** Trailing content, e.g. a price. */
    aside?: React.ReactNode;
    /** Revealed inside the card once it is the chosen one. */
    children?: React.ReactNode;
    disabled?: boolean;
}

/**
 * One stacked, full-width choice with a real radio in it.
 *
 * Replaces the segmented tab controls this step used to have. A tab strip
 * reads as navigation — two halves of one bar, neither obviously "chosen" —
 * whereas these are the same shape as the delivery options below them, so
 * every decision on the page looks like the same kind of decision. It is also
 * what the checkouts people are used to do.
 *
 * Being a real radio rather than a styled button means the keyboard and screen
 * reader behaviour comes for free, and arrow keys move between the choices.
 */
const ChoiceCard: React.FC<ChoiceCardProps> = ({
    name,
    value,
    checked,
    onSelect,
    title,
    description,
    aside,
    children,
    disabled,
}) => (
    <label
        className={`block p-4 border rounded-lg transition-colors ${
            disabled
                ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700'
                : 'cursor-pointer hover:border-primary/50 dark:hover:bg-gray-800/50'
        } ${
            checked
                ? 'border-primary-2 ring-1 ring-primary-2'
                : 'border-gray-200 dark:border-gray-700'
        }`}
    >
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-start min-w-0">
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onSelect}
                    disabled={disabled}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary focus:ring-primary-2"
                />
                <div className="ml-3 min-w-0">
                    <p className="font-medium text-primary-text dark:text-primary-text-light">
                        {title}
                    </p>
                    {description && (
                        <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {aside}
        </div>

        {checked && children && (
            <div className="mt-4 pl-7">{children}</div>
        )}
    </label>
);

export default ChoiceCard;
