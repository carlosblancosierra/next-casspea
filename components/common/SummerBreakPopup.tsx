'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useStoreStatus } from '@/hooks/useStoreStatus';

const SUMMER_BREAK_CATEGORY = '/landing/summer-break';

// Public announcement switch. Kept OFF while testing so the sale stays private
// (reachable only via the direct /landing/summer-break link). Flip to `true`
// to announce the sale to every visitor at launch.
const ENABLED = true;

export default function SummerBreakPopup() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const { isClosed, reopenLabel } = useStoreStatus();

  useEffect(() => {
    if (!ENABLED) return;
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('hideSummerBreakPopup') === 'true') return;
    const timer = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hideSummerBreakPopup', 'true');
    }
  };

  if (!ENABLED) return null;
  if (pathname && pathname.startsWith('/landing')) return null;
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="relative bg-main-bg dark:bg-main-bg-dark rounded-lg shadow-lg max-w-md w-full mx-4">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-primary-text hover:text-primary-text dark:hover:text-white rounded-lg text-sm w-8 h-8 flex items-center justify-center focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>

        <div className="p-6 text-center">
          <div className="text-3xl mb-2">🌞</div>

          {isClosed ? (
            <>
              <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-2">We're on Summer Break</h3>
              <p className="text-base text-primary-text dark:text-primary-text mb-4">
                Our shop is closed for orders while we take a summer break.<br />
                We'll be back <b>{reopenLabel}</b> — see you then!
              </p>
              <button
                onClick={handleClose}
                className="mt-2 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                OK, got it!
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-primary-text dark:text-white mb-2">Summer Break Sale — 25% Off</h3>
              <p className="text-base text-primary-text dark:text-primary-text mb-4">
                We're closing the kitchen for the summer break from <b>31 July</b>.
                This week only, our <b>Summer Break boxes are 25% off</b> to clear the shelves before we go.
                <br />
                <span className="text-pink-600 font-semibold mt-2 inline-block">
                  Order by <b>Friday 31 July, 12pm</b>.
                </span>
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href={SUMMER_BREAK_CATEGORY}
                  onClick={handleClose}
                  className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  Shop 25% Off Boxes
                </Link>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 text-primary-text dark:text-primary-text-light rounded-lg font-medium hover:underline focus:outline-none"
                >
                  No thanks
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
