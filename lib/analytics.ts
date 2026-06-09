// GA4 ecommerce event helpers. Safe to call anywhere — no-ops on server or if gtag isn't loaded.

type GA4Item = {
    item_id?: string | number;
    item_name: string;
    price?: number;
    quantity?: number;
};

function gtagEvent(name: string, params: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    const gtag = (window as any).gtag;
    if (typeof gtag !== 'function') return;
    gtag('event', name, params);
}

export function trackViewItem(item: GA4Item): void {
    gtagEvent('view_item', {
        currency: 'GBP',
        value: item.price,
        items: [item],
    });
}

export function trackAddToCart(item: GA4Item): void {
    gtagEvent('add_to_cart', {
        currency: 'GBP',
        value: (item.price ?? 0) * (item.quantity ?? 1),
        items: [item],
    });
}

export function trackBeginCheckout(value?: number): void {
    gtagEvent('begin_checkout', {
        currency: 'GBP',
        ...(value !== undefined && { value }),
    });
}

export function trackViewCart(value?: number): void {
    gtagEvent('view_cart', {
        currency: 'GBP',
        ...(value !== undefined && { value }),
    });
}
