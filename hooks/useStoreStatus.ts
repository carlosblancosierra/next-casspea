'use client';

import { useGetStoreStatusQuery } from '@/redux/features/checkout/checkoutApiSlice';
import { isStoreOpen, STORE_REOPEN_LABEL, STORE_ORDER_DEADLINE, SUMMER_BREAK_ENABLED } from '@/utils/storeStatus';

/**
 * Whether the shop is accepting orders, plus the reopen label and deadline.
 *
 * Prefers the backend `/checkout/store-status/` response; while that is loading
 * (or if it fails) it falls back to the hardcoded deadline in `utils/storeStatus`.
 *
 * When the Summer Break campaign is disabled the shop is always open: the backend
 * call is skipped and nothing gates checkout.
 */
export function useStoreStatus() {
    const { data } = useGetStoreStatusQuery(undefined, { skip: !SUMMER_BREAK_ENABLED });

    if (!SUMMER_BREAK_ENABLED) {
        return { isOpen: true, isClosed: false, deadlineIso: null as string | null, reopenLabel: STORE_REOPEN_LABEL };
    }

    const deadlineIso = data?.deadline ?? STORE_ORDER_DEADLINE;
    const open = data ? data.open : isStoreOpen(deadlineIso);
    const reopenLabel = data?.reopen_label || STORE_REOPEN_LABEL;

    return { isOpen: open, isClosed: !open, deadlineIso, reopenLabel };
}
