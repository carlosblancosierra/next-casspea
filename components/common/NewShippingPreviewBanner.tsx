'use client';

import { NEW_SHIPPING_FLOW_LIVE, disableNewShippingPreview } from '@/constants/featureFlags';
import { useNewShippingFlow } from '@/hooks/useNewShippingFlow';

/**
 * Small fixed pill shown only while the new shipping-date flow is being
 * previewed via /cart2 and is not yet live for everyone.
 */
export default function NewShippingPreviewBanner() {
    const newFlow = useNewShippingFlow();

    if (NEW_SHIPPING_FLOW_LIVE || !newFlow) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full
            bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-700
            px-4 py-2 shadow-lg text-sm text-amber-900 dark:text-amber-100">
            <span>Previewing the new shipping-date checkout</span>
            <button
                type="button"
                onClick={() => {
                    disableNewShippingPreview();
                    window.location.href = '/cart';
                }}
                className="font-semibold underline hover:opacity-70"
            >
                Exit preview
            </button>
        </div>
    );
}
