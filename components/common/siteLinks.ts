/**
 * Links and contact details shared by the navbar, the footer and the
 * FAQ / Contact pages, so a changed phone number or a new page only has to be
 * edited here.
 */

export interface SiteLink {
	name: string;
	href: string;
	external?: boolean;
}

export const TRACK_ORDER_URL = 'https://www.royalmail.com/track-your-item';

/** Top navigation, in display order. */
export const NAVIGATION: SiteLink[] = [
	{ name: 'Store', href: '/shop-now' },
	{ name: 'Flavours', href: '/flavours' },
	{ name: 'Personalised', href: '/personalised' },
	{ name: 'Track', href: TRACK_ORDER_URL, external: true },
	{ name: 'FAQ', href: '/faq' },
	{ name: 'Contact', href: '/contact' },
	{ name: 'About Us', href: '/about-us' },
];

export const CONTACT = {
	phone: { number: '07859 790386', href: 'tel:07859790386' },
	email: { address: 'info@casspea.co.uk', href: 'mailto:info@casspea.co.uk' },
	whatsapp: { href: 'https://wa.me/447859790386' },
	address: '104 Bedford Hill, London, SW12 9HR',
	instagram: { handle: '@casspea_', href: 'https://www.instagram.com/casspea_/' },
};

export const COMPANY = {
	name: 'CassPea Ltd',
	number: '14307063',
};

/** Footer columns: every navbar page, grouped, plus what a footer is expected to hold. */
export const FOOTER_SECTIONS: { title: string; links: SiteLink[] }[] = [
	{
		title: 'Shop',
		links: [
			{ name: 'Store', href: '/shop-now' },
			{ name: 'Flavours', href: '/flavours' },
			{ name: 'Personalised', href: '/personalised' },
		],
	},
	{
		title: 'Help',
		links: [
			{ name: 'FAQ', href: '/faq' },
			{ name: 'Contact', href: '/contact' },
			{ name: 'Track your order', href: TRACK_ORDER_URL, external: true },
		],
	},
	{
		title: 'CassPea',
		links: [
			{ name: 'About Us', href: '/about-us' },
			{ name: 'Instagram', href: CONTACT.instagram.href, external: true },
			{ name: 'Log In', href: '/orders' },
		],
	},
];
