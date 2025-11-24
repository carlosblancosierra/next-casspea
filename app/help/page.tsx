import Link from 'next/link';

const faqs = [
    {
        question: "They are too pretty to eat.",
        answer: "Not really a question, but we get this a lot. We promise that they taste better than they look. Imagine that 😊"
    },
    {
        question: "What is your shipping policy?",
        answer: "We offer 24-hour tracked Royal Mail. Because of the delicate nature of our product, we need to guarantee quick delivery. You will be able to track your package the entire way."
    },
    {
        question: "Where should I store them?",
        answer: "Normally, you can put them in a cool place, such as a cupboard. We do not recommend putting them in the fridge."
    },
    {
        question: "What if it's really hot?",
        answer: "On the few weeks that we actually get some proper heat, then we do recommend placing them in the fridge. We do, however, advise that they are wrapped in plastic to preserve them as best as possible. If you are conscious about the environment, then we recommend putting them inside a sealed container or a bag."
    },
    {
        question: "Do you ship internationally?",
        answer: "At the moment, we only ship within the UK."
    },
    {
        question: "Can I choose my own flavours?",
        answer: "Absolutely, it is one of the coolest things about our business. You can select and see a picture of the chocolate, so you can choose by flavour, or colour, or both. You can also select one of our pre-packed boxes. We offer nut-free, gluten-free, and alcohol-free options."
    },
    {
        question: "How long do they last?",
        answer: "We advise that they are consumed within 2 weeks of arrival. Most of our chocolates do have a longer shelf life than that. However, we know that the fresher they are, the better they taste."
    },
    {
        question: "Can I order for a future date?",
        answer: "Yes. Another cool feature that we offer is the ability to select your shipping date. This option is found at checkout."
    },
    {
        question: "What if I need many boxes?",
        answer: "Our website is programmed to give a generous discount to all orders over 10 boxes."
    },
    {
        question: "What if I need more than that and a bigger discount?",
        answer: "Please contact us at info@casspea.co.uk or send us a WhatsApp message at 07859 790386."
    },
    {
        question: "Do you do bespoke orders?",
        answer: "Absolutely, we can personalize your chocolates. Using our software, you can design your chocolate, and we can develop a flavour if we don't already have it. Please contact us for more information at info@casspea.co.uk or send us a WhatsApp message at 07859 790386."
    },
    {
        question: "How long would a bespoke order take?",
        answer: "We can make things happen very quickly. If we have the flavour and decoration settled, we can produce them in 3-5 days."
    },
    {
        question: "What is your return policy?",
        answer: "If you are unsatisfied with your order or there was a problem with delivery, we will do everything possible to make sure that you are left satisfied and wanting to come back again. If you have had a negative experience, please contact us directly at info@casspea.co.uk or send us a WhatsApp message at 07859 790386."
    },
    {
        question: "Where are you located?",
        answer: "Well, we don't have a physical shop. We do everything online. Our kitchen is based in the south of London."
    },
    {
        question: "Allergens!",
        answer: "We are very careful when we handle allergens, especially nuts, wheat, milk, or soy. We cannot guarantee that there is no cross-contamination, so if you have any allergies to these products, we recommend you take that into account. For more information, please click here to see our allergen table"
    }
];

const HelpPage = () => {
    return (
        <div className=" dark:bg-main-bg-dark min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Contact Section */}
                <section className="main-bg dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                    <div className="space-y-2 text-gray-600 dark:text-gray-300">
                        <p>
                            <span className="font-medium">Tel:</span>{' '}
                            <a href="tel:07859790386" className="hover:text-primary dark:hover:text-primary-2">
                                07859 790386
                            </a>
                        </p>
                        <p>
                            <span className="font-medium">Email:</span>{' '}
                            <a href="mailto:info@casspea.co.uk" className="hover:text-primary dark:hover:text-primary-2">
                                info@casspea.co.uk
                            </a>
                        </p>
                        <p>
                            <span className="font-medium">Address / Store Pickup:</span> 104 Bedford Hill, London, SW12 9HR
                        </p>
                    </div>
                </section>

                {/* Quick Info Section */}
                <section className="main-bg dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center p-4  dark:bg-gray-700 rounded-lg">
                            <h3 className="font-bold text-primary dark:text-primary-2">FREE SHIPPING</h3>
                            <p className="text-gray-600 dark:text-gray-300">On all orders over £50</p>
                        </div>
                        <div className="text-center p-4 dark:bg-gray-700 rounded-lg">
                            <h3 className="font-bold text-primary dark:text-primary-2">10% OFF</h3>
                            <p className="text-gray-600 dark:text-gray-300">Subscribe to our newsletter</p>
                        </div>
                    </div>
                </section>

                {/* FAQs Section */}
                <section className="main-bg dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Company Info Footer */}
                <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    <p>Company Name: CassPea Ltd</p>
                    <p>Company Number: 14307063</p>
                </footer>
            </div>
        </div>
    );
};

export default HelpPage;
