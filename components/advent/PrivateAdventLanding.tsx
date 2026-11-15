'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectAuthLoading, selectIsAuthenticated } from '@/redux/features/auth/authSlice';
import { useGetAdventLandingQuery } from '@/redux/features/products/adventLandingApiSlice';
import AdventLanding from './AdventLanding';
import { ADVENT_PATH, type Variant } from './content';

/**
 * The landing before it is live. The server cannot tell who is visiting (the
 * shop keeps its JWT in the browser), so the page asks the API from here, with
 * the signed-in user's token. Staff get the landing; everyone else gets the
 * API's 404 and a short note, with a sign-in link for visitors.
 */
export default function PrivateAdventLanding({ variant }: { variant: Variant }) {
    const pathname = usePathname() || ADVENT_PATH;
    const signedIn = useAppSelector(selectIsAuthenticated);
    const authLoading = useAppSelector(selectAuthLoading);
    const { data, isLoading, isFetching, isError } = useGetAdventLandingQuery(
        { signedIn },
        { skip: authLoading, refetchOnMountOrArgChange: true },
    );

    if (data) {
        return <AdventLanding variant={variant} product={data.product} flavours={data.flavours} />;
    }

    if (authLoading || isLoading || isFetching || !isError) {
        return (
            <p role="status" className="mx-auto max-w-xl px-6 py-24 text-center text-gray-600 dark:text-gray-400">
                Loading…
            </p>
        );
    }

    return (
        <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
            <h1 className="m-0 font-playfair text-3xl font-bold">This page isn&apos;t open yet</h1>
            {signedIn ? (
                <p className="m-0 text-gray-600 dark:text-gray-400">
                    Only the CassPea team can preview it for now.
                </p>
            ) : (
                <>
                    <p className="m-0 text-gray-600 dark:text-gray-400">CassPea team: sign in to preview it.</p>
                    <Link
                        href={`/auth/login?next=${encodeURIComponent(pathname)}`}
                        className="inline-flex min-h-[44px] items-center rounded-lg bg-primary px-5 font-semibold text-primary-text-light"
                    >
                        Sign in
                    </Link>
                </>
            )}
            <Link href="/shop-now/advent-calendar" className="inline-flex min-h-[44px] items-center text-primary underline-offset-4 hover:underline dark:text-primary-light">
                See the Advent Calendar
            </Link>
        </section>
    );
}
