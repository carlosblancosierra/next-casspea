'use client';

import { useState, useEffect } from 'react';

interface EmailFormProps {
    /** Fires on every change with the raw value (valid or not). */
    onChange?: (email: string) => void;
    /** Fires only when the current value is a valid email. */
    onValidEmail?: (email: string) => void;
    initialEmail?: string;
    /** Let the parent mark the field invalid (e.g. after a failed submit). */
    invalid?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailForm({ onChange, onValidEmail, initialEmail = '', invalid = false }: EmailFormProps) {
    const [email, setEmail] = useState(initialEmail);

    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
            onChange?.(initialEmail);
            if (EMAIL_RE.test(initialEmail)) onValidEmail?.(initialEmail);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialEmail]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        onChange?.(newEmail);
        if (EMAIL_RE.test(newEmail)) onValidEmail?.(newEmail);
    };

    return (
        <div className="mt-4">
            <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className={`w-full border rounded-md px-3 py-2 text-base
                    text-gray-900 dark:text-primary-text-light
                    bg-white dark:bg-main-bg-dark
                    placeholder-gray-400 dark:placeholder-gray-500
                    ${invalid ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
                    focus:outline-none focus:ring-2 focus:ring-primary-2 dark:focus:ring-primary-2`}
                required
            />
        </div>
    );
}
