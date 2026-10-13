export type NavItem = {
  name: string;
  href: string;
  current?: boolean;
  external?: boolean;
};

// Shared by the navbar and the footer, so a page added or renamed here shows
// up in both places instead of the footer quietly falling behind.
export const navigation: NavItem[] = [
  { name: 'Store', href: '/shop-now', current: false },
  { name: 'Flavours', href: '/flavours', current: false },
  { name: 'Personalised', href: '/personalised', current: false },
  // { name: 'Thermomix Giveaway', href: '/landing/thermomix', current: false },
  { name: 'Track', href: 'https://www.royalmail.com/track-your-item', current: false, external: true },
  { name: 'FAQs', href: '/faqs', current: false },
  { name: 'Contact', href: '/contact', current: false },
  { name: 'About Us', href: '/about-us', current: false },
];
