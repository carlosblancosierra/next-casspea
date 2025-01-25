'use client';

import { UserChosenLayer } from '@/types/personalized';
import Image from 'next/image';

interface CustomChocolateProps {
    layers: UserChosenLayer[];
    view: 'top' | 'side';
}

export default function CustomChocolate({ layers, view }: CustomChocolateProps) {
    const sortedLayers = [...layers].sort((a, b) => a.order - b.order);

    return (
        <div className="relative w-full aspect-square">
            {sortedLayers.map((layer, index) => (
                <div 
                    key={`${layer.chocolate_layer.layer_type.name}-${index}`}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ zIndex: layer.order }}
                >
                    <Image
                        src={view === 'top' ? layer.chocolate_layer.top_image : layer.chocolate_layer.side_image}
                        alt={`${layer.chocolate_layer.layer_type.name} layer`}
                        fill
                        className="object-contain"
                        priority={index === 0} // Priority load for base layer
                    />
                </div>
            ))}
        </div>
    );
}
