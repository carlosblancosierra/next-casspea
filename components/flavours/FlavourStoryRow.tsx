import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';
import { Flavour } from '@/types/flavours';

const playfair = Playfair_Display({ subsets: ['latin'] });

interface Props {
    flavour: Flavour;
    /** Row position, used to alternate which side the image sits on. */
    index: number;
}

// Presentational and hook-free so the flavours page can server-render it.
export default function FlavourStoryRow({ flavour, index }: Props) {
    const imageOnRight = index % 2 === 1;
    const body = flavour.story?.trim() || flavour.description;
    const allergens = flavour.allergens?.map(a => a.name).filter(Boolean) ?? [];

    return (
        <article
            id={flavour.slug}
            className="scroll-mt-24 border-b border-black/10 dark:border-white/10 last:border-0"
        >
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-10 md:grid-cols-2 md:gap-12 md:py-14">
                {/* Half width at both sizes. It was capped at 20rem on phones
                    and uncapped on desktop, so it filled its whole column and
                    a flavour photo took most of the screen before any of the
                    copy it is illustrating. 50% of the column halves both in
                    one class. */}
                <div
                    className={`relative mx-auto aspect-square w-full max-w-[50%] ${
                        imageOnRight ? 'md:order-2' : ''
                    }`}
                >
                    <Image
                        src={flavour.image || flavour.thumbnail || '/flavours/default.png'}
                        alt={flavour.name}
                        fill
                        // Halved to match, so the browser stops fetching a file
                        // twice the size it renders at.
                        sizes="(min-width:768px) 20vw, 40vw"
                        className="object-contain"
                    />
                </div>

                <div className={imageOnRight ? 'md:order-1' : ''}>
                    <h2
                        className={`${playfair.className} text-2xl font-bold text-primary-text dark:text-primary-text-light md:text-3xl`}
                    >
                        {flavour.name}
                    </h2>
                    {body && (
                        <p className="mt-3 text-base leading-relaxed text-primary-text/80 dark:text-primary-text-light/80">
                            {body}
                        </p>
                    )}
                    {allergens.length > 0 && (
                        <p className="mt-5 text-[11px] uppercase tracking-wide text-primary-text/60 dark:text-primary-text-light/60">
                            Contains {allergens.join(' · ')}
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}
