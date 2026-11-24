import { render, screen } from '@testing-library/react';
import RequireStaff from '../RequireStaff';
import { useProfile } from '@/hooks';

jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('@/hooks', () => ({ useProfile: jest.fn() }));
jest.mock('@/redux/hooks', () => ({
	// RequireAuth: signed in, session restored.
	useAppSelector: (selector: (state: unknown) => unknown) =>
		selector({ auth: { isAuthenticated: true, isLoading: false } }),
}));

const mockProfile = useProfile as jest.Mock;

describe('RequireStaff', () => {
	it('shows the page to staff', () => {
		mockProfile.mockReturnValue({ isStaff: true, isLoading: false });
		render(<RequireStaff><p>Back office</p></RequireStaff>);
		expect(screen.getByText('Back office')).toBeInTheDocument();
	});

	it('keeps signed-in customers out', () => {
		mockProfile.mockReturnValue({ isStaff: false, isLoading: false });
		render(<RequireStaff><p>Back office</p></RequireStaff>);
		expect(screen.queryByText('Back office')).not.toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /for the casspea team/i })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /your account/i })).toHaveAttribute('href', '/account');
	});

	it('shows nothing while it does not know yet', () => {
		mockProfile.mockReturnValue({ isStaff: false, isLoading: true });
		render(<RequireStaff><p>Back office</p></RequireStaff>);
		expect(screen.queryByText('Back office')).not.toBeInTheDocument();
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});
});
