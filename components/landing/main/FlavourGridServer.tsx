import FlavourNameGrid from '@/components/flavours/FlavourNameGrid';
import { getFlavours } from '@/utils/flavours';

export default async function FlavourGridServer() {
    const flavours = await getFlavours();
    // Same grid the /flavours page uses, so the two stay in sync. It keeps
    // itself current on the client, which is what the old FlavourGridClient did.
    return (
        <section className="py-8 px-4">
            <FlavourNameGrid flavours={flavours} showDescription />
        </section>
    );
}
