import AdventLanding, { adventMetadata } from '@/components/advent/AdventLanding';
import PrivateAdventLanding from '@/components/advent/PrivateAdventLanding';
import { getAdventLandingLive, getPublicAdventLanding } from '@/utils/adventLanding';

// See app/advent-calendar/page.tsx.
export const revalidate = 60;

// Same offer as /advent-calendar, behind an email form: noindex, canonical to the shop page.
export async function generateMetadata() {
    const live = await getAdventLandingLive();
    const content = live ? await getPublicAdventLanding() : null;
    return adventMetadata('lead', { live, product: content?.product ?? null });
}

export default async function AdventEarlyAccessPage() {
    const content = (await getAdventLandingLive()) ? await getPublicAdventLanding() : null;
    if (content) {
        return <AdventLanding variant="lead" product={content.product} flavours={content.flavours} />;
    }
    return <PrivateAdventLanding variant="lead" />;
}
