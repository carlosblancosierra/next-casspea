import { NextResponse, type NextRequest } from 'next/server';

/**
 * Keeps the Advent Calendar landing private while its copy is finished.
 *
 * /advent-calendar and /advent-calendar/early-access ask for a password
 * (HTTP Basic auth, any username). The password is the Amplify environment
 * variable ADVENT_PREVIEW_PASSWORD, which amplify.yml writes to
 * .env.production at build time. Without it the pages answer 404, so a build
 * that is missing the variable never shows the landing to the public.
 *
 * To launch the landing, delete this file (and the force-dynamic exports in
 * app/advent-calendar) and link it from the home page again.
 */
export const config = {
    matcher: ['/advent-calendar', '/advent-calendar/:path*'],
};

const REALM = 'CassPea preview';

/** Compares in time that does not depend on where the strings differ. */
function sameText(a: string, b: string): boolean {
    let diff = a.length ^ b.length;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
    }
    return diff === 0;
}

/** The password from an `Authorization: Basic …` header, or null. */
export function passwordFrom(header: string | null): string | null {
    if (!header?.startsWith('Basic ')) return null;
    try {
        const decoded = atob(header.slice('Basic '.length).trim());
        const colon = decoded.indexOf(':');
        return colon === -1 ? null : decoded.slice(colon + 1);
    } catch {
        return null;
    }
}

const NO_STORE = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' };

export function middleware(request: NextRequest) {
    const expected = process.env.ADVENT_PREVIEW_PASSWORD;
    if (!expected) {
        return new NextResponse('Not found', { status: 404, headers: NO_STORE });
    }

    const given = passwordFrom(request.headers.get('authorization'));
    if (given === null || !sameText(given, expected)) {
        return new NextResponse('Password required', {
            status: 401,
            headers: { ...NO_STORE, 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` },
        });
    }

    const response = NextResponse.next();
    response.headers.set('Cache-Control', NO_STORE['Cache-Control']);
    response.headers.set('Vary', NO_STORE.Vary);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
}
