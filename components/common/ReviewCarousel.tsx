'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { FaStar } from 'react-icons/fa';

const reviews = [
  {
    name: 'Tom S',
    date: 'May 2026',
    quote: 'The chocolates were like no others I\'ve ever tried — unique flavours I never thought of trying. My favourites were the Whisky & Vanilla Caramel and Baileys & Coffee. Whether for yourself or a gift, they will not disappoint.',
  },
  {
    name: 'Kim',
    date: 'May 2026',
    quote: 'This is my 3rd order — sensational in presentation and taste. They make the most beautiful gift and you can tell every chocolate is crafted with great love and care.',
  },
  {
    name: 'Ali Stoney',
    date: 'Mar 2026',
    quote: 'Definitely THE best chocolates I\'ve ever tasted in my 63 years on this planet — way better than Hotel Chocolat!',
  },
  {
    name: 'Claire',
    date: 'Apr 2026',
    quote: 'The Caramel Kiss Brownie Heart was honestly probably the most delicious thing I\'ve ever eaten! And it looked beautiful too. It wasn\'t cheap but it was definitely worth it.',
  },
  {
    name: 'Patriciagbom',
    date: 'Jun 2026',
    quote: 'The fact that the chef-owner makes every single chocolate from start to finish is incredible. The service is amazing and the chocolates even more so.',
  },
  {
    name: 'Stuart Wharf',
    date: 'Jan 2026',
    quote: 'This is our second box — they are exquisite. Nothing compares to the taste and presentation of these chocolates.',
  },
  {
    name: 'Sean Headley',
    date: 'Dec 2025',
    quote: 'Enjoyed them so much I went back for two more. Truly unique chocolates and beautifully packaged. I would warmly recommend CassPea.',
  },
  {
    name: 'Rose',
    date: 'Dec 2025',
    quote: 'My go-to for gifting — they look so beautiful, almost too good to eat. Really feel like a special gift to receive.',
  },
];

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
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="w-3.5 h-3.5 text-yellow-400" />
          ))}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Trustpilot</span>
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
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <FaStar key={s} className="w-3 h-3 text-yellow-400" />
                ))}
              </div>
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
    </div>
  );
}
