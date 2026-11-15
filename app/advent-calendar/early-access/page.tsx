import AdventLanding, { adventMetadata, getAdventProduct } from '@/components/advent/AdventLanding';

// See app/advent-calendar/page.tsx.
export const revalidate = 60;

// Same offer as /advent-calendar, behind an email form: noindex, canonical to the shop page.
export async function generateMetadata() {
    return adventMetadata('lead');
}

export default async function AdventEarlyAccessPage() {
    const product = await getAdventProduct();
    return <AdventLanding variant="lead" product={product} />;
}
