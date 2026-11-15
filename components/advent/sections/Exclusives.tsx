import Image from 'next/image';
import type { Flavour } from '@/types/flavours';
import { COPY, REVEAL_EXCLUSIVES } from '../content';
import { SectionHeading } from './ui';

/**
 * The calendar's exclusive flavours, from the API (Django admin → Products →
 * Advent landing → flavour category). Each card shows the flavour's photo, or
 * a gold disc with its initial until it has one.
 */
export default function Exclusives({ flavours }: { flavours: Flavour[] }) {
    const e = COPY.exclusives;
    if (flavours.length === 0) return null;
    return (
        <section className="bg-secondary-bg text-primary-text-light">
            <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-6 py-20">
                <div className="flex flex-col items-center gap-3 text-center">
                    <SectionHeading>{e.heading}</SectionHeading>
                    <p className="m-0 max-w-[640px] text-lg">{e.body}</p>
                </div>
                <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
                    {flavours.map((flavour, i) => {
                        const image = flavour.image || null;
                        return (
                            <li key={flavour.id} className="flex flex-col items-center gap-3 rounded-xl border border-accent px-6 py-8 text-center">
                                {REVEAL_EXCLUSIVES && image ? (
                                    <Image src={image} alt={flavour.name} width={96} height={96} className="h-24 w-24 rounded-full object-cover" />
                                ) : (
                                    // Gold fill, so dark lettering (accent-text).
                                    <div aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-full bg-accent font-playfair text-5xl font-bold text-accent-text">
                                        {REVEAL_EXCLUSIVES ? flavour.name.charAt(0) : '?'}
                                    </div>
                                )}
                                <h3 className="m-0 text-lg font-bold">{e.itemTitle(i + 1)}</h3>
                                {REVEAL_EXCLUSIVES ? (
                                    <>
                                        <p className="m-0 font-playfair text-2xl font-bold">{flavour.name}</p>
                                        <p className="m-0 text-sm">{flavour.mini_description}</p>
                                    </>
                                ) : (
                                    <p className="m-0 text-sm">{e.hidden}</p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
