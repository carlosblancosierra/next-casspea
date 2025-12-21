"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LastCallChristmasPopup() {
  const [show, setShow] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('SUBSCRIBER15');
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
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
            It's not too late to send a beautiful Christmas gift!
          </h3>
          

          <div className="text-white space-y-4 mb-6">

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <p className="font-semibold text-white">
                ⏰ Order before noon Monday 22nd to make it in time for Christmas!
              </p>
            </div>

            {/* Discount code with dark styling */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <p className="text-lg font-bold mb-1">🎁 SPECIAL OFFER</p>
              <p className="text-xl font-black tracking-wider">USE CODE</p>
              <button
                onClick={copyToClipboard}
                className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-full font-bold text-lg inline-block mt-2 shadow-inner transition-colors duration-200 cursor-pointer"
                aria-label="Copy discount code SUBSCRIBER15"
              >
                {copiedCode ? 'COPIED!' : 'SUBSCRIBER15'}
              </button>
              <p className="text-lg font-semibold mt-2">for 15% OFF</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <p className="text-sm leading-relaxed">
                Orders placed by <span className="font-semibold text-white">Monday 22nd, before 12pm (noon)</span> will be dispatched via
                <span className="font-semibold text-white"> Royal Mail Tracked 24®</span>,
                ensuring delivery in time for Christmas.
              </p>
            </div>

          </div>

          <Link
            href="/store"
            className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30"
            onClick={handleClose}
          >
            Shop Christmas Gifts
          </Link>
        </div>
      </div>
    </div>
  );
}
  