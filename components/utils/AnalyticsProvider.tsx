'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { forgetPersistentAttribution, isAnalyticsEnabled } from '@/utils/analytics';

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
const THIRD_PARTY_NOISE = [/Java object is gone/, /window\.webkit\.messageHandlers/];

function isThirdPartyNoise(properties: Record<string, unknown> | undefined): boolean {
	const values = (properties?.$exception_values as unknown[] | undefined) ?? [];
	const list = (properties?.$exception_list as { value?: string }[] | undefined) ?? [];
	const messages = [...values.map(String), ...list.map(e => e?.value ?? '')];
	return messages.some(m => THIRD_PARTY_NOISE.some(re => re.test(m)));
}

export default function AnalyticsProvider() {
	useEffect(() => {
		// Withdrawing statistics consent also drops the 30-day campaign
		// touches kept in localStorage. Runs without a PostHog key too.
		const forgetOnDecline = () => {
			const cookiebot = (window as unknown as CookiebotWindow).Cookiebot;
			if (cookiebot?.hasResponse && !cookiebot.consent?.statistics) forgetPersistentAttribution();
		};
		forgetOnDecline();
		window.addEventListener('CookiebotOnDecline', forgetOnDecline);
		const stopForgetting = () => window.removeEventListener('CookiebotOnDecline', forgetOnDecline);

		if (!isAnalyticsEnabled() || posthog.__loaded) return stopForgetting;

		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
			api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
			defaults: '2026-01-30',
			// App Router navigations are history changes, not page loads.
			capture_pageview: 'history_change',
			capture_pageleave: true,
			capture_exceptions: true,
			// Errors from in-app browsers' own JavaScript bridges, not our code.
			// "Java object is gone" alone was 373 of 452 people with an error.
			before_send: event => {
				if (event?.event === '$exception' && isThirdPartyNoise(event.properties)) return null;
				return event;
			},
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
			stopForgetting();
		};
	}, []);

	return null;
}
