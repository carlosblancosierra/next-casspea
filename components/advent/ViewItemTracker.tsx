'use client';

import { useEffect, useRef } from 'react';
import { track, CURRENCY, type AnalyticsItem } from '@/utils/analytics';

/** Sends view_item once when the landing opens. Renders nothing. */
export default function ViewItemTracker({ item }: { item: AnalyticsItem }) {
    const sent = useRef(false);
    useEffect(() => {
        if (sent.current) return;
        sent.current = true;
        track('view_item', { currency: CURRENCY, value: item.price, items: [item] });
    }, [item]);
    return null;
}
