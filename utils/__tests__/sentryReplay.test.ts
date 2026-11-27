import * as Sentry from '@sentry/nextjs';
import { installSentryReplay, syncReplayWithConsent } from '@/utils/sentryReplay';

jest.mock('@sentry/nextjs', () => ({
	getClient: jest.fn(),
	getReplay: jest.fn(),
	addIntegration: jest.fn(),
	replayIntegration: jest.fn(options => ({ name: 'Replay', options })),
}));

const mocked = Sentry as jest.Mocked<typeof Sentry>;

function setConsent(cookiebot: { hasResponse?: boolean; consent?: { statistics?: boolean } } | undefined) {
	(window as unknown as { Cookiebot?: unknown }).Cookiebot = cookiebot;
}

function fakeReplay(replayId: string | undefined) {
	return { getReplayId: jest.fn(() => replayId), stop: jest.fn(() => Promise.resolve()), start: jest.fn() };
}

beforeEach(() => {
	jest.clearAllMocks();
	setConsent(undefined);
	mocked.getReplay.mockReturnValue(undefined);
});

describe('syncReplayWithConsent', () => {
	it('records nothing before the visitor answers Cookiebot', () => {
		syncReplayWithConsent();
		expect(mocked.addIntegration).not.toHaveBeenCalled();
	});

	it('records nothing when statistics cookies are declined', () => {
		setConsent({ hasResponse: true, consent: { statistics: false } });
		syncReplayWithConsent();
		expect(mocked.addIntegration).not.toHaveBeenCalled();
	});

	it('adds replay, with text masked and media blocked, once statistics are accepted', () => {
		setConsent({ hasResponse: true, consent: { statistics: true } });
		syncReplayWithConsent();
		expect(mocked.replayIntegration).toHaveBeenCalledWith({ maskAllText: true, blockAllMedia: true });
		expect(mocked.addIntegration).toHaveBeenCalledTimes(1);
	});

	it('does not add replay twice', () => {
		setConsent({ hasResponse: true, consent: { statistics: true } });
		mocked.getReplay.mockReturnValue(fakeReplay('abc') as never);
		syncReplayWithConsent();
		expect(mocked.addIntegration).not.toHaveBeenCalled();
	});

	it('stops a running replay when consent is withdrawn', () => {
		const replay = fakeReplay('abc');
		mocked.getReplay.mockReturnValue(replay as never);
		setConsent({ hasResponse: true, consent: { statistics: false } });
		syncReplayWithConsent();
		expect(replay.stop).toHaveBeenCalled();
		expect(replay.start).not.toHaveBeenCalled();
	});
});

describe('installSentryReplay', () => {
	it('does nothing when Sentry is off (no DSN)', () => {
		mocked.getClient.mockReturnValue({ getOptions: () => ({ enabled: false }) } as never);
		setConsent({ hasResponse: true, consent: { statistics: true } });
		installSentryReplay();
		expect(mocked.addIntegration).not.toHaveBeenCalled();
	});

	it('starts replay when the visitor accepts after the page loaded', () => {
		mocked.getClient.mockReturnValue({ getOptions: () => ({ enabled: true }) } as never);
		installSentryReplay();
		expect(mocked.addIntegration).not.toHaveBeenCalled();

		setConsent({ hasResponse: true, consent: { statistics: true } });
		window.dispatchEvent(new Event('CookiebotOnAccept'));
		expect(mocked.addIntegration).toHaveBeenCalledTimes(1);
	});
});
