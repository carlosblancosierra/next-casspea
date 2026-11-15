import { apiSlice } from '@/redux/services/apiSlice';
import type { AdventLandingContent } from '@/utils/adventLanding';

/**
 * The Advent landing's content, asked for from the browser with the signed-in
 * user's token. Before the landing is live the API answers it only for staff
 * (404 for everyone else).
 */
const adventLandingApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // `signedIn` only keys the cache, so signing in asks again.
        getAdventLanding: builder.query<AdventLandingContent, { signedIn: boolean }>({
            query: () => '/products/advent-landing/',
        }),
    }),
});

export const { useGetAdventLandingQuery } = adventLandingApiSlice;

export default adventLandingApiSlice;
