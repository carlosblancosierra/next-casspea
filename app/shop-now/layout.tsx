import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop Luxury Chocolate Gift Boxes',
    description: 'Browse our handcrafted chocolate gift boxes, barks and hot chocolate. Over 20 exquisite flavours made in London — perfect for gifts and special occasions.',
    alternates: { canonical: 'https://www.casspea.co.uk/shop-now/' },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return children;
}
