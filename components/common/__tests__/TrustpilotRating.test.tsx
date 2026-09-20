import { render, screen } from '@testing-library/react';
import TrustpilotRating from '@/components/common/TrustpilotRating';

describe('TrustpilotRating', () => {
    it('defaults to Trustpilot, which is correct on any page', () => {
        render(<TrustpilotRating />);

        // /shop-now renders this with no href and has no reviews section.
        // Defaulting to '#reviews' would have made that one a dead link.
        const link = screen.getByRole('link', { name: /Trustpilot/ });
        expect(link).toHaveAttribute('href', expect.stringContaining('trustpilot.com'));
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('stays on the page when given an anchor', () => {
        render(<TrustpilotRating href="#reviews" />);

        const link = screen.getByRole('link', { name: /Trustpilot/ });
        expect(link).toHaveAttribute('href', '#reviews');
        // A new tab for a same-page jump would be nonsense.
        expect(link).not.toHaveAttribute('target');
        expect(link).not.toHaveAttribute('rel');
    });
});
