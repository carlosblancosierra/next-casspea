import { render, screen } from '@testing-library/react';
import PrivateAdventLanding from '../PrivateAdventLanding';

const state = { auth: { isAuthenticated: false, isLoading: false } };
const query = jest.fn();

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }), usePathname: () => '/advent-calendar' }));
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock('@/redux/hooks', () => ({
    useAppSelector: (select: (s: typeof state) => unknown) => select(state),
    useAppDispatch: () => jest.fn(),
}));
jest.mock('@/redux/features/products/adventLandingApiSlice', () => ({
    useGetAdventLandingQuery: (...args: unknown[]) => query(...args),
}));
jest.mock('@/redux/features/subscribe/subscribeApiSlice', () => ({
    useSubscribeGenericLeadMutation: () => [jest.fn(), { isLoading: false }],
}));
jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useAddCartItemMutation: () => [jest.fn(), { isLoading: false }],
}));

const notFound = { data: undefined, isLoading: false, isFetching: false, isError: true };

beforeEach(() => {
    state.auth = { isAuthenticated: false, isLoading: false };
    query.mockReset();
});

describe('the Advent landing before it is live', () => {
    it('asks a visitor to sign in, and comes back here afterwards', () => {
        query.mockReturnValue(notFound);
        render(<PrivateAdventLanding variant="shop" />);
        expect(screen.getByRole('heading', { name: "This page isn't open yet" })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Sign in' }).getAttribute('href')).toBe('/auth/login?next=%2Fadvent-calendar');
    });

    it('tells a signed-in customer it is not open, without a sign-in link', () => {
        state.auth.isAuthenticated = true;
        query.mockReturnValue(notFound);
        render(<PrivateAdventLanding variant="shop" />);
        expect(screen.getByText('Only the CassPea team can preview it for now.')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
    });

    it('shows staff the landing the API sends them', () => {
        state.auth.isAuthenticated = true;
        query.mockReturnValue({
            data: {
                live: false,
                product: { id: 42, name: 'Advent Calendar 2026', slug: 'advent-calendar', base_price: '59.99', active: true },
                flavours: [{ id: 220, name: 'Earl Grey', slug: 'earl-grey', description: '', mini_description: 'Bergamot.' }],
            },
            isLoading: false,
            isFetching: false,
            isError: false,
        });
        render(<PrivateAdventLanding variant="shop" />);
        expect(screen.getByRole('heading', { level: 1, name: 'Twenty-four mornings of edible art.' })).toBeInTheDocument();
        expect(screen.getByText('Earl Grey')).toBeInTheDocument();
        expect(query).toHaveBeenCalledWith({ signedIn: true }, expect.objectContaining({ skip: false }));
    });

    it('waits for the sign-in check before asking the API', () => {
        state.auth.isLoading = true;
        query.mockReturnValue({ data: undefined, isLoading: false, isFetching: false, isError: false });
        render(<PrivateAdventLanding variant="shop" />);
        expect(screen.getByRole('status')).toHaveTextContent('Loading');
        expect(query).toHaveBeenCalledWith({ signedIn: false }, expect.objectContaining({ skip: true }));
    });
});
