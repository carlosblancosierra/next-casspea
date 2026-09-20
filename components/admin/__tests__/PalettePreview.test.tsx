import { render, screen } from '@testing-library/react';
import PalettePreview from '@/components/admin/PalettePreview';

const palettes = {
    forest: {
        name: 'Forest',
        description: 'Deep green.',
        // #2F5741 under white text is ~8:1 — passes.
        colors: {
            primary: '#2F5741',
            'primary-button-text': '#FFFFFF',
            'main-bg': '#FFFFFF',
            'primary-text': '#000000',
            'primary-dark': '#1F3D2B',
            'primary-light': '#6E8F7A',
            'main-bg-dark': '#141A16',
            'primary-text-light': '#FBF8F3',
        },
        gradients: { 'gradient-autumn': 'linear-gradient(to right, #B4571F, #D49A1E)' },
    },
    tooLight: {
        name: 'Too light',
        description: 'Fails on purpose.',
        // #D49A1E under white text is ~2:1 — unreadable.
        colors: {
            primary: '#D49A1E',
            'primary-button-text': '#FFFFFF',
            'main-bg': '#FFFFFF',
            'primary-text': '#000000',
            'primary-dark': '#8C3F13',
            'primary-light': '#E0B65C',
            'main-bg-dark': '#17120F',
            'primary-text-light': '#FFFFFF',
        },
        gradients: { 'gradient-autumn': 'linear-gradient(to right, #D49A1E, #D49A1E)' },
    },
};

describe('PalettePreview', () => {
    it('shows every option with its hex values', () => {
        render(<PalettePreview palettes={palettes} active="forest" />);

        expect(screen.getByText('Forest')).toBeInTheDocument();
        expect(screen.getByText('Too light')).toBeInTheDocument();
        expect(screen.getAllByText('#2F5741').length).toBeGreaterThan(0);
    });

    it('marks which one the site is actually built with', () => {
        render(<PalettePreview palettes={palettes} active="forest" />);

        expect(screen.getByText('live')).toBeInTheDocument();
    });

    it('fails a palette whose button text cannot be read', () => {
        render(<PalettePreview palettes={palettes} active="forest" />);

        // A colour that looks fine as a swatch can still be unreadable as a
        // button, which is the only way a customer ever meets it. Saying so is
        // the difference between a palette picker and a mood board.
        const badges = screen.getAllByText(/Button text/);
        expect(badges.some(b => b.textContent?.includes('✓'))).toBe(true);
        expect(badges.some(b => b.textContent?.includes('✗'))).toBe(true);
    });
});
