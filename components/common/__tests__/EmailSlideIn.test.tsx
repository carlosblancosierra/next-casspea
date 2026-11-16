import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailSlideIn, { DISMISSED_KEY, SHOW_AFTER_MS, SUBSCRIBED_KEY } from '@/components/common/EmailSlideIn';
import { useSubscribeToNewsletterMutation } from '@/redux/features/subscribe/subscribeApiSlice';
import { usePathname } from 'next/navigation';
import { track } from '@/utils/analytics';

jest.mock('@/redux/features/subscribe/subscribeApiSlice', () => ({
    useSubscribeToNewsletterMutation: jest.fn(),
}));
jest.mock('next/navigation', () => ({ usePathname: jest.fn() }));
jest.mock('@/utils/analytics', () => ({
    ...jest.requireActual('@/utils/analytics'),
    track: jest.fn(),
}));

const subscribe = jest.fn();

beforeEach(() => {
    jest.useFakeTimers();
    window.localStorage.clear();
    subscribe.mockReset();
    subscribe.mockReturnValue({ unwrap: () => Promise.resolve({ message: 'ok' }) });
    (useSubscribeToNewsletterMutation as jest.Mock).mockReturnValue([subscribe, { isLoading: false }]);
    (usePathname as jest.Mock).mockReturnValue('/shop-now');
    (track as jest.Mock).mockClear();
});

afterEach(() => {
    jest.useRealTimers();
});

const panel = () => screen.queryByRole('complementary', { name: /10% off/i });
const wait = () => act(() => jest.advanceTimersByTime(SHOW_AFTER_MS));

describe('EmailSlideIn', () => {
    it('waits before showing, then slides in without covering the page', () => {
        render(<EmailSlideIn />);
        expect(panel()).not.toBeInTheDocument();
        wait();
        expect(panel()).toBeInTheDocument();
        // Not a modal: no backdrop, the page stays usable.
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(track).toHaveBeenCalledWith('email_capture_shown', { trigger: 'time', path: '/shop-now' });
    });

    it('shows early once the visitor has scrolled half the page', () => {
        Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
        render(<EmailSlideIn />);
        act(() => {
            window.scrollY = 700;
            fireEvent.scroll(window);
        });
        expect(panel()).toBeInTheDocument();
    });

    it.each(['/cart', '/checkout/address', '/advent-calendar', '/subscribe'])('never shows on %s', path => {
        (usePathname as jest.Mock).mockReturnValue(path);
        render(<EmailSlideIn />);
        wait();
        expect(panel()).not.toBeInTheDocument();
    });

    it('stays away for a while once dismissed', () => {
        const { unmount } = render(<EmailSlideIn />);
        wait();
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(panel()).not.toBeInTheDocument();
        expect(window.localStorage.getItem(DISMISSED_KEY)).not.toBeNull();
        expect(track).toHaveBeenCalledWith('email_capture_dismissed', { path: '/shop-now' });
        unmount();
        render(<EmailSlideIn />);
        wait();
        expect(panel()).not.toBeInTheDocument();
    });

    it('never asks someone who already subscribed', () => {
        window.localStorage.setItem(SUBSCRIBED_KEY, '1');
        render(<EmailSlideIn />);
        wait();
        expect(panel()).not.toBeInTheDocument();
    });

    it('subscribes to the newsletter, tagged with where it came from', async () => {
        jest.useRealTimers();
        render(<EmailSlideIn showAfterMs={0} />);
        const user = userEvent.setup();
        await user.type(await screen.findByLabelText('Email address'), 'ana@example.com');
        await user.click(screen.getByRole('button', { name: 'Get my 10%' }));
        expect(subscribe).toHaveBeenCalledWith({ email: 'ana@example.com', source: 'slide-in' });
        await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/check your inbox/i));
        expect(window.localStorage.getItem(SUBSCRIBED_KEY)).toBe('1');
    });
});
