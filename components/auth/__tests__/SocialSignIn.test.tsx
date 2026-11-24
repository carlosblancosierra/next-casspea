import { render, screen } from '@testing-library/react';

jest.mock('react-toastify', () => ({ toast: { success: jest.fn() } }));
jest.mock('@/hooks', () => ({ useAfterSignIn: () => jest.fn() }));
jest.mock('@/redux/features/auth/authApiSlice', () => ({
	useSocialLoginMutation: () => [jest.fn(), { isLoading: false }],
}));
// Google's script is not loaded in tests.
jest.mock('../GoogleSignInButton', () => {
	const GoogleSignInButton = () => <div>Google button</div>;
	return GoogleSignInButton;
});

const ENV = process.env;

import SocialSignIn from '../SocialSignIn';

describe('SocialSignIn', () => {
	afterEach(() => {
		process.env = ENV;
	});

	it('renders nothing when no provider is configured', () => {
		process.env = { ...ENV, NEXT_PUBLIC_GOOGLE_CLIENT_ID: '', NEXT_PUBLIC_MICROSOFT_CLIENT_ID: '' };
		const { container } = render(<SocialSignIn />);
		expect(container).toBeEmptyDOMElement();
	});

	it('shows only the providers that have a client ID', () => {
		process.env = { ...ENV, NEXT_PUBLIC_GOOGLE_CLIENT_ID: '', NEXT_PUBLIC_MICROSOFT_CLIENT_ID: 'ms-client' };
		render(<SocialSignIn />);
		expect(screen.getByRole('button', { name: /continue with microsoft/i })).toBeInTheDocument();
		expect(screen.queryByText('Google button')).not.toBeInTheDocument();
	});

	it('shows both when both are configured', () => {
		process.env = { ...ENV, NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'g-client', NEXT_PUBLIC_MICROSOFT_CLIENT_ID: 'ms-client' };
		render(<SocialSignIn />);
		expect(screen.getByText('Google button')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /continue with microsoft/i })).toBeInTheDocument();
	});
});
