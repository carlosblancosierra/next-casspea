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
				'primary': '#a5a0dc',
				'primary-2': '#D1CCEB',
				'primary-dark': '#a5a0dc',
				'primary-light': '#D1CCEB',
				'main-bg': '#fff2e9',
				'primary-button-text': '#FFF',
				'primary-text': '#434343',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
