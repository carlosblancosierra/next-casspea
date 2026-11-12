import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import { track, toAnalyticsItem, toAmount, CURRENCY } from '@/utils/analytics';
import type { Cart, CartItem, CartItemRequest } from '@/types/carts';

interface ApiAction {
	type: string;
	payload?: unknown;
	meta?: {
		arg?: { endpointName?: string; originalArgs?: unknown; type?: string };
		requestStatus?: string;
	};
}

const LEAD_ENDPOINTS: Record<string, string> = {
	subscribeToNewsletter: 'newsletter',
	subscribeGenericLead: 'generic',
};

/** 401s are the token refresh doing its job, not failures worth reporting. */
const IGNORED_ERROR_STATUSES = new Set([401]);

/**
 * Turns finished API calls into analytics events, so the components that
 * make those calls (there are several add-to-cart buttons) don't each have to
 * remember to track them. Failed calls are reported as `api_error`.
 */
export const analyticsMiddleware: Middleware = () => next => action => {
	const result = next(action);
	try {
		handle(action as ApiAction);
	} catch {
		// Tracking must never break a dispatch.
	}
	return result;
};

function handle(action: ApiAction): void {
	const endpoint = action.meta?.arg?.endpointName;
	if (!endpoint || !action.type.startsWith('api/')) return;

	if (isRejectedWithValue(action)) {
		const payload = action.payload as { status?: number | string } | undefined;
		if (payload?.status !== undefined && IGNORED_ERROR_STATUSES.has(payload.status as number)) return;
		track('api_error', { endpoint, status: payload?.status });
		return;
	}

	if (action.meta?.requestStatus !== 'fulfilled' || action.meta?.arg?.type !== 'mutation') return;
	const args = action.meta.arg.originalArgs;

	switch (endpoint) {
		case 'addCartItem': {
			const request = args as CartItemRequest | undefined;
			const item = addedLine(action.payload as Cart | undefined, request);
			if (!item) return;
			// Report only what was just added, not the line's running total.
			const added = { ...toAnalyticsItem(item), quantity: request?.quantity ?? item.quantity };
			track('add_to_cart', {
				currency: CURRENCY,
				value: toAmount((added.price ?? 0) * added.quantity),
				items: [added],
				customised: !!(request?.box_customization || request?.pack_customization),
			});
			return;
		}
		case 'removeCartItem':
		case 'deleteCartItem':
			track('remove_from_cart', { cart_item_id: args });
			return;
		case 'subscribeToNewsletter':
		case 'subscribeGenericLead': {
			const lead = args as { lead_type?: string; form_code?: string | null } | undefined;
			track('generate_lead', {
				source: lead?.lead_type ?? LEAD_ENDPOINTS[endpoint],
				form_code: lead?.form_code ?? undefined,
			});
			return;
		}
		case 'sendRequest':
			track('personalised_request_sent');
			return;
		case 'updateCart': {
			const update = args as { discount_code?: string } | undefined;
			if (update?.discount_code) track('discount_applied', { coupon: update.discount_code });
			return;
		}
		case 'login':
			track('login', { method: 'email' });
			return;
	}
}

/**
 * POST /api/carts/items/ answers with the whole cart, not the line it added
 * (BUG-04: reading a line straight off the payload meant add_to_cart was never
 * sent). Every add creates a new line, so the added one is the newest line,
 * the highest id, for the product that was asked for.
 */
function addedLine(cart: Cart | undefined, request: CartItemRequest | undefined): CartItem | undefined {
	if (!cart?.items?.length || request?.product === undefined) return undefined;
	return cart.items
		.filter(item => item.product?.id === Number(request.product))
		.reduce<CartItem | undefined>((newest, item) => (!newest || item.id > newest.id ? item : newest), undefined);
}
