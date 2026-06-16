# Father's Day Email Campaign

A simple, ready-to-send campaign that drives subscribers to the
[`/landing/fathers-day`](https://casspea.co.uk/landing/fathers-day) "Build Dad's Box" landing.

- **Goal:** drive box builds on the Father's Day landing.
- **Offer:** 15% off first order — code `LandingGold20` (matches the landing's lead-capture reward).
- **Key date:** UK Father's Day is **Sunday 21 June 2026**.
- **Assets:** [`email.html`](./email.html) — responsive, inline-styled, email-client safe (tables + MSO fallbacks).

## Files

| File | What it is |
| --- | --- |
| `email.html` | The send-ready HTML email. Paste into your ESP's HTML/code editor. |
| `README.md` | This brief: subjects, preview text, plain-text fallback, schedule. |

## Subject lines (A/B test the top two)

1. **Gift Dad something unforgettable 🍫** *(recommended A)*
2. **Dad's chocolate box, sorted in minutes** *(recommended B)*
3. Father's Day is Sunday — build Dad's box
4. Whisky, salted caramel, espresso… a box built for Dad

## Preview / preheader text

> Handmade chocolates, picked for Dad. Choose a size, keep our flavours or swap your own — sorted in minutes. 15% off with LandingGold20.

(This is already baked into `email.html` as a hidden preheader.)

## Send plan

| Send | Timing | Audience | Angle |
| --- | --- | --- | --- |
| **1 — Launch** | Tue 16 / Wed 17 June, ~10:00 | Full subscriber list | Main email (this asset) |
| **2 — Last chance** | Thu 18 June AM | Openers + non-purchasers | Same email, subject "Last day to order for Father's Day" |

Adjust the **"Order by Thursday 18 June"** line in `email.html` to match your real
courier cut-off before sending.

## Tracking

All links carry UTMs: `utm_source=email&utm_medium=email&utm_campaign=fathers_day_2026`.

## Pre-send checklist

- [ ] Confirm the order-by date against your delivery cut-off and update the hero/urgency line.
- [ ] Verify `LandingGold20` is active and the 15% terms are correct for the audience.
- [ ] Wire the `{{unsubscribe_url}}` merge tag to your ESP's unsubscribe field.
- [ ] Send a test; preview on mobile + Gmail/Outlook/Apple Mail; check dark mode.
- [ ] Set the from-name/reply-to and the two subject lines for the A/B test.

## Plain-text version

```
GIFT DAD SOMETHING UNFORGETTABLE
Father's Day · Sunday 21 June

Curated handmade chocolate boxes, built for Father's Day. Pick a size,
keep our dad-worthy flavours or swap your own, and add to cart in minutes.

Build Dad's box: https://casspea.co.uk/landing/fathers-day

15% OFF YOUR FIRST ORDER — code LandingGold20

SORTED IN THREE STEPS
1. Choose the experience — an Indulgence Pack (box + chocolate bark +
   luxury hot chocolate) or just the signature box.
2. Pick a size — 9, 15, 24 or 48 handmade bonbons.
3. Keep our flavours or swap — we pre-pick a bold line-up for Dad
   (whisky, salted caramel, espresso, dark chocolate, sea salt, hazelnut
   praline). Edit any of it, or let us surprise him.

Start Dad's box: https://casspea.co.uk/landing/fathers-day

Order by Thursday 18 June for Father's Day delivery. Handmade in London.

Shop all chocolates: https://casspea.co.uk/shop-now
---
CassPea — handmade chocolates, crafted in London.
15% off applies to first orders with code LandingGold20.
Unsubscribe: {{unsubscribe_url}}
```
