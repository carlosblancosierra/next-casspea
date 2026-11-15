/**
 * Whether this browser has already left its email on the Advent page, so the
 * exit-intent popup does not ask again and the early-access hero shows the
 * buy button on a return visit. A convenience only: storage can be blocked,
 * and then the visitor just sees the form again.
 */
const KEY = 'casspea_advent_2026_subscribed';

export function hasSubscribed(): boolean {
    try {
        return window.localStorage.getItem(KEY) === '1';
    } catch {
        return false;
    }
}

export function markSubscribed(): void {
    try {
        window.localStorage.setItem(KEY, '1');
    } catch {
        // Storage blocked: nothing to remember it in.
    }
}
