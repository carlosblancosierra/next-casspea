'use client';

import { notFound, useParams } from 'next/navigation';
import RequireAuth from '@/components/utils/RequireAuth';
import ClientPortal from '@/components/client-portal/ClientPortal';
import { getClientPage } from '@/components/client-portal/clientPages';

export default function Page() {
    const params = useParams();
    const client = getClientPage(params.slug as string);

    if (!client) notFound();

    return (
        <main className="mx-auto max-w-screen-xl px-4">
            <RequireAuth>
                <ClientPortal client={client} />
            </RequireAuth>
        </main>
    );
}
