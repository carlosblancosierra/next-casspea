/**
 * The last email a guest checked out with, kept in this browser.
 *
 * The API keeps the email on the checkout session, and a session belongs to
 * one cart: once an order is paid the next cart starts without one, so the
 * guest was asked for their email again on every order. Remembering it here
 * lets the cart fill it in.
 */
export const SAVED_EMAIL_KEY = 'casspea_checkout_email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getSavedEmail(): string {
    try {
        const value = window.localStorage.getItem(SAVED_EMAIL_KEY) ?? '';
        return EMAIL_RE.test(value) ? value : '';
    } catch {
        return '';
    }
}

export function saveEmail(email: string): void {
    if (!EMAIL_RE.test(email)) return;
    try {
        window.localStorage.setItem(SAVED_EMAIL_KEY, email);
    } catch {
        // Storage blocked: they will be asked again next time; acceptable.
    }
}
