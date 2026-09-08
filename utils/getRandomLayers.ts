import { ChocolateTemplateDetail, UserChosenLayer } from '@/types/personalized';

/**
 * Picks a random colour for every layer slot of a template. Used to render
 * the preview chocolate on template cards.
 */
export function getRandomLayers(template: ChocolateTemplateDetail): UserChosenLayer[] {
    return (template.layers ?? []).map(slot => {
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
}
