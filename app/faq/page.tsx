import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQS } from './faqs';

export const metadata: Metadata = {
    title: 'FAQ',
    description: 'Delivery, storage, allergens, bespoke orders and more — answers to the questions we get asked most.',
    alternates: { canonical: '/faq' },
};

// Lets Google show the questions as rich results.
const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
};

export default function FaqPage() {
    return (
        <div className="dark:bg-main-bg-dark min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-primary-text dark:text-white mb-6">
                    Frequently Asked Questions
                </h1>

                <section className="main-bg dark:bg-main-bg-dark rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center p-4 dark:bg-main-bg-dark rounded-lg">
                            <h2 className="font-bold text-primary dark:text-primary-2">FREE DELIVERY</h2>
                            <p className="text-primary-text dark:text-primary-text-light">On all orders over £56</p>
                        </div>
                        <div className="text-center p-4 dark:bg-main-bg-dark rounded-lg">
                            <h2 className="font-bold text-primary dark:text-primary-2">10% OFF</h2>
                            <p className="text-primary-text dark:text-primary-text-light">Subscribe to our newsletter</p>
                        </div>
                    </div>
                </section>

                <section className="main-bg dark:bg-main-bg-dark rounded-lg shadow-sm p-6">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {FAQS.map((faq) => (
                            <details key={faq.question} className="group py-4">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-primary-text dark:text-white">
                                    {faq.question}
                                    <span
                                        aria-hidden="true"
                                        className="text-2xl leading-none transition-transform group-open:rotate-45"
                                    >
                                        +
                                    </span>
                                </summary>
                                <p className="mt-3 text-primary-text dark:text-primary-text-light">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <p className="mt-8 text-center text-primary-text dark:text-primary-text-light">
                    Can&apos;t find what you&apos;re looking for?{' '}
                    <Link href="/contact" className="font-semibold underline underline-offset-2 hover:no-underline">
                        Contact us
                    </Link>
                </p>
            </div>
        </div>
    );
}
