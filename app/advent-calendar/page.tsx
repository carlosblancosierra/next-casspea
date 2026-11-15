import AdventLanding, { adventMetadata, getAdventProduct } from '@/components/advent/AdventLanding';

// Statically built, rebuilt at most every minute so stock and the countdown's
// starting value stay fresh. Must be a literal for Next to read it.
export const revalidate = 60;

export async function generateMetadata() {
    return adventMetadata('shop');
}

export default async function AdventCalendarPage() {
    const product = await getAdventProduct();
    return <AdventLanding variant="shop" product={product} />;
}
