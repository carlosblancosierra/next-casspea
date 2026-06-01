import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnnouncementBar from '@/components/common/AnnouncementBar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const { usePathname } = require('next/navigation');

describe('AnnouncementBar', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/');
  });

  it('renders on regular paths', () => {
    render(<AnnouncementBar />);
    expect(screen.getByText(/Trustpilot/i)).toBeInTheDocument();
  });

  it('hides on /blog path', () => {
    usePathname.mockReturnValue('/blog/some-post');
    const { container } = render(<AnnouncementBar />);
    expect(container.firstChild).toBeNull();
  });

  it('hides on /landing/gold path', () => {
    usePathname.mockReturnValue('/landing/gold');
    const { container } = render(<AnnouncementBar />);
    expect(container.firstChild).toBeNull();
  });

  it('shows dismiss button', () => {
    render(<AnnouncementBar />);
    expect(screen.getByLabelText('Dismiss announcement')).toBeInTheDocument();
  });

  it('hides bar after dismiss button click', async () => {
    const user = userEvent.setup();
    render(<AnnouncementBar />);
    const dismissBtn = screen.getByLabelText('Dismiss announcement');
    await user.click(dismissBtn);
    expect(screen.queryByText(/Trustpilot/i)).not.toBeInTheDocument();
  });

  it('shows free shipping message', () => {
    render(<AnnouncementBar />);
    expect(screen.getByText(/Free shipping over £55/)).toBeInTheDocument();
  });

  it('shows subscribe CTA', () => {
    render(<AnnouncementBar />);
    expect(screen.getByText(/subscribe/i)).toBeInTheDocument();
  });
});
