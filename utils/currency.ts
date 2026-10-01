const gbpFormatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
});

/**
 * Format a price (string from the API or number) as GBP, e.g. "£14.99".
 * Falls back to £0.00 for missing or malformed values so a bad API
 * response never renders "£NaN" in the cart or checkout.
 */
export const formatCurrency = (value: string | number | null | undefined): string => {
    const amount = typeof value === 'number' ? value : parseFloat(value ?? '');
    return gbpFormatter.format(Number.isFinite(amount) ? amount : 0);
};
