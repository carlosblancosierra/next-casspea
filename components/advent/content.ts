/**
 * Copy and settings for the Advent Calendar 2026 landing (/advent-calendar).
 *
 * The copy is from the approved design (Main.dc.html), in British English.
 * Anything still in [SQUARE BRACKETS] is waiting on a real answer and must be
 * replaced before the campaign goes live — search this file for "[".
 */
/**
 * Last order time for a 1 December start: Thursday 26 November 2026, 12:00
 * London time. London is on GMT then, so that is 12:00 UTC. The home page's
 * ChristmasDeliveryCountdown reads it from here too.
 */
export const ORDER_DEADLINE_ISO = '2026-11-26T12:00:00Z';
export const ORDER_DEADLINE = new Date(ORDER_DEADLINE_ISO);

/** The product the page sells, looked up in the API by slug. */
export const ADVENT_SLUG = 'advent-calendar';
export const ADVENT_PATH = '/advent-calendar';
export const ADVENT_EARLY_ACCESS_PATH = '/advent-calendar/early-access';

/** Shown only when the API does not answer; the page never shows an empty price. */
export const FALLBACK_PRICE = '59.99';
export const WEIGHT_GRAMS = 360;
export const PIECES = 24;
/** What the 24-piece Signature box costs, for the value stack. */
export const SIGNATURE_BOX_PRICE = '55.00';

/** Mailchimp tag for every address captured on this page (as `form_code`). */
export const LEAD_FORM_CODE = 'advent-2026';
export type LeadSource = 'landing-reminder' | 'exit-intent' | 'early-access';

/** Set to true once the bonus below is confirmed. */
export const SHOW_BONUS = false;
/** Show the exclusives' photos and names. With it off, or while the API
 *  returns none, the cards show "?" discs. The exclusives are the flavour
 *  category set in Django admin → Products → Advent landing. */
export const REVEAL_EXCLUSIVES = true;

export type Variant = 'shop' | 'lead';

