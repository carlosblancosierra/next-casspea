/**
 * Reloads the page once when a JavaScript chunk fails to load.
 *
 * After a deploy, a tab that was open before it still asks for the old
 * chunk file names, which no longer exist, and whatever needed that chunk
 * (a modal, the cart, the checkout) silently does nothing. PostHog showed
 * ChunkLoadError for a handful of people every week. A reload fetches the
 * new build and the click works the second time.
 *
 * The reload happens at most once a minute per tab, so a chunk that is
 * genuinely broken cannot put the page in a reload loop.
 */

const STORAGE_KEY = 'chunk-reload-at';
const MIN_INTERVAL_MS = 60_000;

export function isChunkLoadError(error: unknown): boolean {
    if (!error) return false;
    const { name, message } = error as { name?: string; message?: string };
    const text = `${name ?? ''} ${message ?? (typeof error === 'string' ? error : '')}`;
    return (
        /ChunkLoadError/.test(text) ||
        /Loading (CSS )?chunk [\w-]+ failed/i.test(text) ||
        /Failed to fetch dynamically imported module/i.test(text) ||
        /Importing a module script failed/i.test(text)
    );
}

export function reloadOnceForChunkError(
    error: unknown,
    { storage = safeSessionStorage(), reload = () => window.location.reload(), now = Date.now() } = {},
): boolean {
    if (!isChunkLoadError(error)) return false;
    try {
        const last = Number(storage?.getItem(STORAGE_KEY) ?? 0);
        if (now - last < MIN_INTERVAL_MS) return false;
        storage?.setItem(STORAGE_KEY, String(now));
    } catch {
        // No storage (private mode): still reload once; the next failure on
        // the reloaded page has no record either, but by then the new build
        // is loaded and the chunk exists.
    }
    reload();
    return true;
}

export function installChunkReload(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('error', event => reloadOnceForChunkError(event.error ?? event.message));
    window.addEventListener('unhandledrejection', event => reloadOnceForChunkError(event.reason));
}

function safeSessionStorage(): Storage | null {
    try {
        return window.sessionStorage;
    } catch {
        return null;
    }
}
