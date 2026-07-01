import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailForm from '@/components/cart/EmailForm';

describe('EmailForm', () => {
    it('calls onValidEmail as soon as a valid email is typed', async () => {
        const onValidEmail = jest.fn();
        render(<EmailForm onValidEmail={onValidEmail} />);

        await userEvent.type(screen.getByPlaceholderText(/email address/i), 'user@example.com');

        expect(onValidEmail).toHaveBeenCalledWith('user@example.com');
    });

    it('does not call onValidEmail for an invalid email', async () => {
        const onValidEmail = jest.fn();
        render(<EmailForm onValidEmail={onValidEmail} />);

        await userEvent.type(screen.getByPlaceholderText(/email address/i), 'not-an-email');

        expect(onValidEmail).not.toHaveBeenCalled();
    });

    it('shows an error after leaving the field with an invalid email', async () => {
        render(<EmailForm onValidEmail={jest.fn()} />);
        const input = screen.getByPlaceholderText(/email address/i);

        await userEvent.type(input, 'not-an-email');
        await userEvent.tab(); // blur

        expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i);
    });

    it('does not show an error while typing or when the field is empty', async () => {
        render(<EmailForm onValidEmail={jest.fn()} />);
        const input = screen.getByPlaceholderText(/email address/i);

        await userEvent.type(input, 'not-an-email');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        await userEvent.clear(input);
        await userEvent.tab();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('accepts and validates an initial email', () => {
        const onValidEmail = jest.fn();
        render(<EmailForm onValidEmail={onValidEmail} initialEmail="saved@example.com" />);

        expect(screen.getByDisplayValue('saved@example.com')).toBeInTheDocument();
        expect(onValidEmail).toHaveBeenCalledWith('saved@example.com');
    });
});
