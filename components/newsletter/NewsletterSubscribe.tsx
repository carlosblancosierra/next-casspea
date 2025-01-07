'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useSubscribeToNewsletterMutation } from '@/redux/features/subscribe/subscribeApiSlice';

export default function
    NewsletterSubscribe() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [subscribeToNewsletter, { isLoading: apiLoading, isError, error }] = useSubscribeToNewsletterMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await subscribeToNewsletter({ email: email }).unwrap();
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
            <div className="px-4 mx-auto lg:py-16 lg:px-6 gap-4">
                <div className="grid lg:grid-cols-2 gap-2 items-center">
                    {/* Image Section */}
                    <div className="">
                        <Image
                            src="/home/gallery/10.jpg"
                            alt="Newsletter subscription"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="rounded-lg w-full h-full"
                        />
                    </div>

                    {/* Form Section */}
                    <div className="flex flex-col md:ml-10 lg:text-left text-center gap-2 md:gap-10 justify-start h-full mt-4">
                        <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white">
                            Join our mailing list for a 10% discount
                        </h2>
                        <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
                            Be the first to hear about our latest collections, special offers and tea-time treats.
                        </p>

                        <p className="font-bold sm:text-xl dark:text-gray-400">
                            You will receive your discount code via email.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="items-center mx-auto mb-3 space-y-4 sm:flex sm:space-y-0">
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
                                        className="block p-3 pl-10 w-full text-base text-gray-900
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
