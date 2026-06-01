import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GiftMessage from '@/components/cart/GiftMessage';

describe('GiftMessage', () => {
  it('renders textarea', () => {
    render(<GiftMessage onGiftMessageChange={jest.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows 0/250 counter initially', () => {
    render(<GiftMessage onGiftMessageChange={jest.fn()} />);
    expect(screen.getByText('0/250')).toBeInTheDocument();
  });

  it('updates counter as user types', async () => {
    const user = userEvent.setup();
    render(<GiftMessage onGiftMessageChange={jest.fn()} />);
    await user.type(screen.getByRole('textbox'), 'Hello');
    expect(screen.getByText('5/250')).toBeInTheDocument();
  });

  it('counter turns red when at max length', async () => {
    const user = userEvent.setup();
    render(<GiftMessage onGiftMessageChange={jest.fn()} />);
    const longMessage = 'a'.repeat(250);
    await user.type(screen.getByRole('textbox'), longMessage);
    expect(screen.getByText('250/250')).toHaveClass('text-red-500');
  });

  it('counter is gray below max length', async () => {
    const user = userEvent.setup();
    render(<GiftMessage onGiftMessageChange={jest.fn()} />);
    await user.type(screen.getByRole('textbox'), 'Short message');
    const counter = screen.getByText('13/250');
    expect(counter).not.toHaveClass('text-red-500');
    expect(counter).toHaveClass('text-gray-400');
  });

  it('enforces maxLength of 250', () => {
    render(<GiftMessage onGiftMessageChange={jest.fn()} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '250');
  });

  it('calls onGiftMessageChange as user types', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<GiftMessage onGiftMessageChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'Hi');
    expect(onChange).toHaveBeenCalledWith('H');
    expect(onChange).toHaveBeenCalledWith('Hi');
  });

  it('populates with initialMessage', () => {
    render(<GiftMessage onGiftMessageChange={jest.fn()} initialMessage="Happy birthday!" />);
    expect(screen.getByDisplayValue('Happy birthday!')).toBeInTheDocument();
    expect(screen.getByText('15/250')).toBeInTheDocument();
  });
});
