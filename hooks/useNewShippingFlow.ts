'use client';

import { useEffect, useState } from 'react';
import { NEW_SHIPPING_FLOW_LIVE, isNewShippingFlow } from '@/constants/featureFlags';

/**
 * Hydration-safe check for the new shipping-date flow: the first render
 * matches the server (live flag only), then the localStorage preview is
 * read in an effect.
 */
export const useNewShippingFlow = (): boolean => {
    const [enabled, setEnabled] = useState(NEW_SHIPPING_FLOW_LIVE);

    useEffect(() => {
        setEnabled(isNewShippingFlow());
    }, []);

    return enabled;
};
