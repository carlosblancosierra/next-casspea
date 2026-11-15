import TrustpilotRating, { TRUSTPILOT_URL } from '@/components/common/TrustpilotRating';
import { COPY } from '../content';
import { CARD, HEADING, SectionHeading } from './ui';

export default function Reviews() {
    const r = COPY.reviews;
    return (
        <section id="reviews" className="mx-auto flex max-w-[1100px] scroll-mt-24 flex-col gap-8 px-6 py-20">
            <div className="flex flex-col items-center gap-3 text-center">
                <SectionHeading className={HEADING}>{r.heading}</SectionHeading>
                <TrustpilotRating href={TRUSTPILOT_URL} linkClassName="inline-flex min-h-[44px] items-center text-primary-text dark:text-primary-text-light" />
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
                {r.items.map((item, i) => (
                    <li key={i}>
                        <figure className={`m-0 flex h-full flex-col gap-3 p-6 ${CARD}`}>
                            <blockquote className={`m-0 font-playfair text-xl leading-7 ${HEADING}`}>&ldquo;{item.quote}&rdquo;</blockquote>
                            <figcaption className="text-sm text-gray-600 dark:text-gray-400">{item.name}</figcaption>
                        </figure>
                    </li>
                ))}
            </ul>
        </section>
    );
}
