import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import FlavourNameGrid from '@/components/flavours/FlavourNameGrid';
import { getFlavours, getFeaturedSections } from '@/utils/flavours';

const playfair = Playfair_Display({ subsets: ['latin'] });

/**
 * One section per featured flavour category (e.g. "New Christmas Flavours"),
 * for the home page. Which category, its heading, the line under it and the
 * button all come from the flavour category in the admin. Its flavours show
 * "Coming soon" until the category's launch date and cannot be picked into a
 * box before then. Renders nothing when no category is featured.
 */
export default async function FeaturedFlavourSections({ className = '' }: { className?: string }) {
    const sections = getFeaturedSections(await getFlavours({ includeComingSoon: true }));
    if (sections.length === 0) return null;

    return (
        <>
            {sections.map(({ category, title, flavours }) => (
                <section
                    key={category.slug}
                    id={`flavours-${category.slug}`}
                    className={`scroll-mt-24 px-4 ${className}`}
                >
                    <h2
                        className={`${playfair.className} text-center text-2xl font-bold text-primary-text dark:text-primary-text-light`}
                    >
                        {title}
                    </h2>
                    {category.featured_message && (
                        <p className="mx-auto mt-2 max-w-2xl text-center text-primary-text/80 dark:text-primary-text-light/80">
                            {category.featured_message}
                        </p>
                    )}
                    <div className="mt-6">
                        <FlavourNameGrid flavours={flavours} categorySlug={category.slug} showDescription fitColumns />
                    </div>
                    {category.featured_cta_label && category.featured_cta_url && (
                        <div className="mt-6 text-center">
                            <Link
                                href={category.featured_cta_url}
                                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
                            >
                                {category.featured_cta_label}
                            </Link>
                        </div>
                    )}
                </section>
            ))}
        </>
    );
}
