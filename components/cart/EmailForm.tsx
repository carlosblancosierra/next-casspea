'use client';

import { useState } from 'react';

interface EmailFormProps {
    onEmailSubmit: (email: string) => void;
    initialEmail?: string;
}

export default function EmailForm({ onEmailSubmit, initialEmail = '' }: EmailFormProps) {
    const [email, setEmail] = useState(initialEmail);
    const [isValid, setIsValid] = useState(true);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsValid(true);
        if (validateEmail(newEmail)) {
            onEmailSubmit(newEmail);
        }
    };

    return (
        <div className="mt-4
            bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Contact Email
            </h3>
            <div className="space-y-1">
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    className={`w-full border rounded-md px-3 py-2
                        text-gray-900 dark:text-gray-100
                        bg-white dark:bg-gray-700
                        placeholder-gray-500 dark:placeholder-gray-400
                        ${!isValid ? 'border-red-500 dark:border-red-400' :
                            'border-gray-300 dark:border-gray-600'}
                        focus:outline-none focus:ring-2
                        focus:ring-blue-500 dark:focus:ring-blue-400`}
                    required
                />
                {!isValid && (
                    <p className="text-red-500 dark:text-red-400 text-sm">
                        Please enter a valid email address
                    </p>
                )}
            </div>
        </div>
    );
}
