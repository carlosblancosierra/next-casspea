'use client';

import { ChocolateTemplateDetail, LayerTypeColor, UserChosenLayer } from '@/types/personalized';
import { useState, useEffect } from 'react';
import { useSendRequestMutation } from '@/redux/features/personalized/personalizedApiSlice';
import CustomChocolate from './CustomChocolate';
import ColorSelectionModal from './ColorSelectionModal';
import { motion, useAnimation } from "framer-motion";

interface OrderDetails {
    quantity: number;
    selectedFlavours: number[];
}

interface PersonalizedFormProps {
    template: ChocolateTemplateDetail;
    onLayersChange: (layers: UserChosenLayer[]) => void;
    orderDetails: OrderDetails;
}

export default function PersonalizedForm({ template, onLayersChange, orderDetails }: PersonalizedFormProps) {
    const [selectedColors, setSelectedColors] = useState<Record<number, string>>(() => {
        const initialSelections: Record<number, string> = {};
        template.layers.forEach(slot => {
            const randomColor = slot.layer_type.colors[Math.floor(Math.random() * slot.layer_type.colors.length)];
            initialSelections[slot.order] = randomColor.slug;
        });
        return initialSelections;
    });
    const [activeLayer, setActiveLayer] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const controls = useAnimation();
    const [sendRequest] = useSendRequestMutation();

    // New state for email and comments.
    const [email, setEmail] = useState('');
    const [comments, setComments] = useState('');

    const getPreviewLayers = (previewColor: LayerTypeColor): UserChosenLayer[] => {
        if (!activeLayer) return [];

        // Get all selected layers except for the active layer
        const otherLayers = template.layers
            .filter(slot => slot.order !== activeLayer && selectedColors[slot.order])
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

        // Add the preview layer
        const previewLayer = {
            chocolate_layer: {
                layer_type: template.layers[activeLayer - 1].layer_type,
                color: previewColor,
                top_image: previewColor.top_image,
                side_image: previewColor.side_image,
            },
            order: activeLayer,
        };

        return [...otherLayers, previewLayer].sort((a, b) => a.order - b.order);
    };

    useEffect(() => {
        const newLayers: UserChosenLayer[] = template.layers
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
        setActiveLayer(null);
    };

    // New submit function, sending a custom payload.
    const handleSubmit = async () => {
        const customDesignNames = template.layers.map(slot => {
            const color = slot.layer_type.colors.find(c => c.slug === selectedColors[slot.order]);
            return color?.name || '';
        });
        try {

            const payload = {
                template_slug: template.slug,
                email,
                comments,
                custom_design_names: customDesignNames,
                flavours: orderDetails.selectedFlavours,
                quantity: orderDetails.quantity,
            }

            console.log(payload);
            await sendRequest(payload).unwrap();
        } catch (error) {
            console.error('Failed to send request:', error);
        }
    };

    const getSelectedColorName = (order: number) => {
        const slot = template.layers.find(s => s.order === order);
        if (!slot) return '';
        const color = slot.layer_type.colors.find(c => c.slug === selectedColors[order]);
        return color?.name || '';
    };

    const currentLayers = template.layers
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

    const views = [
        { name: 'Side View', view: 'side' as const },
        { name: 'Top View', view: 'top' as const }
    ];

    const handleDragEnd = (event: any, info: any) => {
        const swipeThreshold = 50;
        if (Math.abs(info.offset.x) > swipeThreshold) {
            if (info.offset.x > 0 && currentIndex > 0) {
                setCurrentIndex(0);
                controls.start({ x: '10%' });
            } else if (info.offset.x < 0 && currentIndex < views.length - 1) {
                setCurrentIndex(1);
                controls.start({ x: '-70%' });
            } else {
                controls.start({ x: currentIndex === 0 ? '10%' : '-70%' });
            }
        } else {
            controls.start({ x: currentIndex === 0 ? '10%' : '-70%' });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Images - Full width on mobile, half width on desktop */}
            <div className="w-full lg:w-1/2">
                <div className="relative overflow-hidden rounded-lg">
                    <motion.div
                        drag="x"
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        animate={controls}
                        className="flex cursor-grab active:cursor-grabbing"
                        style={{ x: '10%' }}
                    >
                        {views.map(({ name, view }, idx) => (
                            <motion.div
                                key={view}
                                className="min-w-[80%] px-[2%]"
                            >
                                <div className="aspect-square rounded-lg overflow-hidden">
                                    <CustomChocolate 
                                        layers={currentLayers}
                                        view={view}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="mt-4 flex justify-center gap-2">
                        {views.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setCurrentIndex(idx);
                                    controls.start({
                                        x: idx === 0 ? '10%' : '-70%',
                                        transition: { duration: 0.5 }
                                    });
                                }}
                                className={`h-3 w-3 rounded-full transition-colors ${
                                    idx === currentIndex 
                                        ? 'bg-primary dark:bg-primary-2' 
                                        : 'bg-main-bg dark:bg-main-bg-dark'
                                }`}
                                aria-label={`Go to ${views[idx].name}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Form - Full width on mobile, half width on desktop */}
            <div className="w-full lg:w-1/2 space-y-6">
                <div className="space-y-4">
                    {template.layers.map((slot) => (
                        <div 
                            key={slot.order}
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-main-bg-dark"
                        >
                            <div>
                                <h3 className="font-medium">{slot.layer_type.name}</h3>
                                <p className="text-sm text-primary-text dark:text-primary-text">
                                    {getSelectedColorName(slot.order)}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveLayer(slot.order)}
                                className="px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-main-bg-dark hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Change ✏️
                            </button>
                        </div>
                    ))}
                </div>
                {/* New email and comments fields with Request button */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-primary-text dark:text-primary-text">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-main-bg dark:bg-main-bg-dark shadow-sm focus:outline-none focus:border-primary focus:ring-primary sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="comments" className="block text-sm font-medium text-primary-text dark:text-primary-text">
                            Comments
                        </label>
                        <textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Any special requests?"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-main-bg dark:bg-main-bg-dark shadow-sm focus:outline-none focus:border-primary focus:ring-primary sm:text-sm"
                            rows={3}
                        ></textarea>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-primary dark:bg-primary-2 text-white py-3 px-4 rounded-md hover:bg-primary-dark dark:hover:bg-primary-2-dark transition-colors"
                    >
                        Request Chocolates
                    </button>
                </div>
            </div>

            {activeLayer && (
                <ColorSelectionModal
                    layer={template.layers.find(l => l.order === activeLayer)!}
                    selectedColors={selectedColors}
                    onSelect={handleColorSelect}
                    onClose={() => setActiveLayer(null)}
                    viewMode={views[currentIndex].view}
                    getPreviewLayers={getPreviewLayers}
                />
            )}
        </div>
    );
}
