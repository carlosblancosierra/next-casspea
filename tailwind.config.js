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
				'primary': '#BD3E2F',
				'primary-2': '#800020',
				'primary-dark': '#832830',
				'primary-light': '#8a5949',
				'main-bg': '#0a0c10',
				'main-bg-dark': '#0a0c10',
				'secondary-bg': '#480607',
				'primary-button-text': '#FFF',
				'text-primary-text': '#FFF',
				'text-primary-text': '#FFF',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-primary': 'linear-gradient(to right, #eace04, #ff1ab1)',
				'gradient-autumn': 'linear-gradient(to right, #800020, #800020)',
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
