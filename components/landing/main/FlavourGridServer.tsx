import FlavourGridClient from './FlavourGridClient';
import { getFlavours } from '@/utils/flavours';

export default async function FlavourGridServer() {
    const flavours = await getFlavours();
    return <FlavourGridClient flavours={flavours} />;
}
