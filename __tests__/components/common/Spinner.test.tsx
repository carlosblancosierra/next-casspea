import { render, screen } from '@testing-library/react';
import Spinner from '@/components/common/Spinner';

describe('Spinner', () => {
  it('renders with role status', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has accessible loading text for screen readers', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies sm size classes', () => {
    render(<Spinner sm />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('w-4', 'h-4');
  });

  it('applies md size classes', () => {
    render(<Spinner md />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('w-6', 'h-6');
  });

  it('applies lg size classes', () => {
    render(<Spinner lg />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('w-8', 'h-8');
  });

  it('applies custom className', () => {
    render(<Spinner className="my-custom-class" />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('my-custom-class');
  });

  it('uses correct Tailwind color tokens', () => {
    render(<Spinner />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('text-gray-300', 'fill-primary');
    expect(svg).not.toHaveClass('text-white-300', 'fill-white-300');
  });
});
