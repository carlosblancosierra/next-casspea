import { getRandomLayers } from '@/utils/getRandomLayers';
import type { ChocolateTemplateDetail, LayerTypeColor } from '@/types/personalized';

const color = (slug: string): LayerTypeColor => ({
    name: slug,
    slug,
    hex_code: '#fff',
    top_image: `/personalized/base/${slug}/top.png`,
    side_image: `/personalized/base/${slug}/side.png`,
});

const template: ChocolateTemplateDetail = {
    title: 'Heart',
    slug: 'heart',
    layers: [
        { layer_type: { name: 'Base', colors: [color('red'), color('blue')] }, name: null, order: 1 },
        { layer_type: { name: 'Drizzle', colors: [color('gold')] }, name: null, order: 2 },
    ],
};

describe('getRandomLayers', () => {
    it('picks one colour per slot and keeps slot order', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0); // always the first colour

        const layers = getRandomLayers(template);

        expect(layers).toHaveLength(2);
        expect(layers[0].order).toBe(1);
        expect(layers[0].chocolate_layer.color.slug).toBe('red');
        expect(layers[0].chocolate_layer.top_image).toBe('/personalized/base/red/top.png');
        expect(layers[1].chocolate_layer.color.slug).toBe('gold');

        jest.restoreAllMocks();
    });

    it('returns an empty list for a template without layers', () => {
        expect(getRandomLayers({ title: 'Bare', slug: 'bare' } as ChocolateTemplateDetail)).toEqual([]);
    });
});
