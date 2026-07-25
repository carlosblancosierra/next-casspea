// Central configuration for the August summer break.
//
// While orders are open (before the last-order deadline) we show a promo popup
// offering 15% off. Once the deadline passes, new payments are blocked in the
// cart and at the Stripe checkout step until we reopen.

// Master switch. Set to false to remove the popup AND the payment block in one go.
export const SUMMER_BREAK_ENABLED = true;

// Last orders are accepted until this exact moment. UK summer time is BST
// (UTC+1), so noon on 1 August 2026 is 12:00+01:00. After this instant the
// payment block kicks in automatically.
export const LAST_ORDER_DEADLINE = new Date('2026-08-01T12:00:00+01:00');

// Force the payment block on immediately, ignoring the deadline (e.g. to close
// early or to preview the "closed" state). Leave false to let the deadline decide.
export const FORCE_PAYMENTS_BLOCKED = false;

// Discount code promoted in the popup (created separately on the backend).
export const SUMMER_BREAK_DISCOUNT_CODE = 'SUMMER15';

// Where the popup's primary button sends shoppers.
export const SUMMER_BREAK_SHOP_URL = '/shop-now';

// Copy shown in the promo popup while orders are still open.
export const SUMMER_BREAK_COPY = {
  headline: "We're closing for August",
  subhead: "Our family's taking a summer break. Enjoy 15% off everything before we go.",
  deadline: 'Last orders: Friday 1 August, noon',
  code: `Use code ${SUMMER_BREAK_DISCOUNT_CODE} at checkout`,
  button: 'Shop with 15% off',
  dismiss: 'Maybe later',
};

// True once we've passed the last-order deadline (or the manual override is on):
// the shop is on its break and no new payments should be taken.
export function arePaymentsBlocked(now: Date = new Date()): boolean {
  if (!SUMMER_BREAK_ENABLED) return false;
  if (FORCE_PAYMENTS_BLOCKED) return true;
  return now.getTime() >= LAST_ORDER_DEADLINE.getTime();
}
