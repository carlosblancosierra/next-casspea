import Image from 'next/image';
import { COPY, REVEAL_EXCLUSIVES } from '../content';
import { SectionHeading } from './ui';

export default function Exclusives() {
    const e = COPY.exclusives;
    return (
        <section className="bg-secondary-bg text-primary-text-light">
            <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-6 py-20">
                <div className="flex flex-col items-center gap-3 text-center">
                    <SectionHeading>{e.heading}</SectionHeading>
                    <p className="m-0 max-w-[640px] text-lg">{e.body}</p>
                </div>
                <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
                    {e.items.map(item => {
                        const image: string | null = item.image;
                        return (
                            <li key={item.title} className="flex flex-col items-center gap-3 rounded-xl border border-accent px-6 py-8 text-center">
                                {REVEAL_EXCLUSIVES && image ? (
                                    <Image src={image} alt={item.name} width={96} height={96} className="h-24 w-24 rounded-full object-cover" />
                                ) : (
                                    // Gold fill, so dark lettering (accent-text).
                                    <div aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-full bg-accent font-playfair text-5xl font-bold text-accent-text">
                                        {REVEAL_EXCLUSIVES ? item.name.charAt(0) : '?'}
                                    </div>
                                )}
                                <h3 className="m-0 text-lg font-bold">{item.title}</h3>
                                {REVEAL_EXCLUSIVES ? (
                                    <>
                                        <p className="m-0 font-playfair text-2xl font-bold">{item.name}</p>
                                        <p className="m-0 text-sm">{item.description}</p>
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
