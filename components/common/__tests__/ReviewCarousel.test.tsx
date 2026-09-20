import { render, screen } from '@testing-library/react';
import ReviewCarousel from '@/components/common/ReviewCarousel';

describe('ReviewCarousel', () => {
    it('shows the rating above the reviews', () => {
        render(<ReviewCarousel />);

        expect(screen.getByAltText(/Trustpilot rating/)).toBeInTheDocument();
    });

    it('is the only place that links off the site, and it opens a new tab', () => {
        render(<ReviewCarousel />);

        const seeAll = screen.getByRole('link', { name: /See all reviews/ });
        expect(seeAll).toHaveAttribute('href', expect.stringContaining('trustpilot.com'));
        expect(seeAll).toHaveAttribute('target', '_blank');
        // Without noopener the new tab can reach back into this one.
        expect(seeAll).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
});
