"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function GiveawayPopup() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // if (sessionStorage.getItem('hideGiveawayPopup') === 'true') return;
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    // if (typeof window !== 'undefined') {
    //   sessionStorage.setItem('hideGiveawayPopup', 'true');
    // }
  };

  if (pathname && pathname.startsWith("/landing/thermomix")) return null;
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={e => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg text-sm w-8 h-8 flex items-center justify-center focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
        <div className="p-6 text-center flex flex-col items-center w-full mx-auto">
          <div className="relative w-full mb-3">
            <Image
              src="/landings/thermomix/hero-1.jpg"
              alt="Win the Thermomix® TM7 + CassPea Chocolates"
              width={800}
              height={0}
              sizes="100vw"
              className="object-cover w-full h-auto rounded"
              style={{ objectFit: 'cover' }}
              priority={false}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Free Thermomix Giveaway</h3>
          <p className="text-base text-gray-700 dark:text-gray-200 mb-4">
            Enter for a chance to win the all-new <b>Thermomix® TM7</b> and a CassPea Signature Box!
          </p>
          <Link
            href="/landing/thermomix"
            className="mt-2 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
            onClick={handleClose}
          >
            Enter Giveaway
          </Link>
        </div>
      </div>
    </div>
  );
}
