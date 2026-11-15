import AdventLanding, { adventMetadata } from '@/components/advent/AdventLanding';
import PrivateAdventLanding from '@/components/advent/PrivateAdventLanding';
import { getAdventLandingLive, getPublicAdventLanding } from '@/utils/adventLanding';

// Rebuilt at most every minute: stock, the countdown's starting value and the
// live switch (Django admin → Products → Advent landing) stay fresh.
// Must be a literal for Next to read it.
export const revalidate = 60;

export async function generateMetadata() {
    const live = await getAdventLandingLive();
    const content = live ? await getPublicAdventLanding() : null;
    return adventMetadata('shop', { live, product: content?.product ?? null });
}

/**
 * Live: rendered on the server for everyone. Not live: the HTML carries no
 * content, and the browser asks the API for it with the user's token (staff only).
 */
export default async function AdventCalendarPage() {
    const content = (await getAdventLandingLive()) ? await getPublicAdventLanding() : null;
    if (content) {
        return <AdventLanding variant="shop" product={content.product} flavours={content.flavours} />;
    }
    return <PrivateAdventLanding variant="shop" />;
}
