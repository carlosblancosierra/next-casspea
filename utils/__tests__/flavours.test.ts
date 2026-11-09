import { comingSoonLabel, filterFlavours, formatLaunchDate, getFeaturedSections } from '@/utils/flavours';
import type { Flavour } from '@/types/flavours';

const christmas = { id: 2, name: 'Christmas', slug: 'christmas', active: true, featured: true, featured_title: 'New Christmas Flavours', available_from: '2026-12-01' };
const originals = { id: 1, name: 'Originals', slug: 'originals', active: true };

const list = [
    { id: 1, name: 'Gin', category: originals },
    { id: 2, name: 'Mulled Wine', category: christmas, coming_soon: true, available_from: '2026-12-01' },
    { id: 3, name: 'Gingerbread', category: christmas, coming_soon: true, available_from: '2026-12-01' },
] as unknown as Flavour[];

describe('flavour helpers', () => {
    it('formats a launch date without letting a time zone move the day', () => {
        expect(formatLaunchDate('2026-12-01')).toBe('1 December');
        expect(formatLaunchDate(null)).toBeNull();
        expect(formatLaunchDate('nope')).toBeNull();
    });

    it('labels only flavours not on sale yet', () => {
        expect(comingSoonLabel(list[1])).toBe('Coming 1 December');
        expect(comingSoonLabel(list[0])).toBeNull();
        expect(comingSoonLabel({ ...list[1], available_from: null, category: undefined })).toBe('Coming soon');
    });

    it('groups the featured categories, with their title', () => {
        const sections = getFeaturedSections(list);
        expect(sections).toHaveLength(1);
        expect(sections[0].title).toBe('New Christmas Flavours');
        expect(sections[0].flavours.map(f => f.name)).toEqual(['Mulled Wine', 'Gingerbread']);
    });

    it('filters by category or leaves the featured ones out', () => {
        expect(filterFlavours(list, { categorySlug: 'christmas' })).toHaveLength(2);
        expect(filterFlavours(list, { excludeFeatured: true }).map(f => f.name)).toEqual(['Gin']);
    });
});
