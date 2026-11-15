import AdventLanding, { adventMetadata, getAdventExclusives, getAdventProduct } from '@/components/advent/AdventLanding';

// See app/advent-calendar/page.tsx.
export const revalidate = 60;

// Same offer as /advent-calendar, behind an email form: noindex, canonical to the shop page.
export async function generateMetadata() {
    return adventMetadata('lead', await getAdventProduct());
}

export default async function AdventEarlyAccessPage() {
    const [product, exclusives] = await Promise.all([getAdventProduct(), getAdventExclusives()]);
    return <AdventLanding variant="lead" product={product} exclusives={exclusives} />;
}
