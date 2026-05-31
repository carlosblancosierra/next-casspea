'use client';

import { useState, useEffect } from 'react';

const MAX_LENGTH = 250;

interface GiftMessageProps {
    onGiftMessageChange: (message: string) => void;
    initialMessage?: string;
}

export default function GiftMessage({ onGiftMessageChange, initialMessage = '' }: GiftMessageProps) {
    const [message, setMessage] = useState(initialMessage);

    useEffect(() => {
        setMessage(initialMessage);
    }, [initialMessage]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value.slice(0, MAX_LENGTH);
        setMessage(val);
        onGiftMessageChange(val);
    };

    return (
        <div className="mt-1">
            <div className="space-y-1">
                <textarea
                    value={message}
                    onChange={handleChange}
                    maxLength={MAX_LENGTH}
                    placeholder="Write a personal message for the gift card (optional)"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-base
                        text-primary-text dark:text-primary-text-light bg-main-bg dark:bg-main-bg-dark
                        placeholder-gray-500 dark:placeholder-gray-400 min-h-[100px]
                        focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary
                        resize-none transition-colors duration-200"
                />
                <p className={`text-xs text-right ${message.length >= MAX_LENGTH ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    {message.length}/{MAX_LENGTH}
                </p>
            </div>
        </div>
    );
}
