import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from '@/components/address/FormInput';

const noop = () => {};

describe('FormInput', () => {
  it('renders label and input', () => {
    render(<FormInput id="test" name="test" label="Test Field" value="" onChange={noop} />);
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
  });

  it('shows asterisk when required', () => {
    render(<FormInput id="test" name="test" label="Email" value="" onChange={noop} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show asterisk when not required', () => {
    render(<FormInput id="test" name="test" label="Email" value="" onChange={noop} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('sets aria-required when required', () => {
    render(<FormInput id="test" name="test" label="Email" value="" onChange={noop} required />);
    expect(screen.getByLabelText('Email *')).toHaveAttribute('aria-required', 'true');
  });

  it('does not set aria-required when not required', () => {
    render(<FormInput id="test" name="test" label="Phone" value="" onChange={noop} />);
    expect(screen.getByLabelText('Phone')).not.toHaveAttribute('aria-required');
  });

  it('displays the current value', () => {
    render(<FormInput id="test" name="test" label="City" value="London" onChange={noop} />);
    expect(screen.getByDisplayValue('London')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<FormInput id="test" name="test" label="City" value="" onChange={handleChange} />);
    await user.type(screen.getByLabelText('City'), 'L');
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies readOnly styling and attribute', () => {
    render(<FormInput id="test" name="test" label="Country" value="UK" onChange={noop} readOnly />);
    const input = screen.getByLabelText('Country');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveClass('cursor-not-allowed');
  });

  it('applies pattern attribute', () => {
    const pattern = '^[A-Z]{1,2}[0-9]';
    render(<FormInput id="pc" name="postcode" label="Postcode" value="" onChange={noop} pattern={pattern} />);
    expect(screen.getByLabelText('Postcode')).toHaveAttribute('pattern', pattern);
  });

  it('applies title attribute for validation hint', () => {
    render(
      <FormInput
        id="pc"
        name="postcode"
        label="Postcode"
        value=""
        onChange={noop}
        title="Enter a valid UK postcode"
      />
    );
    expect(screen.getByLabelText('Postcode')).toHaveAttribute('title', 'Enter a valid UK postcode');
  });
});
