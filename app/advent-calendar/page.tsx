import AdventLanding, { adventMetadata, getAdventExclusives, getAdventProduct } from '@/components/advent/AdventLanding';

// Statically built, rebuilt at most every minute so stock and the countdown's
// starting value stay fresh. Must be a literal for Next to read it.
export const revalidate = 60;

export async function generateMetadata() {
    return adventMetadata('shop', await getAdventProduct());
}

export default async function AdventCalendarPage() {
    const [product, exclusives] = await Promise.all([getAdventProduct(), getAdventExclusives()]);
    return <AdventLanding variant="shop" product={product} exclusives={exclusives} />;
}
