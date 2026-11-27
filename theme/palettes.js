/**
 * The colours that actually get changed, in one place.
 *
 * Tailwind reads `palettes[ACTIVE]` from here, so switching the whole site is
 * the one-word edit below rather than hunting hex codes through
 * tailwind.config.js. /admin/palette renders them all side by side.
 *
 * Every option is drawn from the CassPea flavours artwork — deep forest
 * green, ochre, burnt orange, dusty rose, sage — so they are the brand's own
 * colours rearranged, not three unrelated themes.
 *
 * Plain CommonJS with no TypeScript, because tailwind.config.js has to
 * require() it at build time.
 *
 * On contrast: `primary` is the fill of every primary button (components/
 * common/Button.tsx — pay, add to cart, continue to checkout included) under
 * white text, and every stop of both gradients is a surface with white text
 * on it too (gradient-autumn behind the post-checkout units-sold block,
 * gradient-primary behind the units-sold counter). So all of those clear 4.5:1 against
 * #fff, and /admin/palette measures it rather than trusting this comment.
 *
 * `primary-light` does NOT clear it and is only ever a focus ring or a hover
 * tint — never a surface with text on it.
 *
 * `accent` is the complementary colour, and it ships with its own
 * `accent-text` rather than borrowing `primary-button-text`. That is not
 * symmetry for its own sake: the Christmas gold is 2.24:1 under white and
 * 7.78:1 under the dark ink, so an accent that assumed white text would be
 * unreadable. Every palette carries the pair so `bg-accent` resolves whichever
 * one is active.
 *
 * `darkButton` is the button fill on a dark-mode page. The site follows the
 * visitor's system setting, and on the near-black `main-bg-dark` a navy,
 * forest or black `primary` is barely visible (1.05:1 for Black Friday).
 * A palette whose primary is under 3:1 against `main-bg-dark` must carry one;
 * tailwind.config.js turns it into a dark-mode rule for every primary and
 * money button.
 */

