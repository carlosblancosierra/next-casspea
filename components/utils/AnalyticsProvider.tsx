'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { isAnalyticsEnabled } from '@/utils/analytics';

interface CookiebotWindow {
	Cookiebot?: {
		hasResponse?: boolean;
		consent?: { statistics?: boolean };
	};
}

/**
 * Starts PostHog: pageviews, clicks (autocapture), JS errors and session
 * replays.
 *
 * Consent is Cookiebot's. Until the visitor accepts statistics cookies PostHog
 * runs in cookieless mode — anonymous counts, nothing stored on the device, no
 * replays. Accepting opts in to normal tracking; declining keeps it cookieless.
 * Cookieless mode has to be switched on in the PostHog project settings or
 * those pre-consent events are dropped.
 */
export default function AnalyticsProvider() {
	useEffect(() => {
		if (!isAnalyticsEnabled() || posthog.__loaded) return;

		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
			api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
			defaults: '2026-01-30',
			// App Router navigations are history changes, not page loads.
			capture_pageview: 'history_change',
			capture_pageleave: true,
			capture_exceptions: true,
			person_profiles: 'identified_only',
			cookieless_mode: 'on_reject',
			opt_out_capturing_by_default: true,
			session_recording: {
				// Addresses, emails and card-adjacent fields stay out of replays.
				maskAllInputs: true,
			},
		});

		const syncConsent = () => {
			const cookiebot = (window as unknown as CookiebotWindow).Cookiebot;
			if (!cookiebot?.hasResponse) return;
			if (cookiebot.consent?.statistics) {
				if (!posthog.has_opted_in_capturing()) posthog.opt_in_capturing();
			} else if (!posthog.has_opted_out_capturing()) {
				posthog.opt_out_capturing();
			}
		};

		// Cookiebot loads synchronously, so a returning visitor's answer is
		// usually already known; the events cover a first answer or a change.
		syncConsent();
		window.addEventListener('CookiebotOnConsentReady', syncConsent);
		window.addEventListener('CookiebotOnAccept', syncConsent);
		window.addEventListener('CookiebotOnDecline', syncConsent);
		return () => {
			window.removeEventListener('CookiebotOnConsentReady', syncConsent);
			window.removeEventListener('CookiebotOnAccept', syncConsent);
			window.removeEventListener('CookiebotOnDecline', syncConsent);
		};
	}, []);

	return null;
}
