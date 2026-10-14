import { render, screen } from '@testing-library/react';
import Footer from '@/components/common/Footer';
import { NAVIGATION } from '@/components/common/siteLinks';

describe('Footer', () => {
    it('carries the phone number and email as tappable links', () => {
        render(<Footer />);

        // These moved here out of the announcement bar. The footer was hidden
        // below md at the time, so on phones — most of this shop's traffic —
        // they briefly existed nowhere at all.
        expect(screen.getByRole('link', { name: '07859 790386' }))
            .toHaveAttribute('href', 'tel:07859790386');
        expect(screen.getByRole('link', { name: 'info@casspea.co.uk' }))
            .toHaveAttribute('href', 'mailto:info@casspea.co.uk');
    });

    it('keeps the staff log-in link', () => {
        render(<Footer />);

        expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/orders');
    });
});

describe('Footer navigation', () => {
    it('links every page in the navbar, so nobody has to scroll back up', () => {
        render(<Footer />);

        for (const item of NAVIGATION) {
            // The navbar says "Track"; the footer spells it out.
            const name = item.name === 'Track' ? 'Track your order' : item.name;
            expect(screen.getByRole('link', { name })).toHaveAttribute('href', item.href);
        }
    });

    it('opens external links in a new tab', () => {
        render(<Footer />);

        expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('target', '_blank');
    });
});
