import { analyticsMiddleware } from '@/redux/analyticsMiddleware';
import { track } from '@/utils/analytics';

jest.mock('@/utils/analytics', () => ({
	...jest.requireActual('@/utils/analytics'),
	track: jest.fn(),
}));

const dispatch = (action: unknown) => {
	const next = jest.fn(a => a);
	analyticsMiddleware({ dispatch: jest.fn(), getState: jest.fn() })(next)(action as never);
	expect(next).toHaveBeenCalledWith(action);
};

const fulfilled = (endpointName: string, originalArgs: unknown, payload: unknown) => ({
	type: 'api/executeMutation/fulfilled',
	payload,
	meta: { requestStatus: 'fulfilled', arg: { type: 'mutation', endpointName, originalArgs } },
});

describe('analyticsMiddleware', () => {
	beforeEach(() => (track as jest.Mock).mockClear());

	it('reports add_to_cart with the quantity just added, priced per unit', () => {
		dispatch(
			fulfilled(
				'addCartItem',
				{ product: 7, quantity: 1 },
				{
					product: { id: 7, name: 'Signature Box', category: { name: 'Boxes' } },
					quantity: 3,
					discounted_price: '45.00',
				},
			),
		);
		expect(track).toHaveBeenCalledWith('add_to_cart', {
			currency: 'GBP',
			value: 15,
			items: [{ item_id: '7', item_name: 'Signature Box', item_category: 'Boxes', price: 15, quantity: 1 }],
			customised: false,
		});
	});

	it('reports a newsletter sign-up as a lead', () => {
		dispatch(fulfilled('subscribeToNewsletter', { email: 'a@b.c' }, { message: 'ok' }));
		expect(track).toHaveBeenCalledWith('generate_lead', { source: 'newsletter', form_code: undefined });
	});

	it('reports failed API calls but not 401s', () => {
		const rejected = (status: number) => ({
			type: 'api/executeQuery/rejected',
			payload: { status },
			error: { message: 'Rejected' },
			meta: { requestId: 'r1', requestStatus: 'rejected', rejectedWithValue: true, arg: { type: 'query', endpointName: 'getCart' } },
		});
		dispatch(rejected(500));
		dispatch(rejected(401));
		expect(track).toHaveBeenCalledTimes(1);
		expect(track).toHaveBeenCalledWith('api_error', { endpoint: 'getCart', status: 500 });
	});

	it('ignores queries that succeed and non-API actions', () => {
		dispatch({ type: 'api/executeQuery/fulfilled', meta: { requestStatus: 'fulfilled', arg: { type: 'query', endpointName: 'getCart' } } });
		dispatch({ type: 'auth/setAuth' });
		expect(track).not.toHaveBeenCalled();
	});
});
