import * as Sentry from '@sentry/nextjs';
import type { ErrorEvent } from '@sentry/nextjs';
import { isFromDeno } from '@/utils/sentryFilters';

jest.mock('@sentry/nextjs', () => ({ ...jest.requireActual('@sentry/nextjs'), init: jest.fn() }));
jest.mock('@/utils/chunkReload', () => ({ installChunkReload: jest.fn() }));

// CASSPEA-WEB-1's stack as the scraper's engine printed it. Sentry stored
// exactly these six frames, so this is what beforeSend saw.
const denoStack = [
	"TypeError: Cannot read properties of undefined (reading 'getReader')",
	'    at I (<script>:2:17783)',
	'    at <script>:2:21228',
	'    at xm (<script>:1:98865)',
	'    at <script>:1:100633',
	'    at ext:core/01_core.js:294:9',
	'    at eventLoopTick (ext:core/01_core.js:178:7)',
].join('\n');

// The same error if a real browser ever hit it on the live site.
const browserStack = [
	"TypeError: Cannot read properties of undefined (reading 'getReader')",
	'    at I (https://www.casspea.co.uk/_next/static/chunks/1530-6f33fa429702d7ef.js:2:17783)',
	'    at https://www.casspea.co.uk/_next/static/chunks/1530-6f33fa429702d7ef.js:2:21228',
].join('\n');

/** The event Sentry's browser SDK builds from an error with this stack. */
function errorEvent(stack: string): ErrorEvent {
	return {
		type: undefined,
		exception: {
			values: [{
				type: 'TypeError',
				value: "Cannot read properties of undefined (reading 'getReader')",
				stacktrace: { frames: Sentry.defaultStackParser(stack) },
			}],
		},
	};
}

describe('isFromDeno', () => {
	it('recognises the scraper behind CASSPEA-WEB-1', () => {
		expect(isFromDeno(errorEvent(denoStack))).toBe(true);
	});

	it('keeps the same error from a real browser', () => {
		expect(isFromDeno(errorEvent(browserStack))).toBe(false);
	});

	it('keeps events without a stack trace', () => {
		expect(isFromDeno({ message: 'checkout failed' })).toBe(false);
		expect(isFromDeno({ exception: { values: [{ type: 'Error', value: 'boom' }] } })).toBe(false);
	});
});

describe('the browser Sentry config', () => {
	it('drops errors from Deno and sends the rest', async () => {
		await import('@/instrumentation-client');
		const { beforeSend } = (Sentry.init as jest.Mock).mock.calls[0][0];

		expect(beforeSend(errorEvent(denoStack), {})).toBeNull();
		const fromBrowser = errorEvent(browserStack);
		expect(beforeSend(fromBrowser, {})).toBe(fromBrowser);
	});
});
