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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">{template.title}</h1>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-lg font-medium mb-2">Top View</h2>
                        <CustomChocolate layers={chosenLayers} view="top" />
                    </div>
                    <div>
                        <h2 className="text-lg font-medium mb-2">Side View</h2>
                        <CustomChocolate layers={chosenLayers} view="side" />
                    </div>
                </div>
            </div>
            <div className="sticky top-4">
                <PersonalizedForm 
                    template={template} 
                    onLayersChange={setChosenLayers}
                />
            </div>
        </div>
    );
}
