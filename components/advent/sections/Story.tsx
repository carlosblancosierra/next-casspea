import Image from 'next/image';
import { COPY } from '../content';
import { Eyebrow, MUTED, HEADING } from './ui';

export default function Story({ image }: { image: string }) {
    const s = COPY.story;
    return (
        <section className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 px-6 pt-[88px] md:grid-cols-2">
            <Image
                src={image}
                alt={s.imageAlt}
                width={960}
                height={1200}
                sizes="(min-width: 768px) 520px, 100vw"
                className="aspect-[4/5] w-full rounded-2xl object-cover"
            />
            <div className="flex flex-col gap-5">
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
            </div>
        </section>
    );
}
