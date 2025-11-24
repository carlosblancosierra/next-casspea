'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SummerBreakPopup() {
  const [show, setShow] = useState(true);
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setShow(sessionStorage.getItem('hideSummerBreakPopup') !== 'true');
  //   }
  // }, []);
  const handleClose = () => {
    setShow(false);
    // if (typeof window !== 'undefined') {
    //   sessionStorage.setItem('hideSummerBreakPopup', 'true');
    // }
  };
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/landing')) return null;
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 secondary-text hover:secondary-text dark:hover:text-white rounded-lg text-sm w-8 h-8 flex items-center justify-center focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold secondary-text dark:text-white mb-2">Summer Break</h3>
          <p className="text-base secondary-text dark:secondary-text mb-4">
            We are closed for summer break from <b>July 23</b> to <b>August 15</b>.<br />
            <span className="text-pink-600 font-semibold mt-2">
              Orders placed <b>from July 23</b> will begin shipping on <b>August 18</b>.
            </span>
          </p>
          <button
            onClick={handleClose}
            className="mt-2 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            OK, got it!
          </button>
        </div>
      </div>
    </div>
  );
}
