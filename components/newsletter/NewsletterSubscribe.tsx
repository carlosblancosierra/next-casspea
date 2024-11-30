'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function NewsletterSubscribe() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Implement newsletter subscription API call
            // const response = await subscribeToNewsletter(email);
            toast.success('Thank you for subscribing!');
            setEmail('');
        } catch (error) {
            toast.error('Failed to subscribe. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-4 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Image Section */}
                    <div className="hidden lg:block relative h-96">
                        <Image
                            src="/images/newsletter-image.jpg" // Update with your image path
                            alt="Newsletter subscription"
                            fill
                            className="rounded-lg object-cover"
                        />
                    </div>

                    {/* Form Section */}
                    <div className="mx-auto max-w-screen-md lg:text-left text-center">
                        <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                            Sign up for our newsletter for 10% OFF
                        </h2>
                        <p className="mx-auto mb-4 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400">
                            Stay up to date with the roadmap progress, announcements and exclusive discounts.
                            Feel free to sign up with your email.
                        </p>

                        <p className="mx-auto mb-4 max-w-2xl font-bold text-primary md:mb-12 sm:text-xl dark:text-gray-400">
                            You will receive a 10% off discount code via email.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
                                <div className="relative w-full">
                                    <label
                                        htmlFor="email"
                                        className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        Email address
                                    </label>
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50
                                            rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg
                                            focus:ring-indigo-500 focus:border-indigo-500
                                            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                            dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="py-3 px-5 w-full text-sm font-medium text-center text-white
                                            rounded-lg border cursor-pointer bg-indigo-600 border-indigo-600
                                            sm:rounded-none sm:rounded-r-lg hover:bg-indigo-700
                                            focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600
                                            dark:hover:bg-indigo-700 dark:focus:ring-indigo-800
                                            disabled:bg-gray-300 dark:disabled:bg-gray-600
                                            disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {isLoading ? 'Subscribing...' : 'Subscribe'}
                                    </button>
                                </div>
                            </div>
                            <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 dark:text-gray-300">
                                We care about the protection of your data.{' '}
                                <a
                                    href="/privacy-policy"
                                    className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline"
                                >
                                    Read our Privacy Policy
                                </a>.
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
