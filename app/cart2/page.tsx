import type { Metadata } from 'next';
import Cart2Redirect from './Cart2Redirect';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

// Internal preview switch: visiting /cart2 turns on the new shipping-date
// checkout for this browser and lands on the normal cart.
export default function Cart2Page() {
    return <Cart2Redirect />;
}
