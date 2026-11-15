'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * The Advent landing's live switch for client components (product cards, the
 * announcement bar). The root layout reads it on the server and provides it,
 * so links render right the first time, with no flash.
 */
const AdventLiveContext = createContext(false);

export function AdventLiveProvider({ live, children }: { live: boolean; children: ReactNode }) {
    return <AdventLiveContext.Provider value={live}>{children}</AdventLiveContext.Provider>;
}

export function useAdventLive(): boolean {
    return useContext(AdventLiveContext);
}
