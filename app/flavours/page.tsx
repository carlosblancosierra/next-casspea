import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import FlavourStoryRow from '@/components/flavours/FlavourStoryRow';
import { getFlavours } from '@/utils/flavours';

const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Our Flavours | Handcrafted Chocolates | CassPea',
    description:
        'Meet every CassPea flavour — handcrafted bonbons made in London, from Milk Chocolate Ganache and Salted Caramel to Dubai Style and 64% Colombian Dark Chocolate Ganache.',
};

// Render on the server per request so admin changes show immediately.
export const dynamic = 'force-dynamic';

export default async function FlavoursPage() {
    const flavours = await getFlavours({ revalidate: false });

    return (
        <main className="dark:bg-main-bg-dark min-h-screen py-8">
            <div className="max-w-5xl mx-auto px-4">
                <header className="text-center mb-4">
                    <h1
                        className={`${playfair.className} text-3xl md:text-4xl font-bold text-primary-text dark:text-primary-text-light`}
                    >
                        Our Flavours
                    </h1>
                    <p className="mt-2 text-primary-text/70 dark:text-primary-text-light/70">
                        Every one handcrafted in London. Here is the story behind each.
                    </p>
                </header>

                {flavours.length === 0 ? (
                    <p className="text-center text-primary-text/60 dark:text-primary-text-light/60 py-16">
                        Flavours are unavailable right now — please check back soon.
                    </p>
                ) : (
                    <div>
                        {flavours.map((flavour, index) => (
                            <FlavourStoryRow key={flavour.id} flavour={flavour} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
