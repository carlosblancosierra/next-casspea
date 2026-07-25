'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SUMMER_BREAK_ENABLED,
  SUMMER_BREAK_COPY,
  SUMMER_BREAK_SHOP_URL,
  arePaymentsBlocked,
} from '@/constants/summerBreak';

const STORAGE_KEY = 'hideSummerBreakPopup';

export default function SummerBreakPopup() {
  const [show, setShow] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!SUMMER_BREAK_ENABLED) return;
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') return;

    setBlocked(arePaymentsBlocked());
    const timer = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  if (!SUMMER_BREAK_ENABLED) return null;
  // Keep the popup off promotional landing pages, matching our other popups.
  if (pathname && pathname.startsWith('/landing')) return null;
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative bg-main-bg dark:bg-main-bg-dark rounded-lg shadow-lg max-w-md w-full">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-primary-text hover:text-primary-text dark:hover:text-white rounded-lg text-sm w-8 h-8 flex items-center justify-center focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>

        {blocked ? (
          // Orders are closed for the summer break.
          <div className="p-6 sm:p-8 text-center">
            <h3 className="text-2xl font-semibold text-primary-text dark:text-white mb-3">
              We&apos;re on our summer break
            </h3>
            <p className="text-base text-primary-text dark:text-primary-text mb-6">
              Our family is taking August off, so the shop is closed for new orders.
              Thank you for your patience &mdash; we can&apos;t wait to welcome you back soon.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Got it
            </button>
          </div>
        ) : (
          // Promo: encourage orders before the break.
          <div className="p-6 sm:p-8 text-center">
            <h3 className="text-2xl font-semibold text-primary-text dark:text-white mb-3">
              {SUMMER_BREAK_COPY.headline}
            </h3>
            <p className="text-base text-primary-text dark:text-primary-text mb-4">
              {SUMMER_BREAK_COPY.subhead}
            </p>
            <p className="text-sm font-semibold text-primary-text dark:text-white mb-1">
              {SUMMER_BREAK_COPY.deadline}
            </p>
            <p className="text-sm text-pink-600 font-semibold mb-6">
              {SUMMER_BREAK_COPY.code}
            </p>
            <Link
              href={SUMMER_BREAK_SHOP_URL}
              onClick={handleClose}
              className="inline-block w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300 transition-colors"
            >
              {SUMMER_BREAK_COPY.button}
            </Link>
            <button
              onClick={handleClose}
              className="mt-3 text-sm text-primary-text dark:text-primary-text-light underline hover:no-underline focus:outline-none"
            >
              {SUMMER_BREAK_COPY.dismiss}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
