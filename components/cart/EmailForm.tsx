'use client';

import { useState, useEffect } from 'react';
import { useValidateEmail as validateEmail } from '@/utils/useValidateEmail';

interface EmailFormProps {
    onValidEmail: (email: string) => void;
    initialEmail?: string;
}

export default function EmailForm({ onValidEmail, initialEmail = '' }: EmailFormProps) {
    const [email, setEmail] = useState(initialEmail);
    const [isValid, setIsValid] = useState(true);

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
        // Don't nag while the user is still typing
        setIsValid(true);
        if (validateEmail(newEmail)) {
            onValidEmail(newEmail);
        }
    };

    const handleBlur = () => {
        setIsValid(email === '' || validateEmail(email));
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
                    onBlur={handleBlur}
                    placeholder="Enter your email address"
                    className={`w-full border rounded-md px-3 py-2
                        text-primary-text dark:text-primary-text-light
                        bg-main-bg dark:bg-main-bg-dark text-base
                        placeholder-gray-500 dark:placeholder-gray-400
                        ${!isValid ? 'border-red-500 dark:border-red-400' :
                            'border-gray-300 dark:border-gray-600'}
                        focus:outline-none focus:ring-2
                        focus:ring-blue-500 dark:focus:ring-blue-400`}
                    required
                />
                {!isValid && (
                    <p role="alert" className="text-red-600 dark:text-red-400 text-sm">
                        Please enter a valid email address
                    </p>
                )}
            </div>
        </div>
    );
}
