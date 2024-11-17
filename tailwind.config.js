module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
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
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
