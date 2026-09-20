"use client";

import { XMarkIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Constants
const HIDDEN_PATHS = ['/blog', '/landing/gold'];

type AnnouncementLink = {
  href: string;
  text: string;
};

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const pathname = usePathname();
  
  // Early return if on excluded paths
  if (HIDDEN_PATHS.some(path => pathname?.startsWith(path))) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText('SUBSCRIBER15');
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative isolate overflow-hidden px-6 py-2.5 sm:px-3.5 bg-primary">
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-2 md:gap-x-6 max-w-screen-2xl mx-auto text-primary-text-light">
        <div className="flex flex-col md:flex-row flex-1 justify-center items-center gap-y-2 md:gap-x-8 w-full">
          <p className="text-sm leading-6 w-full md:w-auto text-center text-primary-text-light">
            Free delivery on orders over £56
          </p>
          
          <Link
            href="/subscribe"
            className="w-full md:w-auto text-center rounded-full bg-main-bg px-3.5 py-1 text-sm font-medium text-primary shadow-sm hover:bg-main-bg/90 transition"
          >
            Subscribe for 10% off <span aria-hidden="true">&rarr;</span>
          </Link>

        </div>

        <button
          type="button"
          className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-2 hover:bg-gray-100/20 rounded-full transition"
          onClick={handleClose}
          aria-label="Dismiss announcement"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon aria-hidden="true" className="h-5 w-5 text-primary-text-light" />
        </button>
      </div>
    </div>
  )
}
