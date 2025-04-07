'use client';

import { LayerTypeColor, TemplateLayer, UserChosenLayer } from '@/types/personalized';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ColorSelectionModalProps {
    layer: TemplateLayer;
    selectedColors: Record<number, string>;
    onSelect: (order: number, colorSlug: string) => void;
    onClose: () => void;
    viewMode: 'top' | 'side';
    getPreviewLayers: (previewColor: LayerTypeColor) => UserChosenLayer[];
}

export default function ColorSelectionModal({
    layer,
    selectedColors,
    onSelect,
    onClose,
    getPreviewLayers,
}: ColorSelectionModalProps) {
    const [loadingStates, setLoadingStates] = useState<Record<string, number>>({});
    const [loadedStates, setLoadedStates] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Initialize loading states
        const initialLoadingStates: Record<string, number> = {};
        const initialLoadedStates: Record<string, boolean> = {};
        layer.layer_type.colors.forEach(color => {
            const previewLayers = getPreviewLayers(color);
            initialLoadingStates[color.slug] = previewLayers.length;
            initialLoadedStates[color.slug] = false;
        });
        setLoadingStates(initialLoadingStates);
        setLoadedStates(initialLoadedStates);
    }, [layer.layer_type.colors, getPreviewLayers]);

    const handleImageLoad = (colorSlug: string) => {
        setLoadingStates(prev => {
            const newCount = (prev[colorSlug] || 0) - 1;
            if (newCount <= 0) {
                setLoadedStates(prevLoaded => ({
                    ...prevLoaded,
                    [colorSlug]: true
                }));
            }
            return {
                ...prev,
                [colorSlug]: newCount
            };
        });
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="main-bg dark:bg-gray-800 p-6 w-[95vw] max-w-[95vw] max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-main-bg dark:bg-gray-800 pb-4 mb-4 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Select {layer.layer_type.name}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1">
                    {layer.layer_type.colors.map((color) => {
                        const previewLayers = getPreviewLayers(color);
                        return (
                            <div 
                                key={color.slug}
                                className={`relative overflow-hidden ${
                                    selectedColors[layer.order] === color.slug
                                        ? 'ring-2 ring-primary dark:ring-primary-2'
                                        : ''
                                }`}
                            >
                                <button
                                    onClick={() => onSelect(layer.order, color.slug)}
                                    className="w-full group"
                                    disabled={!loadedStates[color.slug]}
                                >
                                    <div className="relative aspect-square rounded-lg">
                                        {!loadedStates[color.slug] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary dark:border-primary-2 border-t-transparent"></div>
                                            </div>
                                        )}
                                        <span className="absolute top-1 md:top-2 left-0 right-0 text-center text-xs md:text-sm font-medium z-20">
                                            {color.name}
                                        </span>
                                        <div className="relative w-full h-full">
                                            {previewLayers.map((layer) => (
                                                <div key={layer.order} className="absolute inset-0">
                                                    <Image
                                                        src={layer.chocolate_layer.color.side_image}
                                                        alt={`${layer.chocolate_layer.layer_type.name} - ${layer.chocolate_layer.color.name}`}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        style={{ objectFit: 'contain' }}
                                                        priority={true}
                                                        onLoadingComplete={() => handleImageLoad(color.slug)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 