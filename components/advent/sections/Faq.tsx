import { COPY } from '../content';
import { MUTED, HEADING, SectionHeading } from './ui';

/**
 * Native <details>, so it opens and closes with no JavaScript and every
 * answer is in the server HTML for search engines.
 */
export default function Faq() {
    const f = COPY.faq;
    return (
        <section className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex max-w-[760px] flex-col gap-6 px-6 py-[72px]">
                <SectionHeading className={`text-center ${HEADING}`}>{f.heading}</SectionHeading>
                <div>
                    {f.items.map((item, i) => (
                        <details key={item.q} open={i === 0} className="group border-b border-gray-200 py-2 dark:border-gray-700">
                            <summary className={`flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden ${HEADING}`}>
                                {item.q}
                                <span aria-hidden="true" className="text-2xl leading-none text-primary transition-transform group-open:rotate-45 dark:text-primary-light">+</span>
                            </summary>
                            <p className={`mb-2 mt-1 ${MUTED}`}>{item.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
