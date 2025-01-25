'use client';

import { useGetTemplatesQuery } from '@/redux/features/personalized/personalizedApiSlice';
import Link from 'next/link';

export default function Personalized() {
    const { data: templates, isLoading, error } = useGetTemplatesQuery();

    if (isLoading) return <div>Loading templates...</div>;
    if (error) return <div>Error loading templates</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {templates?.map((template) => (
                <Link 
                    key={template.slug} 
                    href={`/personalized/${template.slug}`}
                    className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Customize your chocolate with this template
                    </p>
                </Link>
            ))}
        </div>
    );
}
