import { render, screen, within } from '@testing-library/react';
import Footer from '@/components/common/Footer';
import { navigation } from '@/components/common/navigation';

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

    it('repeats the navbar links', () => {
        render(<Footer />);

        const footerNav = screen.getByRole('navigation', { name: 'Footer' });
        for (const item of navigation) {
            expect(within(footerNav).getByRole('link', { name: item.name }))
                .toHaveAttribute('href', item.href);
        }
        expect(within(footerNav).getByRole('link', { name: 'FAQs' })).toHaveAttribute('href', '/faqs');
        expect(within(footerNav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    });
});
