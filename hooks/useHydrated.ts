import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False during the server render and while React hydrates, true afterwards.
 *
 * For components that paint a server snapshot and then switch to live client
 * data (RTK Query). Hydration is not one step: React hydrates Suspense and
 * dynamic() boundaries one after another, so a query started by a section
 * that hydrated early can finish before a later section hydrates. If that
 * later section renders the live data straight away it no longer matches the
 * server HTML, and React throws away the page and re-renders it on the client
 * (minified errors #418 / #422 / #425). PostHog logged those on about 7% of
 * home-page visits. Gate the live data on this and the first render always
 * matches the HTML; the switch happens one render later.
 */
export function useHydrated(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
}
