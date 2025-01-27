'use client';

import { UserChosenLayer } from '@/types/personalized';
import CustomChocolate from './CustomChocolate';
import { useEffect } from 'react';

interface PreviewModalProps {
    layers: UserChosenLayer[];
    onClose: () => void;
}

export default function PreviewModal({ layers, onClose }: PreviewModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-2xl w-full mx-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-medium mb-2">Top View</h3>
                        <CustomChocolate layers={layers} view="top" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">Side View</h3>
                        <CustomChocolate layers={layers} view="side" />
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-100 dark:bg-gray-700 py-2 rounded-md"
                >
                    Close
                </button>
            </div>
        </div>
    );
} 