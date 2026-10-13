const ContactPage = () => {
    return (
        <div className=" dark:bg-main-bg-dark min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <section className="main-bg dark:bg-main-bg-dark rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-bold text-primary-text dark:text-white mb-4">Contact Us</h2>
                    <div className="space-y-2 text-primary-text dark:text-primary-text-light">
                        <p>
                            <span className="font-medium">Tel / WhatsApp:</span>{' '}
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

                <footer className="text-sm text-primary-text dark:text-primary-text-light">
                    <p>Company Name: CassPea Ltd</p>
                    <p>Company Number: 14307063</p>
                </footer>
            </div>
        </div>
    );
};

export default ContactPage;
