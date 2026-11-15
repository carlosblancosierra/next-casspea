import { render, screen } from '@testing-library/react';
import Button, { buttonClasses } from '@/components/common/Button';

describe('Button', () => {
    it('renders a link when given href and a button otherwise', () => {
        render(
            <>
                <Button href="/shop">Shop</Button>
                <Button>Save</Button>
            </>,
        );
        expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/shop');
        expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
    });

    it('opens external links in a plain anchor', () => {
        render(<Button href="https://example.com" target="_blank" rel="noopener noreferrer">Out</Button>);
        expect(screen.getByRole('link', { name: 'Out' })).toHaveAttribute('target', '_blank');
    });

    it('draws the secondary as an outline, never filled', () => {
        const classes = buttonClasses({ variant: 'secondary' }).split(' ');
        expect(classes).toContain('border-primary');
        expect(classes).not.toContain('bg-primary');
    });

    it('does not use the brand colour for the secondary in dark mode', () => {
        // With the navy palette, brand-coloured text on the dark page was
        // ~1.5:1 and unreadable. In dark mode it follows the light ink.
        const classes = buttonClasses({ variant: 'secondary' }).split(' ');
        expect(classes).toContain('dark:text-primary-text-light');
        expect(classes.filter(c => /^dark:(text|border)-primary(-2)?$/.test(c))).toHaveLength(0);
    });
});
