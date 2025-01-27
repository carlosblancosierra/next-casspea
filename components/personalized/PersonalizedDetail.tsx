'use client';

import { useGetTemplateDetailQuery } from '@/redux/features/personalized/personalizedApiSlice';
import CustomChocolate from './CustomChocolate';
import PersonalizedForm from './PersonalizedForm';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface PersonalizedDetailProps {
    slug: string;
}

export default function PersonalizedDetail({ slug }: PersonalizedDetailProps) {
    const searchParams = useSearchParams();
    const { data: template, isLoading, error } = useGetTemplateDetailQuery(slug);
    
    const [selectedColors, setSelectedColors] = useState<Record<number, string>>(() => {
        // Try to get colors from URL parameters
        const colorsParam = searchParams.get('colors');
        if (colorsParam) {
            try {
                return JSON.parse(decodeURIComponent(colorsParam));
            } catch (e) {
                console.error('Error parsing colors from URL:', e);
            }
        }
        
        // If no colors in URL or error parsing, generate random colors
        const initialSelections: Record<number, string> = {};
        template?.layers.forEach(slot => {
            const randomColor = slot.layer_type.colors[Math.floor(Math.random() * slot.layer_type.colors.length)];
            initialSelections[slot.order] = randomColor.slug;
        });
        return initialSelections;
    });


    if (isLoading) return <div>Loading template...</div>;
    if (error) return <div>Error loading template</div>;
    if (!template) return <div>Template not found</div>;

    return (
        <div className="">
            {/* <div className="sticky top-4">
                <CustomChocolate layers={chosenLayers} />
            </div> */}
            <div>
                <h1 className="text-2xl font-bold mb-4">{template.title}</h1>
                <PersonalizedForm 
                    template={template} 
                    onLayersChange={setSelectedColors}
                />
            </div>
        </div>
    );
}
