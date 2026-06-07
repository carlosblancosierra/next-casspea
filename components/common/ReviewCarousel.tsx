'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FaStar } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

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
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fading, setFading] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % reviews.length);
      setFading(false);
    }, 250);
  }, []);

  const prev = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setCurrent(p => (p - 1 + reviews.length) % reviews.length);
      setFading(false);
    }, 250);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [paused, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? next() : prev();
    }
    touchStartX.current = null;
    setPaused(false);
  };

  const goTo = (index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 250);
  };

  const review = reviews[current];

  return (
    <div
      className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-main-bg-dark shadow-md p-5 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header: stars + trustpilot label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="w-3.5 h-3.5 text-yellow-400" />
          ))}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Trustpilot</span>
      </div>

      {/* Quote */}
      <div
        className="transition-opacity duration-250 min-h-[5rem]"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <p className="text-sm text-primary-text dark:text-primary-text-light leading-relaxed italic">
          &ldquo;{review.quote}&rdquo;
        </p>
        <p className="mt-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
          {review.name} &middot; {review.date}
        </p>
      </div>

      {/* Footer: dots + next button */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-1.5">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Review ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-4 bg-primary'
                  : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
          aria-label="Next review"
        >
          Next review
          <FiChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
