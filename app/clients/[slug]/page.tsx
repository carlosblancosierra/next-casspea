'use client';

import { notFound, useParams } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import ClientAccessGate from '@/components/client-portal/ClientAccessGate';
import ClientPortal from '@/components/client-portal/ClientPortal';
import { useGetClientPageQuery } from '@/redux/features/clients/clientApiSlice';

// No login: the page is locked with an access code we give the client.
export default function Page() {
    const params = useParams();
    const slug = params.slug as string;
    const { data: page, isLoading, error } = useGetClientPageQuery(slug);

    if (error && 'status' in error && error.status === 404) notFound();

    return (
        <main className="mx-auto max-w-screen-xl px-4">
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Spinner md />
                </div>
            ) : !page ? (
                <p className="py-20 text-center text-primary-text/60 dark:text-primary-text-light/60">
                    This page is unavailable right now. Please try again soon.
                </p>
            ) : page.locked ? (
                <ClientAccessGate page={page} />
            ) : (
                <ClientPortal page={page} />
            )}
        </main>
    );
}
