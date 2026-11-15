import { COPY } from '../content';
import { Icon, MUTED, HEADING } from './ui';

export default function Guarantee() {
    const g = COPY.guarantee;
    return (
        <section className="mx-auto max-w-[880px] px-6 pb-20">
            <div className="flex flex-wrap items-center gap-7 rounded-2xl border-2 border-dashed border-accent bg-white px-8 py-10 dark:bg-gray-900">
                <Icon name="shield" size={72} strokeWidth={1.4} />
                <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-2">
                    <h2 className={`m-0 font-playfair text-[28px] font-bold leading-9 ${HEADING}`}>{g.heading}</h2>
                    <p className={`m-0 leading-[26px] ${MUTED}`}>{g.body}</p>
                </div>
            </div>
        </section>
    );
}
