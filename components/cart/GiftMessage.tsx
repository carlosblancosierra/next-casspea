'use client';

import { useState, useEffect } from 'react';

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
        setMessage(e.target.value);
        onGiftMessageChange(e.target.value);
    };

    return (
        <div className="mt-1">
            <div className="space-y-1">
                <textarea
                    value={message}
                    onChange={handleChange}
                    placeholder="Gift message (optional)"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-base
                        text-gray-900 dark:text-gray-100 bg-main-bg dark:bg-gray-700
                        placeholder-gray-500 dark:placeholder-gray-400 min-h-[100px]
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                        resize-none transition-colors duration-200"
                />
            </div>
        </div>
    );
}
