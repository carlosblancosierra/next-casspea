import FlavourNameGrid from '@/components/flavours/FlavourNameGrid';
import { getFlavours } from '@/utils/flavours';

export default async function FlavourGridServer() {
    // The showcase list, to match what the grid keeps itself current with. The
    // featured categories (e.g. the Christmas flavours) are left out: they have
    // their own section on the page.
    const flavours = await getFlavours({ includeComingSoon: true });
    // Same grid the /flavours page uses, so the two stay in sync. It keeps
    // itself current on the client, which is what the old FlavourGridClient did.
    return (
        <section className="py-8 px-4">
            <FlavourNameGrid flavours={flavours} showDescription excludeFeatured />
        </section>
    );
}
