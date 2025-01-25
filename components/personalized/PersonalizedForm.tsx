'use client';

import { ChocolateTemplateDetail, UserChosenLayer } from '@/types/personalized';
import { useState, useEffect } from 'react';
import { useCreateUserDesignMutation } from '@/redux/features/personalized/personalizedApiSlice';
import Image from 'next/image';

interface PersonalizedFormProps {
    template: ChocolateTemplateDetail;
    onLayersChange: (layers: UserChosenLayer[]) => void;
}

export default function PersonalizedForm({ template, onLayersChange }: PersonalizedFormProps) {
    const [selectedColors, setSelectedColors] = useState<Record<number, string>>({});
    const [viewMode, setViewMode] = useState<'top' | 'side'>('top');
    const [createDesign] = useCreateUserDesignMutation();

    useEffect(() => {
        const newLayers: UserChosenLayer[] = template.layers
            .filter(slot => selectedColors[slot.order])
            .map(slot => {
                const color = slot.layer_type.colors.find(c => c.slug === selectedColors[slot.order]);
                if (!color) return null;

                return {
                    chocolate_layer: {
                        layer_type: slot.layer_type,
                        color: color,
                        top_image: color.top_image,
                        side_image: color.side_image,
                    },
                    order: slot.order,
                };
            })
            .filter((layer): layer is UserChosenLayer => layer !== null);

        onLayersChange(newLayers);
    }, [selectedColors, template.layers, onLayersChange]);

    const handleColorSelect = (order: number, colorSlug: string) => {
        setSelectedColors(prev => ({
            ...prev,
            [order]: colorSlug,
        }));
    };

    const handleSubmit = async () => {
        try {
            await createDesign({
                template_slug: template.slug,
                chosen_layers: Object.entries(selectedColors).map(([order, colorSlug]) => ({
                    layer_type: template.layers[parseInt(order) - 1].layer_type.name,
                    color_slug: colorSlug,
                    order: parseInt(order),
                })),
            }).unwrap();
            // Handle success (e.g., redirect to design list or show success message)
        } catch (error) {
            // Handle error
            console.error('Failed to create design:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setViewMode('top')}
                    className={`px-4 py-2 rounded-md ${
                        viewMode === 'top' 
                            ? 'bg-primary dark:bg-primary-2 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                >
                    Top View
                </button>
                <button
                    onClick={() => setViewMode('side')}
                    className={`px-4 py-2 rounded-md ${
                        viewMode === 'side' 
                            ? 'bg-primary dark:bg-primary-2 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                >
                    Side View
                </button>
            </div>

            {template.layers.map((slot) => (
                <div key={slot.order} className="space-y-2">
                    <h3 className="font-medium">{slot.layer_type.name}</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {slot.layer_type.colors.map((color) => (
                            <button
                                key={color.slug}
                                onClick={() => handleColorSelect(slot.order, color.slug)}
                                className={`relative w-full aspect-square rounded-lg overflow-hidden
                                    ${selectedColors[slot.order] === color.slug
                                        ? 'ring-2 ring-primary dark:ring-primary-2 ring-offset-2'
                                        : 'hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600'
                                    }`}
                                title={color.name}
                            >
                                <Image
                                    src={viewMode === 'top' ? color.top_image : color.side_image}
                                    alt={color.name}
                                    fill
                                    className="object-contain p-1"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs py-1 text-center">
                                    {color.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            
            <button
                onClick={handleSubmit}
                className="w-full bg-primary dark:bg-primary-2 text-white py-2 px-4 rounded-md
                    hover:bg-primary-dark dark:hover:bg-primary-2-dark transition-colors"
            >
                Save Design
            </button>
        </div>
    );
}
