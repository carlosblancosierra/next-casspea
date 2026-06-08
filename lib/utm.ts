const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const SESSION_KEY = 'casspea_utm';

export type UTMParams = Partial<Record<typeof UTM_KEYS[number], string>>;

export function captureUTMs(searchParams: URLSearchParams): void {
    if (typeof window === 'undefined') return;
    // Don't overwrite UTMs already captured in this session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const utms: UTMParams = {};
    UTM_KEYS.forEach(key => {
        const val = searchParams.get(key);
        if (val) (utms as Record<string, string>)[key] = val;
    });

    if (Object.keys(utms).length > 0) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(utms));
    }
}

export function getStoredUTMs(): UTMParams {
    if (typeof window === 'undefined') return {};
    try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}
