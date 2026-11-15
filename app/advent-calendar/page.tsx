import AdventLanding, { adventMetadata, getAdventLandingData, getAdventProduct, getShowcaseFlavours } from '@/components/advent/AdventLanding';
import AdventPreview from '@/components/advent/AdventPreview';

// Statically built, rebuilt at most every minute so stock and the countdown's
// starting value stay fresh. Must be a literal for Next to read it.
export const revalidate = 60;

export async function generateMetadata() {
    return adventMetadata('shop', await getAdventProduct());
}

export default async function AdventCalendarPage() {
    const [landing, flavours] = await Promise.all([getAdventLandingData(), getShowcaseFlavours()]);
    // Not live: only staff can see it, and only their browser holds their token.
    if (!landing) return <AdventPreview variant="shop" flavours={flavours} />;
    return <AdventLanding variant="shop" product={landing.product} exclusives={landing.flavours} flavours={flavours} />;
}
