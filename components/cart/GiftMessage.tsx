'use client';

import { useState } from 'react';

interface GiftMessageProps {
    onGiftMessageChange: (message: string) => void;
}

export default function GiftMessage({ onGiftMessageChange }: GiftMessageProps) {
    const [message, setMessage] = useState('');

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
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-xs
                        text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                        placeholder-gray-500 dark:placeholder-gray-400 min-h-[100px]
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
            </div>
        </div>
    );
}
