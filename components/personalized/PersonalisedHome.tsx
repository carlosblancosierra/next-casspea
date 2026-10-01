'use client';

import { useGetTemplatesQuery } from '@/redux/features/personalized/personalizedApiSlice';
import Link from 'next/link';
import CustomChocolate from './CustomChocolate';
import { UserChosenLayer } from '@/types/personalized';
import { getRandomLayers } from '@/utils/getRandomLayers';
import { useMemo } from 'react';

export interface PersonalisedProps {
  theme?: 'gold' | 'blue';
}

export default function Personalized({ theme = 'blue' }: PersonalisedProps) {
    const { data: templates, isLoading, error } = useGetTemplatesQuery();

    // Generate random layers for each template once when templates load
    const randomLayersMap = useMemo(() => {
        const map: Record<string, UserChosenLayer[]> = {};
        templates?.forEach(template => {
            map[template.slug] = getRandomLayers(template);
        });
        return map;
    }, [templates]);

    if (isLoading) return <div>Loading templates...</div>;
    if (error) return <div>Error loading templates</div>;

    return (
        // Sized and spaced like ProductCard, so the personalised row and the
        // signature-box row read as one grid rather than two. The old card was
        // p-4/gap-4 with an xl title and a filler line under it, which made it
        // roughly twice the height of the box cards beside it.
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-2">
            {templates?.map((template) => (
                <Link
                    key={template.slug}
                    href={`/personalised/${template.slug}`}
                    className="block group p-2 border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-main-bg-dark rounded-lg shadow-lg hover:opacity-90 transition-opacity"
                >
                    <div className="aspect-square">
                        <CustomChocolate
                            layers={randomLayersMap[template.slug]}
                            view="side"
                        />
                    </div>
                    <h3 className="mt-4 text-xs md:text-sm h-12 text-primary-text dark:text-primary-text-light">
                        {template.title}
                    </h3>
                </Link>
            ))}
        </div>
    );
}
