import { Flavour } from '@/types/flavours';
import FlavourGridClient from './FlavourGridClient';

async function fetchFlavours(): Promise<Flavour[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_HOST}/api/flavours/`,
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function FlavourGridServer() {
    const flavours = await fetchFlavours();
    return <FlavourGridClient flavours={flavours} />;
}
