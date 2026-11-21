// The brand colours live in theme/palettes.js so they can be swapped in one
// word and previewed at /admin/palette. Everything below the spread is either
// a one-off swatch nobody changes or a structural setting.
const plugin = require('tailwindcss/plugin');
const { active } = require('./theme/palettes');

/**
 * Primary and money buttons on a dark-mode page. Their fill (`bg-primary`,
 * `bg-gradient-autumn`) is the palette's primary, which can vanish against
 * the near-black page, so a palette can give a `darkButton` colour for dark
 * mode. Only real buttons and links are matched, so the footer, chips and
 * announcement bar keep the primary. The selector outranks the components'
 * own `dark:bg-*` and `hover:` classes, so nothing has to change in them.
 */
const DARK_BUTTON =
	':is(button, a, [role="button"], input[type="submit"]):is(.bg-primary, .bg-primary-dark, .bg-gradient-autumn)';

const darkButtons = plugin(({ addBase }) => {
	const dark = active.darkButton;
	if (!dark) return;
	addBase({
		'@media (prefers-color-scheme: dark)': {
			[DARK_BUTTON]: {
				'background-color': dark.bg,
				'background-image': 'none',
				'border-color': dark.bg,
				color: dark.text,
			},
			[`${DARK_BUTTON}:hover:not(:disabled)`]: { filter: 'brightness(1.08)' },
		},
	});
});

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}',
	],
	theme: {
		extend: {
			fontFamily: {
				'playfair': ['Playfair Display', 'serif'],
			},
			colors: {
				'my-pink': '#ff1ab1',
				'my-yellow': '#ffeb5d',
				'my-green': '#00884d',
				'my-lblue': '#dcf0f9',
				'my-purple': '#7333ff',
				'my-orange': '#ff4f1c',
				'my-eblue': '#00e4f9',
				'my-brown': '#5b392e',
				'my-grey': '#2B2C2E',
				'my-red': '#F14C42',
				// From theme/palettes.js — change ACTIVE there, not here.
				...active.colors,
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				...active.gradients,
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), darkButtons],
};
