/**
 * Environment variables this app reads.
 *
 * NEXT_PUBLIC_* vars are inlined at build time and are optional: a missing
 * one yields undefined rather than a build failure, so the call sites use
 * `?? ''` fallbacks. Keeping them optional here preserves that.
 *
 * GOOGLE_MAPS_API_KEY is not read directly from process.env in app code —
 * next.config.js maps NEXT_PUBLIC_GOOGLE_MAPS_API_KEY onto it — but it is
 * declared so the mapping stays visible and typed.
 */
declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production' | 'test';

        /** Backend API origin, e.g. https://api.casspea.co.uk */
        readonly NEXT_PUBLIC_HOST?: string;
        /** Where the JWT flow returns the user after auth. */
        readonly NEXT_PUBLIC_REDIRECT_URL?: string;
        /** Deployment environment label used for gating dev-only UI. */
        readonly NEXT_PUBLIC_ENV?: string;
        /** Google Ads conversion id used by the purchase event. */
        readonly NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID?: string;

        readonly NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
        /** Injected by next.config.js from NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. */
        readonly GOOGLE_MAPS_API_KEY?: string;
    }
}
