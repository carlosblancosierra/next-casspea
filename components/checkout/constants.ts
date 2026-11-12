/**
 * Collecting the order from the Bedford Hill store instead of having it
 * delivered. It is a real ShippingOption row on the backend, so checkout
 * treats it like any other option, but the UI has to single it out to show
 * the date/time picker instead of a courier.
 *
 * Recognised by what the service is, not by the row's id: the id was a
 * hardcoded 34, which only exists in the production database, so pickup broke
 * on any other environment (BUG-13). The API matches it the same way
 * (PICKUP_DELIVERY_SPEED in casspea-v2's checkout/serializers.py).
 */
export const PICKUP_DELIVERY_SPEED = 'PICKUP';

export const isStorePickup = (option?: { delivery_speed?: string } | null): boolean =>
    option?.delivery_speed === PICKUP_DELIVERY_SPEED;
