"use client";

import { XMarkIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HIDDEN_PATHS = ['/blog', '/landing/gold'];
const BG_COLOR = "#40a6b4";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  if (HIDDEN_PATHS.some(path => pathname?.startsWith(path))) return null;
  if (!isVisible) return null;

  return (
    <div
      className="relative isolate overflow-hidden px-4 py-2"
      style={{ backgroundColor: BG_COLOR }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-y-1.5 sm:gap-x-8 max-w-screen-2xl mx-auto text-primary-text-light">

        {/* Left: trust */}
        <div className="flex items-center gap-x-3 justify-center">
          <Image
            src="/home/stars-4.5.svg"
            alt="Trustpilot 4.7 stars"
            width={80}
            height={20}
            className="inline-block"
          />
          <a
            href="https://uk.trustpilot.com/review/www.casspea.co.uk"
            className="text-sm font-medium text-primary-text-light hover:underline whitespace-nowrap"
            rel="noopener noreferrer"
            target="_blank"
          >
            4.7★ Trustpilot · 66 reviews · 165K+ sold
          </a>
        </div>

        {/* Right: offer */}
        <div className="flex items-center gap-x-4 justify-center">
          <span className="text-sm text-primary-text-light whitespace-nowrap">
            Free shipping over £55
          </span>
          <Link
            href="/subscribe"
            className="rounded-full bg-white/20 hover:bg-white/30 px-3.5 py-1 text-sm text-white font-medium transition whitespace-nowrap"
          >
            10% off — subscribe →
          </Link>
        </div>

      </div>

      <button
        type="button"
        className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 hover:bg-white/20 rounded-full transition"
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss announcement"
      >
        <XMarkIcon aria-hidden="true" className="h-4 w-4 text-primary-text-light" />
      </button>
    </div>
  );
}
