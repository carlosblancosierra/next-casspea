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
        <div className="mt-4 border border-gray-200 dark:border-gray-700 p-4 rounded-md
            bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Gift Message
            </h3>
            <div className="space-y-1">
                <textarea
                    value={message}
                    onChange={handleChange}
                    placeholder="Add a gift message (optional)"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
                        text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700
                        placeholder-gray-500 dark:placeholder-gray-400 min-h-[100px]
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
            </div>
        </div>
    );
}
