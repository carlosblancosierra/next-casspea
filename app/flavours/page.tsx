import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import FlavourNameGrid from '@/components/flavours/FlavourNameGrid';
import { getFlavours } from '@/utils/flavours';

const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Our Flavours | Handcrafted Chocolates | CassPea',
    description:
        'Explore every CassPea flavour — handcrafted bonbons made in London, from Milk Chocolate Ganache and Salted Caramel to Dubai Style and 64% Colombian Dark Chocolate Ganache. Tap any flavour for its description and allergens.',
};

// Revalidated by getFlavours() (revalidate: 300); render on the server for SEO.
export default async function FlavoursPage() {
    const flavours = await getFlavours();

    return (
        <main className="dark:bg-main-bg-dark min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <header className="text-center mb-8">
                    <h1
                        className={`${playfair.className} text-3xl md:text-4xl font-bold text-primary-text dark:text-primary-text-light`}
                    >
                        Our Flavours
                    </h1>
                    <p className="mt-2 text-primary-text/70 dark:text-primary-text-light/70">
                        Discover our selection of handcrafted chocolates
                    </p>
                </header>
            </div>

            {flavours.length === 0 ? (
                <p className="text-center text-primary-text/60 dark:text-primary-text-light/60 py-16">
                    Flavours are unavailable right now — please check back soon.
                </p>
            ) : (
                <div className="px-4">
                    <FlavourNameGrid flavours={flavours} variant="caption" />
                </div>
            )}
        </main>
    );
}
