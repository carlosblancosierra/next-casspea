import AdventLanding, { adventMetadata, getAdventProduct } from '@/components/advent/AdventLanding';

// Rendered on every request while the landing is private (middleware.ts):
// a cached copy could reach a CDN and be served without the password.
// When it launches, go back to `export const revalidate = 60;` (ISR).
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
    return adventMetadata('shop');
}

export default async function AdventCalendarPage() {
    const product = await getAdventProduct();
    return <AdventLanding variant="shop" product={product} />;
}
