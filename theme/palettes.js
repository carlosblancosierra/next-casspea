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
 * On contrast: `primary` is used as a button fill under white text, so each
 * option's `primary` clears 4.5:1 against #fff. `primary-light` does not and
 * is only ever used for focus rings and hover tints, never behind text.
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
            'gradient-primary': 'linear-gradient(to right, #2F5741, #6E8F7A)',
            'gradient-autumn': 'linear-gradient(to right, #B4571F, #D49A1E)',
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
            'gradient-primary': 'linear-gradient(to right, #B4571F, #D49A1E)',
            'gradient-autumn': 'linear-gradient(to right, #8C3F13, #B4571F)',
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
            'gradient-primary': 'linear-gradient(to right, #8C5A55, #B98F84)',
            'gradient-autumn': 'linear-gradient(to right, #6B403C, #B4571F)',
        },
    },
};

/** Change this one word to change the site. */
const ACTIVE = 'forest';

module.exports = { palettes, ACTIVE, active: palettes[ACTIVE] };
