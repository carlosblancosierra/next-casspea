import Image from 'next/image';
import TrustpilotRating from '@/components/common/TrustpilotRating';
import Countdown from '../Countdown';
import LeadHeroForm from '../LeadHeroForm';
import { COPY, type Variant } from '../content';
import { Eyebrow, MUTED, HEADING } from './ui';
import type { ReactNode } from 'react';

interface Props {
    variant: Variant;
    price: string;
    serverNow: number;
    buyButton: ReactNode;
    image: string;
}

export default function Hero({ variant, price, serverNow, buyButton, image }: Props) {
    const facts = [price, ...COPY.hero.facts];
    return (
        <section className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <Eyebrow>{COPY.hero.eyebrow}</Eyebrow>
                <h1 className={`m-0 font-playfair text-[clamp(40px,6vw,80px)] font-bold leading-none tracking-tight ${HEADING}`}>
                    {COPY.hero.heading}
                </h1>
                <p className={`m-0 text-xl leading-[30px] ${MUTED}`}>{COPY.hero.body}</p>
                <ul className={`m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[15px] font-medium ${HEADING}`}>
                    {facts.map((fact, i) => (
                        <li key={fact} className="flex items-center gap-5">
                            {i > 0 && <span aria-hidden="true" className="text-gray-400">·</span>}
                            {fact}
                        </li>
                    ))}
                </ul>
                {variant === 'shop' ? (
                    <div className="flex flex-wrap items-center gap-3">
                        {buyButton}
                        <a href="#inside" className="inline-flex min-h-[44px] items-center px-3 font-medium text-primary underline-offset-4 hover:underline dark:text-primary-light">
                            {COPY.hero.secondary}
                        </a>
                    </div>
                ) : (
                    <LeadHeroForm buyButton={buyButton} />
                )}
                <TrustpilotRating href="#reviews" className="!justify-start" linkClassName="inline-flex min-h-[44px] items-center text-primary-text dark:text-primary-text-light" />
            </div>
            <div className="flex flex-col gap-4">
                <Image
                    src={image}
                    alt={COPY.hero.imageAlt}
                    width={1200}
                    height={1200}
                    priority
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="aspect-square w-full rounded-2xl object-cover"
                />
                <Countdown serverNow={serverNow} layout="boxes" />
            </div>
        </section>
    );
}