const palettes = {
    /**
     * The artwork as it reads at a glance: forest green leading, ochre as the
     * accent. The most conservative of the three and the closest to the
     * packaging.
     */
    forest: {
        name: 'Forest',
        description: 'Deep green with an ochre accent. Closest to the packaging.',
        colors: {
            primary: '#2F5741',
            'primary-2': '#2F5741',
            'primary-dark': '#1F3D2B',
            'primary-light': '#6E8F7A',
            'primary-button-text': '#FFFFFF',
            accent: '#B4571F',
            'accent-text': '#FFFFFF',
            'main-bg': '#FBF8F3',
            'main-bg-dark': '#141A16',
            'secondary-bg': '#1F3D2B',
            'primary-text': '#1A1A1A',
            'primary-text-light': '#FBF8F3',
            'primary-text-dark': '#1A1A1A',
            'secondary-text': '#1A1A1A',
            'secondary-text-dark': '#FBF8F3',
        },
        gradients: {
            'gradient-primary': 'linear-gradient(to right, #1F3D2B, #2F5741)',
            'gradient-autumn': 'linear-gradient(to right, #8C3F13, #B4571F)',
        },
        // The page is near-black in dark mode, where the primary fill
        // disappears; buttons use the accent there instead.
        darkButton: { bg: '#B4571F', text: '#FFFFFF' },
    },

    /**
     * Burnt orange leading, green as the grounding dark. Warmer and louder —
     * the buttons carry more urgency, which is usually what a shop wants.
     */
    terracotta: {
        name: 'Terracotta',
        description: 'Burnt orange leading, green as the dark. Warmest of the three.',
        colors: {
            primary: '#B4571F',
            'primary-2': '#B4571F',
            'primary-dark': '#8C3F13',
            'primary-light': '#D9895A',
            'primary-button-text': '#FFFFFF',
            accent: '#2F5741',
            'accent-text': '#FFFFFF',
            'main-bg': '#FDF9F4',
            'main-bg-dark': '#17120F',
            'secondary-bg': '#1F3D2B',
            'primary-text': '#1A1A1A',
            'primary-text-light': '#FDF9F4',
            'primary-text-dark': '#1A1A1A',
            'secondary-text': '#1A1A1A',
            'secondary-text-dark': '#FDF9F4',
        },
        gradients: {
            'gradient-primary': 'linear-gradient(to right, #8C3F13, #B4571F)',
            'gradient-autumn': 'linear-gradient(to right, #1F3D2B, #2F5741)',
        },
    },

    /**
     * The dusty rose from the artwork, deepened enough to hold white text.
     * The softest option and the most gift-shop of the three.
     */
    rosewood: {
        name: 'Rosewood',
        description: 'Dusty rose deepened for contrast, with sage. Softest of the three.',
        colors: {
            primary: '#8C5A55',
            'primary-2': '#8C5A55',
            'primary-dark': '#6B403C',
            'primary-light': '#B98F84',
            'primary-button-text': '#FFFFFF',
            accent: '#5A6B47',
            'accent-text': '#FFFFFF',
            'main-bg': '#FBF6F3',
            'main-bg-dark': '#171213',
            'secondary-bg': '#5A6B47',
            'primary-text': '#1A1A1A',
            'primary-text-light': '#FBF6F3',
            'primary-text-dark': '#1A1A1A',
            'secondary-text': '#1A1A1A',
            'secondary-text-dark': '#FBF6F3',
        },
        gradients: {
            'gradient-primary': 'linear-gradient(to right, #6B403C, #8C5A55)',
            'gradient-autumn': 'linear-gradient(to right, #8C3F13, #B4571F)',
        },
    },

    /**
     * Christmas: navy and gold.
     *
     * The blue leads — it is the one that fills the announcement bar, the
     * footer, the buttons and the selected chips, all under white text at
     * 11.07:1. The gold is the accent and it is deliberately NOT a
     * white-text surface: #DAA520 under white is 2.24:1, nowhere near the
     * 4.5:1 floor, while under the dark ink it is 7.78:1. So gold carries dark
     * lettering, which is how gold is used on anything that has to be read.
     *
     * Gold is also legible as a detail on the blue (4.95:1 against #003B78),
     * which is the navy-and-gold pairing this is after.
     *
     * Both gradients stay blue. They are surfaces with white text on them,
     * so a gold stop there would be unreadable — the one place where wanting
     * more gold has to lose to being able to read the text.
     */
    christmas: {
        name: 'Christmas',
        description: 'Navy with a gold accent. Seasonal; gold carries dark text, never white.',
        colors: {
            primary: '#003B78',
            'primary-2': '#003B78',
            'primary-dark': '#002B57',
            'primary-light': '#5C8BC0',
            'primary-button-text': '#FFFFFF',
            accent: '#DAA520',
            'accent-text': '#1A1A1A',
            'main-bg': '#F7FAFD',
            'main-bg-dark': '#0C1726',
            'secondary-bg': '#002B57',
            'primary-text': '#1A1A1A',
            'primary-text-light': '#F7FAFD',
            'primary-text-dark': '#1A1A1A',
            'secondary-text': '#1A1A1A',
            'secondary-text-dark': '#F7FAFD',
        },
        gradients: {
            'gradient-primary': 'linear-gradient(to right, #002B57, #003B78)',
            'gradient-autumn': 'linear-gradient(to right, #002B57, #0A4E96)',
        },
        // The page is near-black in dark mode, where the primary fill
        // disappears; buttons use the accent there instead.
        darkButton: { bg: '#DAA520', text: '#1A1A1A' },
    },

    /**
     * Black Friday: black and gold, across the whole site.
     *
     * Black leads: announcement bar, footer, buttons and chips, under white
     * text at well over 4.5:1. Gold is the accent and, like the Christmas
     * gold, it carries dark lettering, never white. It is also bright enough
     * to read as a detail on the black.
     *
     * The page background stays a warm off-white rather than going dark: many
     * components set dark text on `main-bg`, so a black background would
     * leave them unreadable. The black lives in the chrome and the buttons.
     */
    blackfriday: {
        name: 'Black Friday',
        description: 'Black with a gold accent. Seasonal; gold carries dark text, never white.',
        colors: {
            primary: '#111111',
            'primary-2': '#111111',
            'primary-dark': '#000000',
            'primary-light': '#6B6B6B',
            'primary-button-text': '#FFFFFF',
            accent: '#D4AF37',
            'accent-text': '#111111',
            'main-bg': '#FAF8F4',
            'main-bg-dark': '#0A0A0A',
            'secondary-bg': '#000000',
            'primary-text': '#1A1A1A',
            'primary-text-light': '#FAF8F4',
            'primary-text-dark': '#1A1A1A',
            'secondary-text': '#1A1A1A',
            'secondary-text-dark': '#FAF8F4',
        },
        gradients: {
            'gradient-primary': 'linear-gradient(to right, #000000, #1F1F1F)',
            'gradient-autumn': 'linear-gradient(to right, #111111, #2E2E2E)',
        },
        // The page is near-black in dark mode, where the primary fill
        // disappears; buttons use the accent there instead.
        darkButton: { bg: '#D4AF37', text: '#111111' },
    },

    /**
     * Christmas, classic: green and red, across the whole site.
     *
     * The green leads — announcement bar, footer, buttons and chips — under
     * white text at 7.75:1. The red is the accent and, unlike the gold, it
     * holds white text (6.64:1), so it can carry the subscribe pill and the
     * money buttons (gradient-autumn) as well.
     *
     * In dark mode the green is too close to the near-black page (2.37:1), so
     * buttons switch to a brighter red there (3.68:1 on the page, 5.00:1
     * under white).
     */
    christmasClassic: {
        name: 'Christmas (green & red)',
        description: 'Christmas green with a red accent. Seasonal; both carry white text.',
        colors: {
            primary: '#1B5E3B',
            'primary-2': '#1B5E3B',
            'primary-dark': '#124229',
            'primary-light': '#6E9E82',
            'primary-button-text': '#FFFFFF',
            accent: '#B3202E',
            'accent-text': '#FFFFFF',
            'main-bg': '#FBF8F3',
            'main-bg-dark': '#0E1611',
            'secondary-bg': '#124229',
            'primary-text': '#1A1A1A',
            'primary-text-light': '#FBF8F3',
            'primary-text-dark': '#1A1A1A',
            'secondary-text': '#1A1A1A',
            'secondary-text-dark': '#FBF8F3',
        },
        gradients: {
            'gradient-primary': 'linear-gradient(to right, #124229, #1B5E3B)',
            'gradient-autumn': 'linear-gradient(to right, #8E1622, #B3202E)',
        },
        darkButton: { bg: '#D42A3C', text: '#FFFFFF' },
    },
};

/** Change this one word to change the site. */
const ACTIVE = 'christmasClassic';

module.exports = { palettes, ACTIVE, active: palettes[ACTIVE] };
