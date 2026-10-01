/**
 * The colours that actually get changed, in one place.
 *
 * Tailwind reads `palettes[ACTIVE]` from here, so switching the whole site is
 * the one-word edit below rather than hunting hex codes through
 * tailwind.config.js. /admin/palette renders all three side by side.
 *
 * Every option is drawn from the CassPea flavours artwork — deep forest
 * green, ochre, burnt orange, dusty rose, sage — so they are the brand's own
 * colours rearranged, not three unrelated themes.
 *
 * Plain CommonJS with no TypeScript, because tailwind.config.js has to
 * require() it at build time.
 *
 * On contrast: `primary` is a button fill under white text, and so is every
 * stop of both gradients — gradient-autumn is on every money button (pay, add
 * to cart, continue to checkout) and gradient-primary is behind the units-sold
 * counter, all with white text on them. So all of those clear 4.5:1 against
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
     * Both gradients stay blue. gradient-autumn is on every money button with
     * white text on it, so a gold stop there would be unreadable — the one
     * place where wanting more gold has to lose to being able to read the
     * button.
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
    },
};

/** Change this one word to change the site. */
const ACTIVE = 'christmas';

module.exports = { palettes, ACTIVE, active: palettes[ACTIVE] };
