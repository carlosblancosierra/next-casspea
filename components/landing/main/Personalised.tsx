'use client';

import { useGetTemplatesQuery } from '@/redux/features/personalized/personalizedApiSlice';
import Link from 'next/link';
import CustomChocolate from '@/components/personalized/CustomChocolate';
import { UserChosenLayer } from '@/types/personalized';
import { getRandomLayers } from '@/utils/getRandomLayers';
import { useMemo } from 'react';

interface PersonalisedProps { config: typeof import('../constants').LANDING_CONFIG.gold; }

export default function Personalised({ config }: PersonalisedProps) {
    const { data: templates, isLoading, error } = useGetTemplatesQuery();

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
        <div className="space-y-8">
            {/* Texto introductorio */}
            <div className="text-center max-w-3xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    {config.personalisedText.heading}
                </h2>
                <p className="text-primary-text dark:text-primary-text-light text-lg leading-relaxed mb-2">
                    {config.personalisedText.subheading}
                </p>
                {/* <ColoredList
                  items={config.personalisedText.steps.map((step, i) => ({
                    text: step,
                    colorKey: config.personalisedColors[i % config.personalisedColors.length],
                  }))}
                /> */}
            </div>

            {/* Grid de plantillas */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates?.map((template) => (
                    <Link 
                        key={template.slug} 
                        href={`/personalised/${template.slug}`}
                        className="block p-4 bg-main-bg dark:bg-main-bg-dark rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                        <div className="aspect-square mb-4">
                            <CustomChocolate 
                                layers={randomLayersMap[template.slug]} 
                                view="side"
                            />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
                        <p className="text-primary-text dark:text-primary-text-light">
                            {config.personalisedText.templateCardLabel}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}