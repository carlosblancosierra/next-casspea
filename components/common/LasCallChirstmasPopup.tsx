"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LastCallChristmasPopup() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // if (sessionStorage.getItem('hideChristmasPopup') === 'true') return;
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    // if (typeof window !== 'undefined') {
    //   sessionStorage.setItem('hideChristmasPopup', 'true');
    // }
  };

  if (pathname && pathname.startsWith("/landing/thermomix")) return null;
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative bg-black rounded-2xl shadow-2xl max-w-lg w-full mx-4 border border-gray-800 overflow-hidden">

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 bg-gray-800/80 hover:bg-gray-700/80 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
          aria-label="Close"
        >
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>

        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
            🎄 Merry Christmas from CassPea! 🎄
          </h3>
          

          <div className="text-white space-y-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <p className="text-lg leading-relaxed mb-4">
                Thank you so much for such an amazing Christmas, always for being so greatly appreciated.
              </p>
              <p className="text-lg font-semibold text-center text-yellow-300 mb-4">
                🎄 We are now closed until the 6th of January 🎄
              </p>
              <p className="text-lg leading-relaxed">
                We'll see you then. Hope you have a lovely Christmas and New Year's, and timely luck.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <p className="text-base leading-relaxed">
                <span className="font-semibold">📦 Important:</span> Any orders placed from now on will be dispatched on the <span className="font-semibold text-yellow-300">10th of January</span>.
              </p>
            </div>
          </div>

          <Link
            href="/store"
            className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30"
            onClick={handleClose}
          >
            🎁 Place Order for January Delivery
          </Link>
        </div>
      </div>
    </div>
  );
}
  