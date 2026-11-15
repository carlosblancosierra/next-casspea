import { whatsAppUrl } from '@/components/common/whatsapp';
import { COPY } from '../content';
import { MUTED, HEADING, SectionHeading } from './ui';

export default function WhoFor() {
    const w = COPY.whoFor;
    return (
        <section className="bg-my-lblue dark:bg-secondary-bg">
            <div className="mx-auto flex max-w-[1100px] flex-col gap-8 px-6 py-[72px]">
                <SectionHeading className={`text-center ${HEADING}`}>{w.heading}</SectionHeading>
                <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
                    {w.items.map(item => (
                        <li key={item.title} className="flex flex-col gap-2 rounded-lg bg-white p-6 dark:bg-main-bg-dark">
                            <h3 className={`m-0 font-playfair text-[22px] font-bold ${HEADING}`}>{item.title}</h3>
                            <p className={`m-0 text-[15px] ${MUTED}`}>{item.body}</p>
                        </li>
                    ))}
                </ul>
                <p className={`m-0 text-center ${HEADING}`}>
                    {w.team}{' '}
                    <a
                        href={whatsAppUrl(w.teamMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center font-semibold text-primary underline underline-offset-4 dark:text-primary-text-light"
                    >
                        {w.teamLink}
                        <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
                    </a>
                </p>
            </div>
        </section>
    );
}
