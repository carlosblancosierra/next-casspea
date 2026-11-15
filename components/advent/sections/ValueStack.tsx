import { COPY, SHOW_BONUS } from '../content';
import { Eyebrow, HEADING, SectionHeading, SHADOW } from './ui';

function Row({ title, body, value, bonus = false }: { title: string; body: string; value: string; bonus?: boolean }) {
    return (
        <li className={`flex flex-wrap items-start justify-between gap-6 border-b border-gray-200 px-7 py-6 dark:border-gray-700 ${bonus ? 'bg-amber-50 dark:bg-amber-950/40' : ''}`}>
            <div className="min-w-0 flex-[1_1_360px]">
                <div className="flex flex-wrap items-center gap-2">
                    {bonus && (
                        <span className="rounded-full bg-amber-700 px-2 py-0.5 text-xs font-bold text-white">Bonus</span>
                    )}
                    <h3 className={`m-0 text-lg font-bold ${HEADING}`}>{title}</h3>
                </div>
                <p className="m-0 text-sm text-gray-600 dark:text-gray-400">{body}</p>
            </div>
            <div className="whitespace-nowrap font-semibold text-primary dark:text-primary-light">{value}</div>
        </li>
    );
}

export default function ValueStack({ price }: { price: string }) {
    const v = COPY.valueStack;
    return (
        <section id="inside" className="mx-auto flex max-w-[880px] scroll-mt-24 flex-col gap-8 px-6 py-20">
            <div className="flex flex-col gap-3 text-center">
                <Eyebrow>{v.eyebrow}</Eyebrow>
                <SectionHeading className={HEADING}>{v.heading}</SectionHeading>
            </div>
            <div className={`overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${SHADOW}`}>
                <ul className="m-0 list-none p-0">
                    {v.rows.map(row => <Row key={row.title} {...row} />)}
                    {SHOW_BONUS && <Row {...v.bonus} bonus />}
                </ul>
                <div className="flex flex-col items-center gap-4 bg-primary px-7 py-8 text-center text-primary-text-light">
                    <p className="m-0">{v.totalLead}</p>
                    <p className="m-0 font-playfair text-[64px] font-bold leading-none">{price}</p>
                    <p className="m-0 max-w-[560px] text-[15px] leading-6">{v.totalNote}</p>
                    {/* Gold as lettering on the navy: 4.95:1, which the
                        palette notes as the one legible gold-on-blue use. */}
                    <p className="m-0 font-semibold text-accent">{v.perMorning}</p>
                </div>
            </div>
        </section>
    );
}
