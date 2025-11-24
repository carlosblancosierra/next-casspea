'use client';

import Image from 'next/image';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function AboutUsPage() {
    return (
        <main className="dark:bg-main-bg-dark min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-0">
                {/* Who Are We Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center mb-2">
                    <div className="order-1 lg:order-1">
                        <Image
                            src="/girl.jpeg"
                            alt="About Us"
                            width={2000}
                            height={2000}
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="order-1 lg:order-2">
                        <h2 className={`mt-2 text-3xl font-bold text-center mb-2 text-primary-text dark:text-white`}>
                            About Us
                        </h2>
                        <p className="text-primary-text dark:text-primary-text md:p-10">
                            We are a new company, created by a team of dedicated chefs with over a decade of experience in the chocolate
                            industry. <span className="text-pink-500 font-bold">We have worked in some amazing kitchens around the world, which taught us discipline and perfection in
                                our craft.</span> We want you to enjoy eating our chocolates as much as we enjoy making them.
                        </p>
                    </div>
                </section>

                {/* CassPea Story Section */}
                <section className="relative bg-[url('../public/bg-lot-1.jpeg')] bg-cover bg-center dark:bg-main-bg-dark rounded-lg shadow-lg p-4 md:p-16 mb-4 my-4">
                    <div className="absolute inset-0 bg-black/70 rounded-lg"></div>
                    <div className="relative">
                        <Image
                            src="/logos/pink.png"
                            alt="CassPea Logo"
                            width={200}
                            height={100}
                            className="mx-auto mb-6"
                        />
                        <p className="text-white">
                            CassPea (which incidentally has nothing to do with peas) is a combination of my daughters' names. The project really
                            started about 7 years ago when as newly weds, my wife and I opened a small chocolate shop in Mexico city.
                        </p>

                        <p className="text-white mt-6">
                            With little experience and a lot of passion we worked endlessly to establish a quality brand in Mexico. After 5 years
                            we decided to relocate back to the UK and start our lives with our little ones.
                        </p>

                        <p className="text-white mt-6">
                            After almost a year of being
                            back we decided that the time was right to start our enterprise again in London.
                        </p>
                    </div>
                </section>

                {/* Company Objective Section */}
                <section className="my-8">
                    <h2 className={`text-3xl font-bold text-center mb-6 text-primary-text dark:text-white`}>
                        Company's Objective
                    </h2>
                    <p className="text-center text-primary-text dark:text-primary-text">
                        CassPea is a brand that crafts artisan hand-painted chocolate bonbons. Each bonbon creates a fun experience and
                        evokes a sense of creativity and wonder. In CassPea we are convinced that high-level food can be inclusive and
                        fun to enjoy anytime and anywhere.
                    </p>
                </section>

                {/* Mission & Vision Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <div className="bg-primary-light dark:bg-main-bg-dark p-8 rounded-lg">
                        <h2 className={`text-2xl font-bold text-center mb-4 text-primary-text dark:text-white`}>
                            Mission
                        </h2>
                        <p className="text-primary-text dark:text-primary-text">
                            To change the perspective of gourmet chocolates, to make them fun and accessible. We want to use our expertise
                            in design, flavours and packaging to create a brand that is inclusive and warm.
                        </p>
                    </div>
                    <div className="bg-pink-600 dark:bg-pink-600 p-8 rounded-lg">
                        <h2 className={`text-2xl font-bold text-center mb-4 text-primary-text dark:text-white`}>
                            Vision
                        </h2>
                        <p className="text-primary-text dark:text-primary-text">
                            We want our chocolates to make someone's day better. Regardless, if they buy them or follow them on social
                            media, we want it to be an experience that will enrich their day. Having suffered from mental health issues,
                            making something that can give someone even a split second of joy during a dark moment is something we strive to
                            achieve.
                        </p>
                    </div>
                </section>

                {/* Values Section */}
                <section>
                    <h2 className={`text-3xl font-bold text-center mb-12 text-primary-text dark:text-white`}>
                        Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                        {[
                            {
                                title: "Creativity & Innovation",
                                image: "/48-paint.jpeg",
                                description: "We believe that food should be fun and interesting. This is why we believe that creativity and innovation are key to the success of the company and its ability to achieve their mission and vision."
                            },
                            {
                                title: "Free Expression",
                                image: "/snacks-pass.jpeg",
                                description: "One thing that promotes creativity is the exchange of ideas, and for that to happen we need people to feel comfortable making mistakes and exploring their ideas in a respectful and nurturing environment."
                            },
                            {
                                title: "Fun",
                                image: "/fun.jpg",
                                description: "We believe that if you have fun and enjoy what you do, you are more likely to make something extraordinary. If we can incorporate this value into our culture, it would make it easier to achieve our other values, our mission and vision."
                            }
                        ].map((value, index) => (
                            <div key={index} className="">
                                <Image
                                    src={value.image}
                                    alt={value.title}
                                    width={1000}
                                    height={1000}
                                    className="w-full h-auto"
                                />
                                <h3 className={`text-xl font-bold mb-4 text-primary-text dark:text-white`}>
                                    {value.title}
                                </h3>
                                <p className="text-primary-text dark:text-primary-text">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
