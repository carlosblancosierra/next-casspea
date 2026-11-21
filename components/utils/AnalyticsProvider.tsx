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
const THIRD_PARTY_NOISE = [/Java object is gone/, /window\.webkit\.messageHandlers/];

function isThirdPartyNoise(properties: Record<string, unknown> | undefined): boolean {
	const values = (properties?.$exception_values as unknown[] | undefined) ?? [];
	const list = (properties?.$exception_list as { value?: string }[] | undefined) ?? [];
	const messages = [...values.map(String), ...list.map(e => e?.value ?? '')];
	return messages.some(m => THIRD_PARTY_NOISE.some(re => re.test(m)));
}

// TEMPORARY (CWH-134): React #418/#422/#425 on "/" do not reproduce in local
// development, and production builds drop React's component stack, so the
// event alone cannot say what differs from the server HTML. These fields tell
// the likely causes apart: Cookiebot rewriting the DOM before hydration,
// browser auto-translate, in-app browsers, or nodes injected into <body>.
// Remove once the cause is known.
const HYDRATION_ERROR = /Minified React error #(418|422|425)\b|Hydration failed|hydrating|does not match server-rendered HTML/;

function exceptionMessages(properties: Record<string, unknown> | undefined): string[] {
	const values = (properties?.$exception_values as unknown[] | undefined) ?? [];
	const list = (properties?.$exception_list as { value?: string }[] | undefined) ?? [];
	return [...values.map(String), ...list.map(e => e?.value ?? '')];
}

export function isHydrationError(properties: Record<string, unknown> | undefined): boolean {
	return exceptionMessages(properties).some(m => HYDRATION_ERROR.test(m));
}

export function hydrationContext(): Record<string, unknown> {
	const cookiebot = (window as unknown as CookiebotWindow).Cookiebot;
	const html = document.documentElement;
	return {
		hydration_route: window.location.pathname,
		hydration_cookiebot_has_response: cookiebot ? !!cookiebot.hasResponse : null,
		hydration_cookiebot_statistics: cookiebot ? !!cookiebot.consent?.statistics : null,
		hydration_translated: /\btranslated-(ltr|rtl)\b/.test(html.className) || !!document.querySelector('font[style]'),
		hydration_html_lang: html.lang,
		hydration_in_app_browser: /FBAN|FBAV|Instagram|TikTok|Line\//.test(navigator.userAgent),
		hydration_body_children: Array.from(document.body.children)
			.slice(0, 20)
			.map(el => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '')),
		hydration_ms_since_load: Math.round(performance.now()),
	};
}

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
			// Errors from in-app browsers' own JavaScript bridges, not our code.
			// "Java object is gone" alone was 373 of 452 people with an error.
			before_send: event => {
				if (event?.event === '$exception' && isThirdPartyNoise(event.properties)) return null;
				if (event?.event === '$exception' && isHydrationError(event.properties)) {
					Object.assign(event.properties, hydrationContext());
				}
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
		};
	}, []);

	return null;
}
