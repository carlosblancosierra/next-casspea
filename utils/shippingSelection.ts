export interface SelectableShippingOption {
    id: number;
    disabled: boolean;
}

/**
 * Keep the selected shipping option valid.
 *
 * Shipping options are refetched whenever the cart changes (discounts move
 * prices, options get toggled off for the summer, redundant free options are
 * de-duplicated). When that happens the previously selected option can vanish
 * from the list or become disabled while the checkout still holds its id — the
 * "Proceed to Payment" button stays enabled but points at an option the
 * backend will reject, so the customer cannot pay.
 *
 * Given the currently available options and the current selection, returns the
 * id that should be selected:
 * - the current one, if it is still present and enabled;
 * - otherwise the first enabled option;
 * - or null when nothing can be selected.
 */
export const reconcileShippingSelection = <T extends SelectableShippingOption>(
    options: T[],
    currentId: number | null,
): number | null => {
    const current = options.find(o => o.id === currentId);
    if (current && !current.disabled) {
        return current.id;
    }
    const firstEnabled = options.find(o => !o.disabled);
    return firstEnabled ? firstEnabled.id : null;
};