export const COPY = {
    announcement: '24 hand-painted chocolates, family-made in London',
    announcementPill: 'Free UK delivery',

    hero: {
        eyebrow: 'Advent Calendar 2026 · Family-made in London',
        heading: 'Twenty-four mornings of edible art.',
        body:
            '24 hand-painted chocolates, made in small batches in our London kitchen, ' +
            'including three new flavours you can only find behind these doors.',
        facts: ['360 g', 'Free UK delivery', 'Less than £2.50 a day'],
        cta: 'Reserve My Calendar',
        allergenHeading: 'Any allergies?',
        allergenConfirm: 'Add to basket',
        secondary: "See what's inside",
        imageAlt: 'The CassPea Advent Calendar open, with a few doors showing hand-painted chocolates',
    },

    lead: {
        heading: 'Get early access to the three secret flavours',
        body: "Leave your email and we'll tell you first, before anyone else, what's behind the doors.",
        button: 'Get early access',
        done: "You're in. Watch your inbox. In the meantime, you can reserve yours now.",
    },

    reminder: {
        heading: "Not ready yet? We'll remind you before 26 November",
        body: "We'll send you a reminder before the order window closes.",
        button: 'Remind me',
        done: "Done. We'll email you before 26 November.",
    },

    exitIntent: {
        heading: 'Before you go',
        body: "Want a reminder before the 26 November order window closes? We'll send you one.",
        button: 'Remind me',
        done: "Done. We'll email you before 26 November.",
    },

    lateOrders: "Ordered after 26 November? We'll still send it, but we can't guarantee when it will arrive.",

    contrast: {
        heading: 'Most Advent Calendars Are Forgotten by Day Six',
        body: 'Twenty-four of the same moulded square. This one is different every morning.',
        usualTitle: 'The usual calendar',
        usual: [
            'The same mass-produced milk chocolate, 24 times',
            'Nothing worth looking at when you open the door',
            'Flavours you could buy at any till',
            'A gift that says "I remembered, just about"',
        ],
        oursTitle: 'The CassPea calendar',
        ours: [
            '24 hand-painted chocolates, made in small batches in London',
            'Almost too pretty to eat, every single morning',
            "Three new flavours you can't get anywhere else",
            "A gift they'll talk about until Christmas",
        ],
    },

    valueStack: {
        eyebrow: "What's behind the doors",
        heading: 'Everything You Get',
        rows: [
            {
                title: '24 hand-painted chocolates · 360 g',
                body: 'One for every morning from 1 to 24 December. Each shell painted by hand.',
                value: '£55.00 as a box',
            },
            {
                title: '3 calendar-exclusive flavours',
                body: 'New this year. Not in the shop before December. The only way to taste them first.',
                value: 'Not sold separately',
            },
            {
                title: 'Free UK delivery',
                body: 'Straight to your door, or theirs. Arrives in time for door one.',
                value: 'Included',
            },
            {
                title: "A gift that's ready to give",
                body: "Nothing to wrap, nothing to assemble. Open the box and it's December.",
                value: 'Included',
            },
        ],
        bonus: {
            title: '[BONUS — e.g. handwritten gift note]',
            body: '[One line on the bonus. Confirm before launch.]',
            value: '[£ VALUE]',
        },
        totalLead: 'Everything above, for',
        totalNote:
            "That's £4.99 more than our 24-piece box, which on its own sits £1 short of free delivery. " +
            "The calendar ships free, and it's the only way to taste this year's three new flavours.",
        perMorning: 'Less than £2.50 a morning.',
    },

    exclusives: {
        heading: 'Three Flavours. Only Behind These Doors.',
        body:
            "We made three new flavours just for the calendar. They won't be in the shop before December. " +
            'If you want to be among the first to taste them, this is the only way in.',
        items: [
            { title: 'Exclusive no. 1' },
            { title: 'Exclusive no. 2' },
            { title: 'Exclusive no. 3' },
        ],
    },

    easiestGift: {
        heading: "The Easiest Gift You'll Buy This Year",
        items: [
            { icon: 'heart', title: 'Joy, 24 times over', body: 'One gift that gets opened again every morning until Christmas Eve.' },
            { icon: 'star', title: 'Rated Excellent', body: '4.6 out of 5 on Trustpilot. Handmade in London, in small batches.' },
            { icon: 'calendar', title: 'Here before 1 December', body: 'Order by Thursday 26 November, 12pm, and door one is ready on time.' },
            { icon: 'box', title: 'No effort at all', body: 'Ready to give, delivered free. Send it straight to them.' },
        ],
    },

    whoFor: {
        heading: "Who It's For",
        items: [
            { title: 'For you', body: 'Because December mornings deserve better than a moulded square.' },
            { title: 'For her', body: 'Twenty-four small reasons to think of you before Christmas.' },
            { title: 'For the one who has everything', body: "They don't have these. Three of the flavours don't exist anywhere else." },
            { title: 'For someone far away', body: 'Delivered free to their door, anywhere in the UK.' },
        ],
        team: 'Ordering for your team?',
        teamLink: 'Get in touch',
        teamMessage: "Hi! I'd like to order Advent Calendars for my team.",
    },

    story: {
        eyebrow: 'Our story',
        heading: 'Cass and Pea Are Our Daughters',
        paragraphs: [
            'CassPea is named after Cassandra and Penelope. Our story began in a little chocolate shop in ' +
                'Mexico City and found its home in London, where every bonbon is still painted by hand, one at a time.',
            "So when we made an Advent Calendar, we made it the way we'd make one for them: something to run to " +
                'every morning, and never the same thing twice.',
        ],
        signature: 'Enrique',
        role: "Founder, and Cass and Pea's dad",
    },

    flavours: {
        heading: 'All Our Flavours',
    },

    reviews: {
        heading: "Loved Before They're Even Eaten",
        // Names from components/common/trustpilotReviews.ts: presentation, gifting, taste.
        names: ['Kim', 'Rose', 'Ali Stoney'],
    },

    faq: {
        heading: 'Questions',
        items: [
            {
                q: 'When will it arrive?',
                a: 'Order by Thursday 26 November, 12pm, and it will arrive in time to open door one on 1 December. Delivery is free across the UK.',
            },
            { q: 'Can I send it straight to someone as a gift?', a: 'Yes. Add their address at checkout, and you can include a gift note.' },
            {
                q: 'How long do the chocolates keep?',
                a: 'We advise eating them within 2 weeks of arrival. Most of our chocolates keep longer than that, but the fresher they are, the better they taste.',
            },
            {
                q: 'What about allergens?',
                a:
                    'When you add it to your basket, tell us if you are allergic to gluten, alcohol or nuts and we will prepare your calendar accordingly. ' +
                    'We handle allergens very carefully, but we cannot guarantee there is no cross-contamination.',
            },
            {
                q: 'What if I order after 26 November?',
                a: "We'll still send it, but we can't guarantee when it will arrive.",
            },
        ],
    },

    finalCta: {
        heading: '24 Doors. 3 Secrets. One Decision.',
        footnote: 'Handmade in London · Free UK delivery',
    },

    seo: {
        title: 'Advent Calendar 2026: 24 Hand-Painted Chocolates',
        description:
            'The CassPea Advent Calendar 2026: 24 hand-painted chocolates made in London, with three flavours you can ' +
            'only find behind these doors. £59.99, free UK delivery. Order by 26 November for 1 December.',
        /** Used only when the product has no photo in the API. */
        ogImage: '/advent/og.jpg',
    },
} as const;
