import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Meet the chocolatiers behind CassPea. Luxury handcrafted chocolates made with passion in our South London kitchen.',
    alternates: { canonical: 'https://www.casspea.co.uk/about-us/' },
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
