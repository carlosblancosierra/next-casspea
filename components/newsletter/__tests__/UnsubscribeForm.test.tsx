import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnsubscribeForm from '@/components/newsletter/UnsubscribeForm';
import { useUnsubscribeMutation } from '@/redux/features/subscribe/subscribeApiSlice';

jest.mock('@/redux/features/subscribe/subscribeApiSlice', () => ({
    useUnsubscribeMutation: jest.fn(),
}));

const unsubscribe = jest.fn();

function openWith(search: string) {
    window.history.pushState({}, '', `/unsubscribe${search}`);
}

describe('UnsubscribeForm', () => {
    beforeEach(() => {
        unsubscribe.mockReset();
        (useUnsubscribeMutation as jest.Mock).mockReturnValue([unsubscribe, { isLoading: false }]);
    });

    it('does nothing until the button is clicked, so mail scanners unsubscribe nobody', async () => {
        openWith('?token=abc123');
        render(<UnsubscribeForm />);
        expect(await screen.findByRole('button', { name: 'Unsubscribe' })).toBeInTheDocument();
        expect(unsubscribe).not.toHaveBeenCalled();
    });

    it('sends the token from the link and confirms whose address it was', async () => {
        openWith('?token=abc123');
        unsubscribe.mockReturnValue({ unwrap: () => Promise.resolve({ email: 'a•••@example.com' }) });
        render(<UnsubscribeForm />);

        await userEvent.click(await screen.findByRole('button', { name: 'Unsubscribe' }));

        expect(unsubscribe).toHaveBeenCalledWith({ token: 'abc123' });
        expect(await screen.findByRole('heading', { name: "You're unsubscribed" })).toBeInTheDocument();
        expect(screen.getByText(/a•••@example\.com/)).toBeInTheDocument();
    });

    it('says how to get off the list when the link is broken', async () => {
        openWith('?token=tampered');
        unsubscribe.mockReturnValue({ unwrap: () => Promise.reject({ status: 400 }) });
        render(<UnsubscribeForm />);

        await userEvent.click(await screen.findByRole('button', { name: 'Unsubscribe' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(/info@casspea\.co\.uk/);
    });

    it('without a token, explains where the link is instead of offering a button', async () => {
        openWith('');
        render(<UnsubscribeForm />);
        expect(await screen.findByText(/link at the bottom of any email/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Unsubscribe' })).not.toBeInTheDocument();
    });
});
