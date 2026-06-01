import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressForm from '@/components/address/AddressForm';
import { Address } from '@/types/addresses';

const noop = () => {};

describe('AddressForm', () => {
  it('renders all required shipping fields', () => {
    render(<AddressForm onAddressSubmit={noop} addressType="SHIPPING" />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  });

  it('prefills country as United Kingdom for SHIPPING type', () => {
    render(<AddressForm onAddressSubmit={noop} addressType="SHIPPING" />);
    expect(screen.getByDisplayValue('United Kingdom')).toBeInTheDocument();
  });

  it('country field is readonly for SHIPPING type', () => {
    render(<AddressForm onAddressSubmit={noop} addressType="SHIPPING" />);
    expect(screen.getByLabelText(/Country/i)).toHaveAttribute('readonly');
  });

  it('country field is editable for BILLING type', () => {
    render(<AddressForm onAddressSubmit={noop} addressType="BILLING" />);
    expect(screen.getByLabelText(/Country/i)).not.toHaveAttribute('readonly');
  });

  it('postcode input has UK pattern validation', () => {
    render(<AddressForm onAddressSubmit={noop} addressType="SHIPPING" />);
    const postcode = screen.getByLabelText(/Postcode/i);
    expect(postcode).toHaveAttribute('pattern', expect.stringContaining('[A-Z]'));
  });

  it('phone input has UK pattern validation', () => {
    render(<AddressForm onAddressSubmit={noop} addressType="SHIPPING" />);
    const phone = screen.getByLabelText(/Phone/i);
    expect(phone).toHaveAttribute('pattern', expect.stringContaining('44'));
  });

  it('calls onAddressSubmit when a field changes', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    render(<AddressForm onAddressSubmit={handleSubmit} addressType="SHIPPING" />);
    await user.type(screen.getByLabelText(/First Name/i), 'A');
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('populates fields from initialData', () => {
    const initialData: Partial<Address> = {
      first_name: 'Jane',
      last_name: 'Smith',
      city: 'London',
    } as Address;
    render(<AddressForm onAddressSubmit={noop} addressType="SHIPPING" initialData={initialData as Address} />);
    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
  });
});
