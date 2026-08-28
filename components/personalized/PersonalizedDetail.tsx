'use client';

import { useGetTemplateDetailQuery } from '@/redux/features/personalized/personalizedApiSlice';
import CustomChocolate from './CustomChocolate';
import PersonalizedForm from './PersonalizedForm';
import PersonalizedQuantities from './PersonalizedQuantities';
import { useState } from 'react';

interface PersonalizedDetailProps {
    slug: string;
}

export default function PersonalizedDetail({ slug }: PersonalizedDetailProps) {
    const { data: template, isLoading, error } = useGetTemplateDetailQuery(slug);

    // Lift order details state (quantity and selected flavours)
    const [orderDetails, setOrderDetails] = useState({ quantity: 50, selectedFlavours: [] as number[] });

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
                    orderDetails={orderDetails}
                />
                <PersonalizedQuantities 
                    orderDetails={orderDetails}
                    setOrderDetails={setOrderDetails}
                />
            </div>
        </div>
    );
}
