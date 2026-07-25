'use client';

import { useGetStoreStatusQuery } from '@/redux/features/checkout/checkoutApiSlice';
import { isStoreOpen, STORE_REOPEN_LABEL, STORE_ORDER_DEADLINE } from '@/utils/storeStatus';

/**
 * Whether the shop is accepting orders, plus the reopen label and deadline.
 *
 * Prefers the backend `/checkout/store-status/` response; while that is loading
 * (or if it fails) it falls back to the hardcoded deadline in `utils/storeStatus`.
 */
export function useStoreStatus() {
    const { data } = useGetStoreStatusQuery();

    const deadlineIso = data?.deadline ?? STORE_ORDER_DEADLINE;
    const open = data ? data.open : isStoreOpen(deadlineIso);
    const reopenLabel = data?.reopen_label || STORE_REOPEN_LABEL;

    return { isOpen: open, isClosed: !open, deadlineIso, reopenLabel };
}
