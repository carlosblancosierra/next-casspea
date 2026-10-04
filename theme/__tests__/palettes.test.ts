const { palettes, ACTIVE, active } = require('@/theme/palettes');

/** Relative luminance, per WCAG 2.x. */
function luminance(hex: string): number {
    const full = hex.replace('#', '');
    const channels = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) / 255);
    const linear = channels.map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a: string, b: string): number {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
}

type Palette = { colors: Record<string, string>; gradients: Record<string, string> };

const entries = Object.entries(palettes) as [string, Palette][];

describe.each(entries)('%s palette', (_name, palette) => {
    const c = palette.colors;

    it('can be read as a button', () => {
        expect(contrast(c.primary, c['primary-button-text'])).toBeGreaterThanOrEqual(4.5);
    });

    it('can be read as body text, light and dark', () => {
        expect(contrast(c['main-bg'], c['primary-text'])).toBeGreaterThanOrEqual(4.5);
        expect(contrast(c['main-bg-dark'], c['primary-text-light'])).toBeGreaterThanOrEqual(4.5);
    });

    it('holds white text on every gradient stop', () => {
        // Both gradients carry white text in real use — every money button is
        // gradient-autumn, the units-sold counter is gradient-primary — so the
        // light end matters as much as the dark one you notice first.
        const stops = Object.values(palette.gradients)
            .flatMap(value => value.match(/#[0-9A-Fa-f]{6}/g) ?? []);
        expect(stops.length).toBeGreaterThan(0);
        for (const stop of stops) {
            expect(contrast(stop, c['primary-button-text'])).toBeGreaterThanOrEqual(4.5);
        }
    });

    it('pairs its accent with text that can be read on it', () => {
        // The point of accent-text existing. Christmas gold #DAA520 is 2.24:1
        // under white and 7.78:1 under the dark ink, so an accent that borrowed
        // primary-button-text would ship unreadable.
        expect(c.accent).toBeDefined();
        expect(c['accent-text']).toBeDefined();
        expect(contrast(c.accent, c['accent-text'])).toBeGreaterThanOrEqual(4.5);
    });
});

describe('the active palette', () => {
    it('is one that exists', () => {
        expect(palettes[ACTIVE]).toBeDefined();
        expect(active).toBe(palettes[ACTIVE]);
    });
});

describe('christmas', () => {
    const c = palettes.christmas.colors;

    it('uses the navy asked for, with gold as the accent', () => {
        expect(c.primary).toBe('#003B78');
        expect(c.accent).toBe('#DAA520');
    });

    it('never puts white text on the gold', () => {
        // The whole reason gold is the accent and not the primary.
        expect(contrast(c.accent, '#FFFFFF')).toBeLessThan(4.5);
        expect(c['accent-text']).not.toBe('#FFFFFF');
    });

    it('keeps the gold legible on the blue', () => {
        // Navy and gold only works if the gold reads against the navy.
        expect(contrast(c.accent, c.primary)).toBeGreaterThanOrEqual(4.5);
    });
});

describe('packaging', () => {
    const c = palettes.packaging.colors;

    it('uses the turquoise and brown sampled from the box', () => {
        expect(c.accent).toBe('#00B9D2');
        expect(c['secondary-bg']).toBe('#4A2C27');
    });

    it('never puts white text on the packaging turquoise', () => {
        // Why the turquoise is the accent and a deeper teal is the button.
        expect(contrast(c.accent, '#FFFFFF')).toBeLessThan(4.5);
        expect(c['accent-text']).not.toBe('#FFFFFF');
    });
});
