import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT, COMPANY } from '@/components/common/siteLinks';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Call, email or WhatsApp CassPea, or collect your order from our London kitchen at 104 Bedford Hill, SW12.',
    alternates: { canonical: '/contact' },
};

const linkClass = 'hover:text-primary dark:hover:text-primary-2 underline underline-offset-2 hover:no-underline';

export default function ContactPage() {
    return (
        <div className="dark:bg-main-bg-dark min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-primary-text dark:text-white mb-2">Contact Us</h1>
                <p className="text-primary-text dark:text-primary-text-light mb-6">
                    Questions about an order, bespoke chocolates or bulk gifting? Get in touch.
                </p>

                <section className="main-bg dark:bg-main-bg-dark rounded-lg shadow-sm p-6 mb-8">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-primary-text dark:text-primary-text-light">
                        <div>
                            <dt className="font-semibold text-primary-text dark:text-white">Phone</dt>
                            <dd className="mt-1">
                                <a href={CONTACT.phone.href} className={linkClass}>{CONTACT.phone.number}</a>
                            </dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-primary-text dark:text-white">WhatsApp</dt>
                            <dd className="mt-1">
                                <a href={CONTACT.whatsapp.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                    Message us on WhatsApp
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-primary-text dark:text-white">Email</dt>
                            <dd className="mt-1">
                                <a href={CONTACT.email.href} className={linkClass}>{CONTACT.email.address}</a>
                            </dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-primary-text dark:text-white">Instagram</dt>
                            <dd className="mt-1">
                                <a href={CONTACT.instagram.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                                    {CONTACT.instagram.handle}
                                </a>
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="font-semibold text-primary-text dark:text-white">Address / Store pickup</dt>
                            <dd className="mt-1">{CONTACT.address}</dd>
                        </div>
                    </dl>
                </section>

                <p className="text-center text-primary-text dark:text-primary-text-light">
                    Looking for delivery, storage or allergen info?{' '}
                    <Link href="/faq" className="font-semibold underline underline-offset-2 hover:no-underline">
                        Read our FAQ
                    </Link>
                </p>

                <footer className="mt-8 text-sm text-primary-text dark:text-primary-text-light">
                    <p>Company Name: {COMPANY.name}</p>
                    <p>Company Number: {COMPANY.number}</p>
                </footer>
            </div>
        </div>
    );
}
