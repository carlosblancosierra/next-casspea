'use client';

import { useGetTemplatesQuery } from '@/redux/features/personalized/personalizedApiSlice';
import Link from 'next/link';
import CustomChocolate from '@/components/personalized/CustomChocolate';
import { UserChosenLayer } from '@/types/personalized';
import { useMemo } from 'react';
import { PERSONALISED_TEXT } from '../constants';
import ColoredList from '@/components/common/ColoredList';
import { PERSONALISED_STEPS_BLUE_COLORS, PERSONALISED_STEPS_GOLD_COLORS } from '../constants';

interface PersonalisedProps { config: typeof import('../constants').LANDING_CONFIG.gold; }

export default function Personalised({ config }: PersonalisedProps) {
    const { data: templates, isLoading, error } = useGetTemplatesQuery();

    const getRandomLayers = (template: any): UserChosenLayer[] => {
        return template.layers.map((slot: any) => {
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
        templates?.forEach((template: any) => {
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
                <p className="secondary-text dark:secondary-text text-lg leading-relaxed mb-2">
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
                {templates?.map((template: any) => (
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
                        <p className="secondary-text dark:secondary-text">
                            {config.personalisedText.templateCardLabel}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}