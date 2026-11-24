/**
 * Where to go after signing in.
 *
 * Honours ?next= so an emailed order link survives the login redirect, but
 * only for same-origin relative paths so the parameter cannot be used as an
 * open redirect. Without it, staff land on the orders and customers on their
 * account.
 */
export function destinationAfterSignIn(isStaff: boolean, search: string): string {
	const next = new URLSearchParams(search).get('next');
	if (next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')) {
		return next;
	}
	return isStaff ? '/orders' : '/account';
}
