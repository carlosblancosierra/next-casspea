'use client';

import { useGetTemplateDetailQuery } from '@/redux/features/personalized/personalizedApiSlice';
import CustomChocolate from './CustomChocolate';
import PersonalizedForm from './PersonalizedForm';
import { useState } from 'react';
import { UserChosenLayer } from '@/types/personalized';

interface PersonalizedDetailProps {
    slug: string;
}

export default function PersonalizedDetail({ slug }: PersonalizedDetailProps) {
    const { data: template, isLoading, error } = useGetTemplateDetailQuery(slug);
    const [chosenLayers, setChosenLayers] = useState<UserChosenLayer[]>([]);

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
                    onLayersChange={setChosenLayers}
                />
            </div>
        </div>
    );
}
