import * as Sentry from '@sentry/nextjs';

interface CookiebotWindow {
	Cookiebot?: {
		hasResponse?: boolean;
		consent?: { statistics?: boolean };
	};
}

/**
 * Sentry Session Replay: a recording of what the visitor did before an error.
 *
 * Replay keeps its session id in sessionStorage, so like PostHog's replays it
 * only starts once the visitor accepts statistics cookies in Cookiebot, and it
 * stops if they withdraw that. Without consent Sentry still reports errors, as
 * before, just without a recording.
 *
 * All text is masked and images, video and SVGs are blocked (Sentry's
 * defaults), so customers' names, emails and addresses never leave the page.
 *
 *   NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE  share of sessions recorded, 0..1 (default 0.1)
 *   NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE share of sessions with an error recorded, 0..1 (default 1)
 */
function rate(value: string | undefined, fallback: number): number {
	const parsed = Number(value);
	return value !== undefined && value !== '' && Number.isFinite(parsed) ? parsed : fallback;
}

export const replaysSessionSampleRate = rate(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE, 0.1);
export const replaysOnErrorSampleRate = rate(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE, 1);

function hasStatisticsConsent(): boolean {
	const cookiebot = (window as unknown as CookiebotWindow).Cookiebot;
	return !!cookiebot?.hasResponse && !!cookiebot.consent?.statistics;
}

/** Starts or stops replay to match the visitor's Cookiebot answer. */
export function syncReplayWithConsent(): void {
	const replay = Sentry.getReplay();
	if (hasStatisticsConsent()) {
		// Added once per page load, then sampled by the rates above. A visitor
		// who withdraws and accepts again is recorded from the next page load:
		// replay.start() would skip sampling and record every such session.
		if (!replay) {
			Sentry.addIntegration(Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }));
		}
	} else if (replay?.getReplayId()) {
		void replay.stop();
	}
}

export function installSentryReplay(): void {
	if (typeof window === 'undefined' || !Sentry.getClient()?.getOptions().enabled) return;
	// Cookiebot loads synchronously, so a returning visitor's answer is
	// usually already known; the events cover a first answer or a change.
	syncReplayWithConsent();
	window.addEventListener('CookiebotOnConsentReady', syncReplayWithConsent);
	window.addEventListener('CookiebotOnAccept', syncReplayWithConsent);
	window.addEventListener('CookiebotOnDecline', syncReplayWithConsent);
}
