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
/**
 * True: the exclusives section names the flavours (and shows their photos once
 * they have one). False: "?" discs and no names. The flavours themselves come
 * from the API: Django admin → Products → Advent landing → flavour category.
 */
export const REVEAL_EXCLUSIVES = true;

export type Variant = 'shop' | 'lead';

export const COPY = {
    announcement: 'Order by Thursday 26 November, 12pm to open door one on 1 December',
    announcementPill: 'Free UK delivery',

    hero: {
        eyebrow: 'Advent Calendar 2026 · Family-made in London',
        heading: 'Twenty-four mornings of edible art.',
        body:
            '24 hand-painted chocolates, made in small batches in our London kitchen, ' +
            'including three new flavours you can only find behind these doors.',
        facts: ['360 g', 'Free UK delivery', 'Less than £2.50 a day'],
        cta: 'Reserve My Calendar',
        secondary: "See what's inside",
        imageAlt: 'The CassPea Advent Calendar 2026',
        countdownOpen: 'Order window for a 1 December start closes in',
        countdownClosed: 'The 1 December order window has closed',
        countdownNote:
            "Thursday 26 November, 12pm. After that, we can't promise your calendar in time for 1 December.",
    },

    lead: {
        heading: 'Get early access to the three calendar-only flavours',
        body: "Leave your email and we'll tell you first, before anyone else, what's behind the doors.",
        button: 'Get early access',
        done: "You're in. Watch your inbox. In the meantime, you can reserve yours now.",
    },

    reminder: {
        heading: "Not ready yet? We'll remind you before 26 November",
        body: 'One email, before the order window closes. Nothing else.',
        button: 'Remind me',
        done: "Done. We'll email you before 26 November.",
    },

    exitIntent: {
        heading: 'Before you go',
        body: "Want a reminder before the 26 November order window closes? We'll send one email.",
        button: 'Remind me',
        done: "Done. We'll email you before 26 November.",
    },

    lateOrders: '[LATE-ORDER POLICY — e.g. we\'ll still send it, and you can catch up on the doors you\'ve missed.]',

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
        // The cards are the API's flavours (name, mini description, photo).
        itemTitle: (n: number) => `Exclusive no. ${n}`,
        hidden: 'Revealed when you open the door',
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
        imageAlt: 'The CassPea Advent Calendar 2026, up close',
    },

    reviews: {
        heading: "Loved Before They're Even Eaten",
        items: [
            // Real reviews from uk.trustpilot.com/review/www.casspea.co.uk, word for word.
            {
                quote:
                    'There are a lot of hand painted artisan chocolates out there but CassPea are the best in my ' +
                    'experience. Flavour, aesthetics and presentation are of the highest quality.',
                name: 'N. Khwaja, on Trustpilot',
            },
            {
                quote:
                    'Delicious beautiful looking chocolates- a work of art! These are perfect as a gift as they ' +
                    'come in beautiful packaging.',
                name: 'Amba, on Trustpilot',
            },
            {
                quote:
                    'Subtle yet bold and delicate but also robust - I wish I had tried them sooner. Communication ' +
                    'and delivery both first rate - thank you.',
                name: 'Lesley Campbell, on Trustpilot',
            },
        ],
    },

    guarantee: {
        heading: 'The Door-to-Door Promise',
        body:
            "[GUARANTEE — confirm wording with Enrique. e.g. If your calendar arrives damaged or a single chocolate isn't perfect, " +
            "tell us and we'll put it right. No forms, no fuss.]",
    },

    faq: {
        heading: 'Questions',
        items: [
            {
                q: 'When will it arrive?',
                a: 'Order by Thursday 26 November, 12pm, and it will arrive in time to open door one on 1 December. Delivery is free across the UK.',
            },
            { q: 'Can I send it straight to someone as a gift?', a: 'Yes. Add their address at checkout. [Confirm gift note option.]' },
            { q: 'How long do the chocolates keep?', a: '[SHELF LIFE — e.g. best enjoyed by …]' },
            { q: 'What about allergens?', a: '[ALLERGEN LINE — confirm with the kitchen.]' },
            {
                q: 'What if I order after 26 November?',
                a: "[LATE-ORDER POLICY — e.g. we'll still send it, and you can catch up on the doors you've missed.]",
            },
        ],
    },

    finalCta: {
        heading: '24 Doors. 3 Secrets. One Decision.',
        footnote: 'Covered by the Door-to-Door Promise · Handmade in London',
    },

    seo: {
        title: 'Advent Calendar 2026: 24 Hand-Painted Chocolates',
        description:
            'The CassPea Advent Calendar 2026: 24 hand-painted chocolates made in London, with three flavours you can ' +
            'only find behind these doors. £59.99, free UK delivery. Order by 26 November for 1 December.',
    },
} as const;
