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

    it('reports every keystroke through onChange, valid or not', async () => {
        const onChange = jest.fn();
        render(<EmailForm onChange={onChange} />);

        await userEvent.type(screen.getByPlaceholderText(/email address/i), 'ab');

        // The parent tracks the raw value so it can decide when to flag an error.
        expect(onChange).toHaveBeenCalledWith('a');
        expect(onChange).toHaveBeenCalledWith('ab');
    });

    it('renders normally until the parent marks it invalid', async () => {
        // Validation state lives in the parent (CartCheckout drives this via
        // invalid={!!modalEmailError}), so the field is only red on request.
        const { rerender } = render(<EmailForm onValidEmail={jest.fn()} />);
        const input = screen.getByPlaceholderText(/email address/i);

        await userEvent.type(input, 'not-an-email');
        expect(input.className).not.toMatch(/border-red-500/);

        rerender(<EmailForm onValidEmail={jest.fn()} invalid />);
        expect(input.className).toMatch(/border-red-500/);
    });

    it('accepts and validates an initial email', () => {
        const onValidEmail = jest.fn();
        render(<EmailForm onValidEmail={onValidEmail} initialEmail="saved@example.com" />);

        expect(screen.getByDisplayValue('saved@example.com')).toBeInTheDocument();
        expect(onValidEmail).toHaveBeenCalledWith('saved@example.com');
    });
});
