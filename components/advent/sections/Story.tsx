import { COPY } from '../content';
import { Eyebrow, MUTED, HEADING } from './ui';

/** The family story. Its photo is the band that follows it. */
export default function Story() {
    const s = COPY.story;
    return (
        <section className="mx-auto flex max-w-[760px] flex-col items-center gap-5 px-6 pt-[88px] text-center">
            <Eyebrow>{s.eyebrow}</Eyebrow>
            <h2 className={`m-0 font-playfair text-[clamp(32px,4vw,52px)] font-bold leading-[1.05] tracking-tight ${HEADING}`}>
                {s.heading}
            </h2>
            {s.paragraphs.map(p => (
                <p key={p.slice(0, 20)} className={`m-0 text-lg leading-[30px] ${MUTED}`}>{p}</p>
            ))}
            <div className="flex flex-col gap-0.5 pt-2">
                <p className={`m-0 font-playfair text-2xl italic ${HEADING}`}>{s.signature}</p>
                <p className="m-0 text-sm text-gray-600 dark:text-gray-400">{s.role}</p>
            </div>
        </section>
    );
}
