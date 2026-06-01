import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailForm from '@/components/cart/EmailForm';

describe('EmailForm', () => {
  it('renders email input', () => {
    render(<EmailForm onValidEmail={jest.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<EmailForm onValidEmail={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Enter your email address/i)).toBeInTheDocument();
  });

  it('calls onValidEmail with a valid email', async () => {
    const user = userEvent.setup();
    const onValidEmail = jest.fn();
    render(<EmailForm onValidEmail={onValidEmail} />);
    await user.type(screen.getByRole('textbox'), 'test@example.com');
    expect(onValidEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('does not call onValidEmail for single-char TLD (old permissive regex)', async () => {
    const user = userEvent.setup();
    const onValidEmail = jest.fn();
    render(<EmailForm onValidEmail={onValidEmail} />);
    await user.type(screen.getByRole('textbox'), 'a@b.c');
    expect(onValidEmail).not.toHaveBeenCalled();
  });

  it('does not call onValidEmail for missing @ symbol', async () => {
    const user = userEvent.setup();
    const onValidEmail = jest.fn();
    render(<EmailForm onValidEmail={onValidEmail} />);
    await user.type(screen.getByRole('textbox'), 'notanemail');
    expect(onValidEmail).not.toHaveBeenCalled();
  });

  it('accepts email with subdomain', async () => {
    const user = userEvent.setup();
    const onValidEmail = jest.fn();
    render(<EmailForm onValidEmail={onValidEmail} />);
    await user.type(screen.getByRole('textbox'), 'user@mail.example.co.uk');
    expect(onValidEmail).toHaveBeenCalled();
  });

  it('populates with initialEmail and fires callback', () => {
    const onValidEmail = jest.fn();
    render(<EmailForm onValidEmail={onValidEmail} initialEmail="pre@filled.com" />);
    expect(screen.getByDisplayValue('pre@filled.com')).toBeInTheDocument();
    expect(onValidEmail).toHaveBeenCalledWith('pre@filled.com');
  });
});
