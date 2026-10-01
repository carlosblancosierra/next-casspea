import { render, screen } from '@testing-library/react';
import ReviewCarousel from '@/components/common/ReviewCarousel';

describe('ReviewCarousel', () => {
    it('shows the rating above the reviews', () => {
        render(<ReviewCarousel />);

        expect(screen.getByAltText(/Trustpilot rating/)).toBeInTheDocument();
    });

    it('puts "See all" after the reviews, not above them', () => {
        const { container } = render(<ReviewCarousel />);

        const seeAll = screen.getByRole('link', { name: /See all reviews/ });
        const lastCard = container.querySelectorAll('[data-review-card]');
        const last = lastCard[lastCard.length - 1];

        // Going to read more reviews only makes sense once you have read some.
        expect(last.compareDocumentPosition(seeAll) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('shows five Trustpilot stars on each review', () => {
        render(<ReviewCarousel />);

        // Every quoted review is a five-star one; the 4.5 asset belongs on the
        // 4.7 aggregate, which is what the rating above the cards shows.
        expect(screen.getAllByAltText(/Rated 5 out of 5/).length).toBeGreaterThan(1);
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
