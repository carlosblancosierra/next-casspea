import { render, screen } from '@testing-library/react';
import Reviews from '@/components/common/Reviews';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('Reviews', () => {
  it('renders all 4 review cards', () => {
    render(<Reviews />);
    expect(screen.getByText('Look and taste amazing!')).toBeInTheDocument();
    expect(screen.getByText('Amazing chocolates and lovely company.')).toBeInTheDocument();
    expect(screen.getByText('Beautiful gift')).toBeInTheDocument();
    expect(screen.getByText('Above and beyond')).toBeInTheDocument();
  });

  it('renders reviewer names', () => {
    render(<Reviews />);
    expect(screen.getByText('Dani James')).toBeInTheDocument();
    expect(screen.getByText('Hannah')).toBeInTheDocument();
    expect(screen.getByText('Rosie Shaw')).toBeInTheDocument();
    expect(screen.getByText('Sian Lindstrom')).toBeInTheDocument();
  });

  it('renders review dates', () => {
    render(<Reviews />);
    expect(screen.getByText('17 May 2024')).toBeInTheDocument();
    expect(screen.getByText('5 Apr 2024')).toBeInTheDocument();
  });

  it('renders review text content', () => {
    render(<Reviews />);
    expect(screen.getByText(/Fast delivery, great box/)).toBeInTheDocument();
  });

  it('renders Trustpilot link with correct URL', () => {
    render(<Reviews />);
    const link = screen.getByRole('link', { name: /Trustpilot/i });
    expect(link).toHaveAttribute('href', 'https://uk.trustpilot.com/review/www.casspea.co.uk');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders Trustpilot stars image', () => {
    render(<Reviews />);
    expect(screen.getByAltText('Trustpilot 4.7 stars')).toBeInTheDocument();
  });
});
