import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Chocolate Gift Boxes | CassPea',
  description: 'Browse our full range of luxury handcrafted chocolate gift boxes. Customise your flavours, add a personal message, and get next-day delivery across the UK.',
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
