'use client';

import { useEffect, useRef, useState } from 'react';
import { useAssignVariantMutation, useRecordExperimentEventMutation } from '@/redux/features/experiments/experimentApiSlice';

/**
 * Asks the server which variant this visitor should see.
 *
 * The assignment is stored against the same Django session the cart uses, so
 * it is sticky across reloads without any cookie of our own, and the purchase
 * side of the funnel is a database join rather than something the browser has
 * to survive the trip to Stripe to report.
 *
 * Every failure resolves to `control`. A broken experiment endpoint must
 * degrade to today's shop, never to a blank page or a stuck spinner.
 */
export function useExperiment(experiment: string) {
    const [assignVariant] = useAssignVariantMutation();
    const [recordEvent] = useRecordExperimentEventMutation();

    const [variant, setVariant] = useState<string>('control');
    const [isLoading, setIsLoading] = useState(true);
    // React 18 StrictMode mounts effects twice in development; without this the
    // page would ask for an assignment twice on every load.
    const requested = useRef(false);

    useEffect(() => {
        if (requested.current) return;
        requested.current = true;

        let cancelled = false;
        assignVariant({ experiment })
            .unwrap()
            .then(response => {
                if (!cancelled) setVariant(response.variant || 'control');
            })
            .catch(() => {
                // Deliberately silent: control is already the state.
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => { cancelled = true; };
    }, [assignVariant, experiment]);

    /** Fire-and-forget: a lost funnel event must never fail a customer action. */
    const track = (name: string) => {
        recordEvent({ experiment, name }).unwrap().catch(() => {});
    };

    return { variant, isLoading, track };
}
