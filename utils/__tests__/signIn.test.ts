import { destinationAfterSignIn } from '../signIn';

describe('destinationAfterSignIn', () => {
	it('sends staff to the orders and customers to their account', () => {
		expect(destinationAfterSignIn(true, '')).toBe('/orders');
		expect(destinationAfterSignIn(false, '')).toBe('/account');
	});

	it('honours ?next= so emailed order links survive the login', () => {
		expect(destinationAfterSignIn(true, '?next=%2Forders%3Forder%3DCP26-ABCDE')).toBe(
			'/orders?order=CP26-ABCDE'
		);
	});

	it.each(['https://evil.example', '//evil.example', '/\\evil.example', 'javascript:alert(1)'])(
		'ignores %s, which would leave the site',
		next => {
			expect(destinationAfterSignIn(false, `?next=${encodeURIComponent(next)}`)).toBe('/account');
		}
	);
});
