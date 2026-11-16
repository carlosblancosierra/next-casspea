'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import TrustpilotRating, { TRUSTPILOT_URL } from './TrustpilotRating';
import { buttonClasses } from './Button';
import { TRUSTPILOT_REVIEWS } from './trustpilotReviews';

// Every quoted review here is a five-star one, so the cards carry Trustpilot's
// own five-star mark. The 4.5 asset stays where it belongs: on the aggregate,
// which is 4.6.
const SEE_ALL_LINK = buttonClasses({ variant: 'secondary', size: 'sm' });

const reviews = TRUSTPILOT_REVIEWS;

export default function ReviewCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-review-card]');
    const gap = 16;
    const step = card ? card.offsetWidth + gap : el.clientWidth;
    // Loop back to the start once we reach the end.
    if (dir === 1 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: dir * step, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => scrollByCard(1), 4500);
    return () => clearInterval(timer);
  }, [paused, scrollByCard]);

  return (
    <div
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* The rating, and the one link on the page that leaves the site. The
          hero's rating scrolls here instead of to Trustpilot: handing someone
          to another site before they have seen a product is a strange thing
          for a shop to do. Once they have read the reviews, going to read more
          of them is a reasonable thing to want. */}
      <div className="mb-4 flex items-center justify-center">
        <TrustpilotRating href={TRUSTPILOT_URL} />
      </div>

      {/* Horizontally-scrolling row of separate review cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {reviews.map((review, i) => (
          <div
            key={i}
            data-review-card
            className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[47%] lg:w-[31%] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-main-bg-dark shadow-md p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-2">
              <Image
                src="/home/stars-5.svg"
                alt="Rated 5 out of 5"
                width={90}
                height={17}
                className="h-4 w-auto"
              />
            </div>
            <p className="text-sm text-primary-text dark:text-primary-text-light leading-relaxed italic flex-1">
              &ldquo;{review.quote}&rdquo;
            </p>
            <p className="mt-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
              {review.name} &middot; {review.date}
            </p>
          </div>
        ))}
      </div>

      {/* Last, and the only link on the home page that leaves the site. It sits
          after the reviews because that is the point at which going to read
          more of them is a reasonable thing to want. */}
      <div className="mt-5 flex justify-center">
        <a href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer" className={SEE_ALL_LINK}>
          See all reviews
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="sr-only">(opens Trustpilot in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
