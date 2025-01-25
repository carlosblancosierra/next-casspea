'use client';

import { UserChosenLayer } from '@/types/personalized';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface CustomChocolateProps {
    layers: UserChosenLayer[];
    view: 'top' | 'side';
    onLoad?: () => void;
}

export default function CustomChocolate({ layers, view, onLoad }: CustomChocolateProps) {
    const [loadedImages, setLoadedImages] = useState(0);
    const totalImages = layers.length;

    useEffect(() => {
        // Reset loaded images count when layers change
        setLoadedImages(0);
    }, [layers]);

    useEffect(() => {
        if (loadedImages === totalImages && onLoad && totalImages > 0) {
            onLoad();
        }
    }, [loadedImages, totalImages, onLoad]);

    const handleImageLoad = () => {
        setLoadedImages(prev => prev + 1);
    };

    return (
        <div className="relative w-full h-full">
            {layers.map((layer) => (
                <div key={layer.order} className="absolute inset-0">
                    <Image
                        src={view === 'top' ? layer.chocolate_layer.color.top_image : layer.chocolate_layer.color.side_image}
                        alt={`${layer.chocolate_layer.layer_type.name} - ${layer.chocolate_layer.color.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'contain' }}
                        priority={true}
                        onLoadingComplete={handleImageLoad}
                    />
                </div>
            ))}
        </div>
    );
}
