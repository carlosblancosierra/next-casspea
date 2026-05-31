import Link from "next/link";

const CONTACT = {
    phone: { label: '07859 790386', href: 'tel:07859790386' },
    email: { label: 'info@casspea.co.uk', href: 'mailto:info@casspea.co.uk' },
};

const links = [
    { label: 'Shop', href: '/shop-now' },
    { label: 'Flavours', href: '/flavours' },
    { label: 'Help & FAQ', href: '/help' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Track Order', href: 'https://www.royalmail.com/track-your-item', external: true },
    { label: 'My Orders', href: '/orders' },
];

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-main-bg-dark border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Brand */}
                    <div>
                        <p className="text-sm font-bold text-primary-text dark:text-primary-text-light mb-2">
                            CassPea Chocolates
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Luxury handcrafted chocolate gift boxes, made in London.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                            Quick Links
                        </p>
                        <ul className="space-y-1.5">
                            {links.map(l => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        target={l.external ? '_blank' : undefined}
                                        rel={l.external ? 'noopener noreferrer' : undefined}
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                            Get In Touch
                        </p>
                        <ul className="space-y-1.5">
                            <li>
                                <a href={CONTACT.phone.href} className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                                    📞 {CONTACT.phone.label}
                                </a>
                            </li>
                            <li>
                                <a href={CONTACT.email.href} className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                                    ✉️ {CONTACT.email.label}
                                </a>
                            </li>
                            <li className="pt-1">
                                <a
                                    href="https://uk.trustpilot.com/review/www.casspea.co.uk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    ⭐ 4.7 on Trustpilot (66 reviews)
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        &copy; {new Date().getFullYear()} CassPea LTD. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
