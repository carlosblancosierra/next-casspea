import type { ReactNode } from 'react';
import { COPY, WEIGHT_GRAMS } from '../content';
import { MUTED, HEADING } from './ui';

export default function FinalCta({ price, buyButton }: { price: string; buyButton: ReactNode }) {
    return (
        <section id="buy" className="scroll-mt-24 bg-my-lblue dark:bg-secondary-bg">
            <div className="mx-auto flex max-w-[880px] flex-col items-center gap-6 px-6 py-[88px] text-center">
                <h2 className={`m-0 font-playfair text-[clamp(32px,4.4vw,56px)] font-bold leading-[1.05] tracking-tight ${HEADING}`}>
                    {COPY.finalCta.heading}
                </h2>
                <p className={`m-0 text-lg ${MUTED}`}>
                    {price} · {WEIGHT_GRAMS} g · free UK delivery
                </p>
                <p className="m-0 text-[15px] font-semibold text-primary dark:text-primary-text-light">{COPY.lateOrders}</p>
                {buyButton}
                <p className={`m-0 text-sm ${MUTED}`}>{COPY.finalCta.footnote}</p>
            </div>
        </section>
    );
}
