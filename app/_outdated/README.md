# Outdated landings

Old campaign pages, kept for reference and reuse. **None of them are served.**

- `landing/fathers-day` — Father's Day box builder
- `landing/thermomix` (+ `thank-you`) — Thermomix giveaway
- `landing/summer-break` — Summer Break 25% off sale
- `landing/blue`, `landing/gold`, `blue`, `gold` (+ `thank-you`) — colour lead-capture tests

Two things keep them off the site:

1. Next.js treats folders starting with `_` as private, so nothing under
   `app/_outdated` becomes a route.
2. `next.config.js` redirects `/landing/*`, `/blue` and `/gold` to `/`, so old
   ads, emails and bookmarks land on the home page instead of a 404.

To bring one back: move its folder back under `app/` and remove its redirect.
Their components still live in `components/landing/` (some, like
`FlavourGridServer`, are used by live pages).
