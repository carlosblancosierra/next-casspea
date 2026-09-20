import { render, screen } from '@testing-library/react';
import ShopNowCTA, { SHOP_CTA_HREF, SHOP_CTA_LABEL } from '@/components/common/ShopNowCTA';

describe('ShopNowCTA', () => {
    it('carries the Trustpilot rating above the button', () => {
        render(<ShopNowCTA />);

        // The rating used to live on the announcement bar, which is dismissible
        // and sits above the fold on every page. Its job is to be read just
        // before the customer decides to click, so it travels with the button.
        const rating = screen.getByRole('link', { name: /Trustpilot/ });
        const cta = screen.getByRole('link', { name: new RegExp(SHOP_CTA_LABEL) });

        expect(rating).toBeInTheDocument();
        expect(cta).toBeInTheDocument();
        // eslint-disable-next-line no-bitwise
        expect(rating.compareDocumentPosition(cta) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('takes its label and link from one shared place', () => {
        render(<ShopNowCTA />);

        // The hero had two hand-written copies of this button with different
        // labels, so changing the offer meant remembering both.
        expect(screen.getByRole('link', { name: new RegExp(SHOP_CTA_LABEL) }))
            .toHaveAttribute('href', SHOP_CTA_HREF);
    });

    it('can drop the rating where a page does not want it', () => {
        render(<ShopNowCTA showRating={false} />);

        expect(screen.queryByRole('link', { name: /Trustpilot/ })).not.toBeInTheDocument();
    });
});
