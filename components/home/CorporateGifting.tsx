import Link from 'next/link';

/**
 * A separate door for bulk orders: clients, teams, weddings. One corporate
 * order is worth dozens of single boxes, and those buyers want a person and
 * a quote, not a cart. Email, because it is the address the footer already
 * publishes and it gives the shop a written brief to quote from.
 */

const SUBJECT = encodeURIComponent('Gifting enquiry');
const BODY = encodeURIComponent(
    'Hi CassPea,\n\nHow many gifts: \nDate needed by: \nBudget per gift (roughly): \nAny colours or a theme: \n\nThanks!',
);

export default function CorporateGifting() {
    return (
        <div className="flex flex-col items-start gap-4 rounded-2xl border-2 border-accent p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
                <h2 className="font-playfair text-2xl font-bold text-primary-text dark:text-primary-text-light">
                    Gifting 10 or more?
                </h2>
                <p className="mt-1 max-w-xl text-sm text-primary-text/80 dark:text-primary-text-light/80">
                    Clients, teams, weddings and events. Tell us how many and when, and we will come back with
                    options and a quote, including bonbons painted in your own colours.
                </p>
            </div>
            <Link
                href={`mailto:info@casspea.co.uk?subject=${SUBJECT}&body=${BODY}`}
                className="shrink-0 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-button-text hover:bg-primary-dark"
            >
                Get a quote
            </Link>
        </div>
    );
}
