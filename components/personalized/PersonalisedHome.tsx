'use client';

import { useGetTemplatesQuery } from '@/redux/features/personalized/personalizedApiSlice';
import Link from 'next/link';
import CustomChocolate from './CustomChocolate';
import { UserChosenLayer } from '@/types/personalized';
import { useMemo } from 'react';

export default function Personalized() {
    const { data: templates, isLoading, error } = useGetTemplatesQuery();

    const getRandomLayers = (template: any): UserChosenLayer[] => {
        return template.layers.map(slot => {
            const randomColor = slot.layer_type.colors[
                Math.floor(Math.random() * slot.layer_type.colors.length)
            ];
            return {
                chocolate_layer: {
                    layer_type: slot.layer_type,
                    color: randomColor,
                    top_image: randomColor.top_image,
                    side_image: randomColor.side_image,
                },
                order: slot.order,
            };
        });
    };

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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates?.map((template) => (
                <Link 
                    key={template.slug} 
                    href={`/personalised/${template.slug}`}
                    className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                    <div className="aspect-square mb-4">
                        <CustomChocolate 
                            layers={randomLayersMap[template.slug]} 
                            view="side"
                        />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Customize your chocolate with this template
                    </p>
                </Link>
            ))}
        </div>
    );
}
