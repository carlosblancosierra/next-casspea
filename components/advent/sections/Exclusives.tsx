import Image from 'next/image';
import type { Flavour } from '@/types/flavours';
import { COPY, REVEAL_EXCLUSIVES } from '../content';
import { SectionHeading } from './ui';

/** The three calendar exclusives: this year's Christmas flavours from the API. */
export default function Exclusives({ flavours = [] }: { flavours?: Flavour[] }) {
    const e = COPY.exclusives;
    return (
        <section className="bg-secondary-bg text-primary-text-light">
            <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-6 py-20">
                <div className="flex flex-col items-center gap-3 text-center">
                    <SectionHeading>{e.heading}</SectionHeading>
                    <p className="m-0 max-w-[640px] text-lg">{e.body}</p>
                </div>
                <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
                    {e.items.map((item, i) => {
                        const flavour = REVEAL_EXCLUSIVES ? flavours[i] : undefined;
                        const image = flavour?.thumbnail || flavour?.image;
                        return (
                            <li key={item.title} className="flex flex-col items-center gap-3 rounded-xl border border-accent px-6 py-8 text-center">
                                {flavour && image ? (
                                    <Image src={image} alt={flavour.name} width={96} height={96} className="h-24 w-24 rounded-full object-cover" />
                                ) : (
                                    // Gold fill, so dark lettering (accent-text).
                                    <div aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-full bg-accent font-playfair text-5xl font-bold text-accent-text">
                                        ?
                                    </div>
                                )}
                                <h3 className="m-0 text-lg font-bold">{item.title}</h3>
                                {flavour && <p className="m-0 text-sm">{flavour.name}</p>}
                                {flavour?.mini_description && <p className="m-0 text-sm opacity-80">{flavour.mini_description}</p>}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
