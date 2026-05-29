'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Flavour } from '@/types/flavours';
import FlavourCard from './FlavourCard';

export default function FlavourGridClient({ flavours }: { flavours: Flavour[] }) {
    const [selected, setSelected] = useState<Flavour | null>(null);

    return (
        <section className="py-12 px-4">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-10 max-w-6xl mx-auto">
                {flavours.map(flavour => (
                    <div key={flavour.id} onClick={() => setSelected(flavour)} className="cursor-pointer">
                        <Image
                            src={flavour.image || flavour.thumbnail || '/flavours/default.png'}
                            alt={flavour.name || 'Flavour image'}
                            width={0} height={0} sizes="100vw"
                            className="w-full h-full"
                            style={{ objectFit: 'contain' }}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="dark:bg-main-bg-dark p-6 rounded-lg max-w-md w-full"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-primary-text hover:text-primary-text"
                            onClick={() => setSelected(null)}
                        >
                            &times;
                        </button>
                        <FlavourCard flavour={selected} />
                    </div>
                </div>
            )}
        </section>
    );
}
