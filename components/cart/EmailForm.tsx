'use client';

import { useState, useEffect } from 'react';

interface EmailFormProps {
    onValidEmail: (email: string) => void;
    initialEmail?: string;
}

export default function EmailForm({ onValidEmail, initialEmail = '' }: EmailFormProps) {
    const [email, setEmail] = useState(initialEmail);
    const [isValid, setIsValid] = useState(true);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    useEffect(() => {
        if (initialEmail) {
            setEmail(initialEmail);
            if (validateEmail(initialEmail)) {
                setIsValid(true);
                onValidEmail(initialEmail);
            }
        }
    }, [initialEmail, onValidEmail]);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsValid(true);
        if (validateEmail(newEmail)) {
            onValidEmail(newEmail);
        }
    };

    return (
        <div className="mt-4">
            <div className="space-y-1">
                <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    className={`w-full border rounded-md px-3 py-2
                        text-primary-text dark:text-primary-text
                        bg-main-bg dark:bg-main-bg-dark text-base
                        placeholder-gray-500 dark:placeholder-gray-400
                        ${!isValid ? 'border-red-500 dark:border-red-400' :
                            'border-gray-300 dark:border-gray-600'}
                        focus:outline-none focus:ring-2
                        focus:ring-blue-500 dark:focus:ring-blue-400`}
                    required
                />
                {!isValid && (
                    <p className="text-primary-text text-sm">
                        Please enter a valid email address
                    </p>
                )}
            </div>
        </div>
    );
}
