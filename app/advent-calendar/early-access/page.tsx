import AdventLanding, { adventMetadata, getAdventLandingData, getAdventProduct, getShowcaseFlavours } from '@/components/advent/AdventLanding';
import AdventPreview from '@/components/advent/AdventPreview';

// See app/advent-calendar/page.tsx.
export const revalidate = 60;

// Same offer as /advent-calendar, behind an email form: noindex, canonical to the shop page.
export async function generateMetadata() {
    const landing = await getAdventLandingData();
    return adventMetadata('lead', landing?.product ?? (await getAdventProduct()), !!landing?.live);
}

export default async function AdventEarlyAccessPage() {
    const [landing, flavours] = await Promise.all([getAdventLandingData(), getShowcaseFlavours()]);
    // Not live: only staff can see it, and only their browser holds their token.
    if (!landing) return <AdventPreview variant="lead" flavours={flavours} />;
    return <AdventLanding variant="lead" product={landing.product} exclusives={landing.flavours} flavours={flavours} />;
}
