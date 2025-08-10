'use client';

import { useGetTemplatesQuery } from '@/redux/features/personalized/personalizedApiSlice';
import Link from 'next/link';
import CustomChocolate from '@/components/personalized/CustomChocolate';
import { UserChosenLayer } from '@/types/personalized';
import { useMemo } from 'react';
import { PERSONALISED_TEXT } from '../constants';
import ColoredList from '@/components/common/ColoredList';
import { PERSONALISED_STEPS_BLUE_COLORS, PERSONALISED_STEPS_GOLD_COLORS } from '../constants';
import type { PersonalisedProps } from '@/components/personalized/PersonalisedHome';

export default function Personalized({ theme = 'blue' }: PersonalisedProps) {
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
                    {PERSONALISED_TEXT.heading}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-2">
                    {PERSONALISED_TEXT.subheading}
                </p>
                {/* <ColoredList
                  items={PERSONALISED_TEXT.steps.map((step, i) => ({
                    text: step,
                    colorKey: (theme === 'gold' ? PERSONALISED_STEPS_GOLD_COLORS : PERSONALISED_STEPS_BLUE_COLORS)[i % 5],
                  }))}
                /> */}
            </div>

            {/* Grid de plantillas */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates?.map((template) => (
                    <Link 
                        key={template.slug} 
                        href={`/personalised/${template.slug}`}
                        className="block p-4 bg-main-bg dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                        <div className="aspect-square mb-4">
                            <CustomChocolate 
                                layers={randomLayersMap[template.slug]} 
                                view="side"
                            />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {PERSONALISED_TEXT.templateCardLabel}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}