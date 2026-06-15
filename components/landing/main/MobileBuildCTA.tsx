'use client';

import { useEffect, useState } from 'react';
import { FiArrowDown } from 'react-icons/fi';

/**
 * Mobile-only sticky CTA that scrolls to the "Build Dad's Box" section.
 * Sits just above the fixed mobile bottom nav (h-16) and hides itself once
 * the build section is on screen.
 */
export default function MobileBuildCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById('build-dads-box');
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const scrollToBuild = () => {
    document.getElementById('build-dads-box')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`md:hidden fixed bottom-16 left-0 right-0 z-40 px-4 transition-all duration-300 ${
        hidden ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <button
        type="button"
        onClick={scrollToBuild}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-fathers-day text-white font-semibold py-3.5 text-base shadow-lg"
      >
        Build Dad&apos;s Box
        <FiArrowDown />
      </button>
    </div>
  );
}
