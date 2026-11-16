import { hydrationContext, isHydrationError } from '../AnalyticsProvider';

describe('isHydrationError', () => {
	it('matches the minified React hydration errors', () => {
		for (const code of [418, 422, 425]) {
			const message = `Minified React error #${code}; visit https://reactjs.org/docs/error-decoder.html?invariant=${code} for the full message`;
			expect(isHydrationError({ $exception_list: [{ value: message }] })).toBe(true);
		}
	});

	it('matches the development messages', () => {
		expect(isHydrationError({ $exception_values: ['Hydration failed because the initial UI does not match what was rendered on the server.'] })).toBe(true);
		expect(isHydrationError({ $exception_values: ['Text content does not match server-rendered HTML.'] })).toBe(true);
	});

	it('ignores other errors', () => {
		expect(isHydrationError({ $exception_list: [{ value: 'Minified React error #300' }] })).toBe(false);
		expect(isHydrationError({ $exception_values: ['ChunkLoadError: Loading chunk 5589 failed.'] })).toBe(false);
		expect(isHydrationError(undefined)).toBe(false);
	});
});

describe('hydrationContext', () => {
	afterEach(() => {
		document.documentElement.className = '';
		document.body.innerHTML = '';
		delete (window as unknown as { Cookiebot?: unknown }).Cookiebot;
	});

	it('reports the route and a clean page', () => {
		window.history.pushState({}, '', '/?utm_source=x');
		document.body.innerHTML = '<div id="app"></div>';
		const ctx = hydrationContext();
		expect(ctx.hydration_route).toBe('/');
		expect(ctx.hydration_translated).toBe(false);
		expect(ctx.hydration_cookiebot_has_response).toBeNull();
		expect(ctx.hydration_body_children).toEqual(['div#app']);
	});

	it('flags auto-translate, Cookiebot state and injected nodes', () => {
		window.history.pushState({}, '', '/flavours');
		document.documentElement.className = 'translated-ltr';
		document.body.innerHTML = '<div id="app"></div><div id="CybotCookiebotDialog"></div>';
		(window as unknown as { Cookiebot: unknown }).Cookiebot = { hasResponse: false, consent: { statistics: false } };
		const ctx = hydrationContext();
		expect(ctx.hydration_route).toBe('/flavours');
		expect(ctx.hydration_translated).toBe(true);
		expect(ctx.hydration_cookiebot_has_response).toBe(false);
		expect(ctx.hydration_cookiebot_statistics).toBe(false);
		expect(ctx.hydration_body_children).toEqual(['div#app', 'div#CybotCookiebotDialog']);
	});
});
