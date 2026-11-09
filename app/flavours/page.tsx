import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import FlavourStoryRow from '@/components/flavours/FlavourStoryRow';
import Link from 'next/link';
import { filterFlavours, getFeaturedSections, getFlavours } from '@/utils/flavours';

const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Our Flavours | Handcrafted Chocolates | CassPea',
    description:
        'Meet every CassPea flavour — handcrafted bonbons made in London, from Milk Chocolate Ganache and Salted Caramel to Dubai Style and 64% Colombian Dark Chocolate Ganache.',
};

// Render on the server per request so admin changes show immediately.
export const dynamic = 'force-dynamic';

export default async function FlavoursPage() {
    // Coming-soon flavours included: this page shows them off, badged. The
    // featured categories (e.g. Christmas) come first, in their own section.
    const all = await getFlavours({ revalidate: false, includeComingSoon: true });
    const featured = getFeaturedSections(all);
    const flavours = filterFlavours(all, { excludeFeatured: true });

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

                {featured.map(({ category, title, flavours: sectionFlavours }) => (
                    <section
                        key={category.slug}
                        id={`flavours-${category.slug}`}
                        className="scroll-mt-24 mt-8 rounded-2xl bg-red-600/5 px-4 pt-8 dark:bg-white/5"
                    >
                        <header className="text-center">
                            <h2
                                className={`${playfair.className} text-2xl md:text-3xl font-bold text-primary-text dark:text-primary-text-light`}
                            >
                                {title}
                            </h2>
                            {category.featured_message && (
                                <p className="mt-2 text-primary-text/70 dark:text-primary-text-light/70">
                                    {category.featured_message}
                                </p>
                            )}
                            {category.featured_cta_label && category.featured_cta_url && (
                                <Link
                                    href={category.featured_cta_url}
                                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
                                >
                                    {category.featured_cta_label}
                                </Link>
                            )}
                        </header>
                        {sectionFlavours.map((flavour, index) => (
                            <FlavourStoryRow key={flavour.id} flavour={flavour} index={index} />
                        ))}
                    </section>
                ))}

                {flavours.length === 0 && featured.length === 0 ? (
                    <p className="text-center text-primary-text/60 dark:text-primary-text-light/60 py-16">
                        Flavours are unavailable right now — please check back soon.
                    </p>
                ) : (
                    <div>
                        {featured.length > 0 && flavours.length > 0 && (
                            <h2
                                className={`${playfair.className} mt-12 text-center text-2xl md:text-3xl font-bold text-primary-text dark:text-primary-text-light`}
                            >
                                All Our Flavours
                            </h2>
                        )}
                        {flavours.map((flavour, index) => (
                            <FlavourStoryRow key={flavour.id} flavour={flavour} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
