import React from 'react';

// Minimal table styling with correct dark borders, so the orders table does not
// become a fourth differently-styled raw <table> in the codebase.

export function Table({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className={`min-w-full text-sm ${className}`}>{children}</table>
        </div>
    );
}

export function THead({ children }: { children: React.ReactNode }) {
    return (
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-primary-text/60 dark:bg-gray-800 dark:text-primary-text-light/60">
            {children}
        </thead>
    );
}

export function TBody({ children }: { children: React.ReactNode }) {
    return <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>;
}

export function TR({
    children,
    onClick,
    className = '',
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    const interactive = onClick
        ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60'
        : '';
    return (
        <tr onClick={onClick} className={`${interactive} ${className}`}>
            {children}
        </tr>
    );
}

export function TH({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
    return <th scope="col" className={`whitespace-nowrap px-3 py-2 font-medium ${className}`}>{children}</th>;
}

export function TD({
    children,
    className = '',
    onClick,
}: {
    children?: React.ReactNode;
    className?: string;
    /** For a cell whose own control must not trigger the row's click. */
    onClick?: React.MouseEventHandler<HTMLTableCellElement>;
}) {
    return (
        <td
            onClick={onClick}
            className={`px-3 py-2 text-primary-text dark:text-primary-text-light ${className}`}
        >
            {children}
        </td>
    );
}
